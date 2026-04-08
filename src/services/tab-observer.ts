import { Disposable, Event, EventEmitter, Tab, TabGroup, window } from 'vscode';

import type {
  GroupChangeEventPayload,
  GroupEntrySnapshot,
  ObservedGroupEvent,
  ObservedTabEvent,
  TabChangeEventPayload,
  TabEntrySnapshot,
  VersionedWindowSnapshot,
  WindowSnapshot
} from '../types/tab-change-proxy';
import {
  buildTabSnapshotClues,
  createTabKeyByViewColumn
} from '../utils/tab-utils';

export class TabObserverService implements Disposable {
  private _currentSnapshot: VersionedWindowSnapshot;
  private _muted = false;
  private _tabEventEmitter = new EventEmitter<ObservedTabEvent>();
  private _groupEventEmitter = new EventEmitter<ObservedGroupEvent>();
  private _disposables: Disposable[] = [];

  constructor() {
    this._currentSnapshot = TabObserverService.withVersion(
      TabObserverService.capture(),
      0
    );
    this._attach();
  }

  get onDidObserveTabEvent(): Event<ObservedTabEvent> {
    return this._tabEventEmitter.event;
  }

  get onDidObserveGroupEvent(): Event<ObservedGroupEvent> {
    return this._groupEventEmitter.event;
  }

  get currentSnapshot(): VersionedWindowSnapshot {
    return this._currentSnapshot;
  }

  mute(): void {
    this._muted = true;
  }

  unmute(): void {
    this._currentSnapshot = this._captureNextSnapshot();
    this._muted = false;
  }

  dispose(): void {
    this._disposables.forEach((disposable) => disposable.dispose());
    this._disposables = [];
    this._tabEventEmitter.dispose();
    this._groupEventEmitter.dispose();
  }

  static snapshotEquals(
    left: WindowSnapshot | VersionedWindowSnapshot,
    right: WindowSnapshot | VersionedWindowSnapshot
  ): boolean {
    if (left === right) return true;
    if (left.tabs === right.tabs && left.groups === right.groups) return true;
    if (
      left.tabs.size !== right.tabs.size ||
      left.groups.size !== right.groups.size
    ) {
      return false;
    }

    for (const [tabKey, leftEntry] of left.tabs) {
      const rightEntry = right.tabs.get(tabKey);
      if (!rightEntry) {
        return false;
      }

      if (
        leftEntry.viewColumn !== rightEntry.viewColumn ||
        leftEntry.index !== rightEntry.index ||
        leftEntry.isActive !== rightEntry.isActive ||
        leftEntry.isDirty !== rightEntry.isDirty ||
        leftEntry.isPinned !== rightEntry.isPinned ||
        leftEntry.isPreview !== rightEntry.isPreview
      ) {
        return false;
      }
    }

    for (const [viewColumn, leftEntry] of left.groups) {
      const rightEntry = right.groups.get(viewColumn);
      if (!rightEntry) {
        return false;
      }

      if (
        leftEntry.fingerprint !== rightEntry.fingerprint ||
        leftEntry.isActive !== rightEntry.isActive
      ) {
        return false;
      }
    }

    return true;
  }

  private _attach(): void {
    this._disposables.push(
      window.tabGroups.onDidChangeTabs((event) => {
        this._observeTabEvent({
          opened: event.opened,
          closed: event.closed,
          changed: event.changed
        });
      }),
      window.tabGroups.onDidChangeTabGroups((event) => {
        this._observeGroupEvent({
          opened: event.opened,
          closed: event.closed,
          changed: event.changed
        });
      })
    );
  }

  private _observeTabEvent(event: TabChangeEventPayload): void {
    if (this._muted) {
      return;
    }

    const beforeSnapshot = this.currentSnapshot;
    const afterSnapshot = this._captureNextSnapshot();
    this._currentSnapshot = afterSnapshot;

    this._tabEventEmitter.fire({
      type: 'tab',
      event,
      observedAtMs: Date.now(),
      beforeSnapshot,
      afterSnapshot
    });
  }

  private _observeGroupEvent(event: GroupChangeEventPayload): void {
    if (this._muted) {
      return;
    }

    const beforeSnapshot = this.currentSnapshot;
    const afterSnapshot = this._captureNextSnapshot();
    this._currentSnapshot = afterSnapshot;

    this._groupEventEmitter.fire({
      type: 'group',
      event,
      observedAtMs: Date.now(),
      beforeSnapshot,
      afterSnapshot
    });
  }

  private _captureNextSnapshot(): VersionedWindowSnapshot {
    const freshSnapshot = TabObserverService.capture();
    const nextVersion = TabObserverService.snapshotEquals(
      this._currentSnapshot,
      freshSnapshot
    )
      ? this._currentSnapshot.version
      : this._currentSnapshot.version + 1;

    return TabObserverService.withVersion(freshSnapshot, nextVersion);
  }

  // ── Static snapshot utilities (formerly WindowSnapshotService) ─────

  static capture(): WindowSnapshot {
    const tabs = new Map<string, TabEntrySnapshot>();
    const groups = new Map<number, GroupEntrySnapshot>();

    for (const group of window.tabGroups.all) {
      const groupEntry = TabObserverService.snapshotGroup(group);

      groups.set(group.viewColumn, groupEntry);

      for (let i = 0; i < group.tabs.length; i++) {
        const entry = TabObserverService.snapshotTab(
          group.tabs[i],
          group.viewColumn,
          i,
          groupEntry.fingerprintClue
        );
        tabs.set(entry.exactKeyClue, entry);
      }
    }

    return { tabs, groups };
  }

  static clone(snapshot: WindowSnapshot): WindowSnapshot {
    return {
      tabs: new Map(
        [...snapshot.tabs.entries()].map(([key, entry]) => [key, { ...entry }])
      ),
      groups: new Map(
        [...snapshot.groups.entries()].map(([key, entry]) => [
          key,
          { ...entry }
        ])
      )
    };
  }

  /**
   * Wrap a snapshot with a version number.
   *
   * Uses structural sharing — the returned object references the same
   * Maps as the input.  This is safe because the pipeline never mutates
   * a WindowSnapshot after creation; session-local copies are built via
   * TabChangeSession.createSnapshotByRef().
   */
  static withVersion(
    snapshot: WindowSnapshot,
    version: number
  ): VersionedWindowSnapshot {
    return {
      tabs: snapshot.tabs,
      groups: snapshot.groups,
      version
    };
  }

  static snapshotTab(
    tab: Tab,
    viewColumn: number,
    index: number,
    groupFingerprintClue = ''
  ): TabEntrySnapshot {
    const clues = buildTabSnapshotClues(tab, viewColumn, index);

    return {
      tab,
      exactKeyClue: clues.exactKeyClue,
      localRefClue: clues.localRefClue,
      globalRefClue: clues.globalRefClue,
      groupFingerprintClue,
      viewColumn,
      index,
      isActive: tab.isActive,
      isDirty: tab.isDirty,
      isPinned: tab.isPinned,
      isPreview: tab.isPreview
    };
  }

  static computeFingerprint(group: TabGroup): string {
    return group.tabs
      .map((tab, idx) => createTabKeyByViewColumn(tab, 0, idx))
      .join('\n');
  }

  static snapshotGroup(group: TabGroup): GroupEntrySnapshot {
    const fingerprintClue = TabObserverService.computeFingerprint(group);

    return {
      group,
      viewColumn: group.viewColumn,
      fingerprintClue,
      fingerprint: fingerprintClue,
      isActive: group.isActive
    };
  }
}
