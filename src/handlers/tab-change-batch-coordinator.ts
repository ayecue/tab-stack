import { TabObserverService } from '../services/tab-observer';
import {
  CompressedObservedEvent,
  createEmptyResolvedTabChangeEvent,
  GroupChangeEventPayload,
  ObservedBucket,
  ObservedWindowEvent,
  RecordedObservedEvent,
  ResolvedTabChangeEvent,
  TabChangeEventPayload
} from '../types/tab-change-proxy';
import { TabChangeResolver } from './tab-change';

export class TabChangeBatchCoordinator {
  private _events: RecordedObservedEvent[] = [];
  private _seq = 0;
  private _nextBucketId = 1;
  private readonly _tracker: TabChangeResolver;

  constructor(tracker: TabChangeResolver) {
    this._tracker = tracker;
  }

  record(observed: ObservedWindowEvent): void {
    this._events.push({
      seq: this._seq++,
      ...observed
    });
  }

  buildResolvedEvent(): ResolvedTabChangeEvent {
    if (this._events.length === 0) {
      return createEmptyResolvedTabChangeEvent();
    }

    try {
      const compressed = this._compress(this._events);
      const bucket = this._buildObservedBucket(compressed);
      return this._tracker.resolveObservedBucket(bucket);
    } finally {
      this.reset();
    }
  }

  reset(): void {
    this._events = [];
    this._seq = 0;
    this._tracker.reset();
  }

  private _buildObservedBucket(
    compressed: CompressedObservedEvent[]
  ): ObservedBucket {
    const firstObserved = this._events[0];
    const lastObserved = this._events[this._events.length - 1];

    return {
      id: this._nextBucketId++,
      observedFromMs: firstObserved.observedAtMs,
      observedToMs: lastObserved.observedAtMs,
      beforeSnapshot: compressed[0].beforeSnapshot,
      afterSnapshot: compressed[compressed.length - 1].afterSnapshot,
      events: compressed
    };
  }

  private _compress(
    events: RecordedObservedEvent[]
  ): CompressedObservedEvent[] {
    const compressed: CompressedObservedEvent[] = [];

    for (const observed of events) {
      const current = this._toCompressedEvent(observed);
      const previous = compressed[compressed.length - 1];

      if (!previous) {
        compressed.push(current);
        continue;
      }

      if (this._shouldMergeDuplicateGroupEvent(previous, observed)) {
        previous.afterSnapshot = observed.afterSnapshot;
        continue;
      }

      if (this._shouldAbsorbChangedAfterOpen(previous, observed)) {
        previous.afterSnapshot = observed.afterSnapshot;
        continue;
      }

      compressed.push(current);
    }

    return compressed;
  }

  private _toCompressedEvent(
    observed: RecordedObservedEvent
  ): CompressedObservedEvent {
    return {
      type: observed.type,
      event: observed.event,
      beforeSnapshot: observed.beforeSnapshot,
      afterSnapshot: observed.afterSnapshot
    };
  }

  private _shouldMergeDuplicateGroupEvent(
    previous: CompressedObservedEvent,
    current: RecordedObservedEvent
  ): boolean {
    if (previous.type !== 'group' || current.type !== 'group') {
      return false;
    }

    if (
      !this._isChangedOnlyGroupEvent(previous.event as GroupChangeEventPayload)
    ) {
      return false;
    }

    if (!this._isChangedOnlyGroupEvent(current.event)) {
      return false;
    }

    return this._snapshotsMatch(previous.afterSnapshot, current.afterSnapshot);
  }

  private _shouldAbsorbChangedAfterOpen(
    previous: CompressedObservedEvent,
    current: RecordedObservedEvent
  ): boolean {
    if (previous.type !== 'tab' || current.type !== 'tab') {
      return false;
    }

    const previousEvent = previous.event as TabChangeEventPayload;
    const currentEvent = current.event as TabChangeEventPayload;

    if (
      previousEvent.opened.length === 0 ||
      previousEvent.closed.length > 0 ||
      previousEvent.changed.length > 0 ||
      currentEvent.opened.length > 0 ||
      currentEvent.closed.length > 0 ||
      currentEvent.changed.length === 0
    ) {
      return false;
    }

    if (previousEvent.opened.length !== currentEvent.changed.length) {
      return false;
    }

    const openedTabs = new Set(previousEvent.opened);
    const sameTabs = currentEvent.changed.every((tab) => openedTabs.has(tab));
    if (!sameTabs) {
      return false;
    }

    return this._snapshotsMatch(previous.afterSnapshot, current.afterSnapshot);
  }

  private _isChangedOnlyGroupEvent(event: GroupChangeEventPayload): boolean {
    return (
      event.opened.length === 0 &&
      event.closed.length === 0 &&
      event.changed.length > 0
    );
  }

  private _snapshotsMatch(
    previous: CompressedObservedEvent['afterSnapshot'],
    current: RecordedObservedEvent['afterSnapshot']
  ): boolean {
    if (previous.version === current.version) {
      return true;
    }

    return TabObserverService.snapshotEquals(previous, current);
  }
}
