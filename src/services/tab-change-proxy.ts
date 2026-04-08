import { Disposable, Event, EventEmitter } from 'vscode';
import { Actor, createActor } from 'xstate';

import { TabChangeResolver } from '../handlers/tab-change';
import { TabChangeBatchCoordinator } from '../handlers/tab-change-batch-coordinator';
import { tabBufferMachine } from '../state-machines/tab-buffer';
import {
  createEmptyResolvedTabChangeEvent,
  createResolvedBucketDelta,
  projectSnapshotBaselineToResolvedEvent,
  ResolvedTabChangeEvent,
  WindowSnapshot
} from '../types/tab-change-proxy';
import { getLogger, ScopedLogger } from './logger';
import { TabObserverService } from './tab-observer';

export class TabChangeProxyService implements Disposable {
  /**
   * The actual buffer delay is owned by `tabBufferMachine` in
   * `src/state-machines/tab-buffer.ts` (BUFFER_DELAY).
   * Import it from there if you need the value.
   */

  private _tabHandler: TabChangeResolver;
  private _tabObserver: TabChangeBatchCoordinator;
  private _tabObserverService: TabObserverService;

  private _tabActor: Actor<typeof tabBufferMachine>;

  private _tabEmitter: EventEmitter<ResolvedTabChangeEvent>;
  private _disposables: Disposable[];
  private _log: ScopedLogger;
  private _lastSnapshotBaseline: WindowSnapshot | null = null;

  constructor() {
    this._tabHandler = new TabChangeResolver();
    this._tabObserver = new TabChangeBatchCoordinator(this._tabHandler);
    this._tabObserverService = new TabObserverService();

    this._tabEmitter = new EventEmitter<ResolvedTabChangeEvent>();
    this._disposables = [];
    this._log = getLogger().child('TabChangeProxy');

    this._tabActor = createActor(tabBufferMachine, {
      input: {
        observer: this._tabObserver,
        tabObserverService: this._tabObserverService
      }
    });

    this.attach();
  }

  private attach() {
    this._tabActor.on('resolved', (emitted) => {
      const { created, closed, moved, updated } = emitted.event;
      this._log.debug(
        `resolved: created=${created.length} closed=${closed.length} moved=${moved.length} updated=${updated.length}`
      );
      if (created.length || closed.length || moved.length || updated.length) {
        this._tabEmitter.fire(emitted.event);
      }
    });

    this._tabActor.start();

    this._disposables.push(
      this._tabObserverService.onDidObserveTabEvent((observed) => {
        this._log.debug(
          `raw tab event: opened=${observed.event.opened.length} closed=${observed.event.closed.length} changed=${observed.event.changed.length} snapshotVersion=${observed.afterSnapshot.version}`
        );
        this._tabActor.send({ type: 'RAW_TAB_EVENT', observed });
      }),
      this._tabObserverService.onDidObserveGroupEvent((observed) => {
        this._log.debug(
          `raw group event: opened=${observed.event.opened.length} closed=${observed.event.closed.length} changed=${observed.event.changed.length}`
        );
        this._tabActor.send({ type: 'RAW_GROUP_EVENT', observed });
      }),
      this._tabObserverService,
      this._tabEmitter
    );
  }

  get onDidChangeTabs(): Event<ResolvedTabChangeEvent> {
    return this._tabEmitter.event;
  }

  createSnapshotEvent(): ResolvedTabChangeEvent {
    const snapshot = this._tabObserverService.currentSnapshot;
    const beforeSnapshot =
      this._lastSnapshotBaseline ??
      createEmptyResolvedTabChangeEvent('snapshot').beforeSnapshot;
    const projection = projectSnapshotBaselineToResolvedEvent(
      beforeSnapshot,
      snapshot
    );
    const bucketId = snapshot.version;
    const resolvedBucketDelta = createResolvedBucketDelta(
      'snapshot',
      bucketId,
      beforeSnapshot,
      snapshot,
      [...projection.tabRewireDeltas]
    );
    const event: ResolvedTabChangeEvent = {
      ...createEmptyResolvedTabChangeEvent('snapshot'),
      bucketId,
      created: projection.created,
      closed: projection.closed,
      updated: projection.updated,
      createdEntries: projection.createdEntries,
      closedEntries: projection.closedEntries,
      beforeSnapshot,
      afterSnapshot: snapshot,
      tabRewireDeltas: projection.tabRewireDeltas,
      resolvedBucketDelta
    };

    this._lastSnapshotBaseline = TabObserverService.clone(snapshot);

    return event;
  }

  mute(): void {
    this._tabActor.send({ type: 'MUTE' });
  }

  unmute(): void {
    this._tabActor.send({ type: 'UNMUTE' });
  }

  dispose(): void {
    this._tabActor.stop();
    this._disposables.forEach((d) => d.dispose());
    this._disposables = [];
  }
}
