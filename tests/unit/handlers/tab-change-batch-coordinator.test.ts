import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TabChangeBatchCoordinator } from '../../../src/handlers/tab-change-batch-coordinator';
import { TabObserverService } from '../../../src/services/tab-observer';
import type { ResolvedTabChangeEvent } from '../../../src/types/tab-change-proxy';
import { createEmptyResolvedTabChangeEvent } from '../../../src/types/tab-change-proxy';
import {
  createVSCodeTab,
  createVSCodeTabGroup,
  setWindowTabGroups
} from '../../factories';

function createResolvedEvent(): ResolvedTabChangeEvent {
  return createEmptyResolvedTabChangeEvent();
}

function createResolvedEventForBucket(
  bucketId: number
): ResolvedTabChangeEvent {
  const event = createResolvedEvent();

  return {
    ...event,
    bucketId,
    resolvedBucketDelta: {
      ...event.resolvedBucketDelta,
      bucketId
    }
  };
}

function captureVersioned(version: number) {
  return TabObserverService.withVersion(TabObserverService.capture(), version);
}

describe('TabChangeBatchCoordinator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setWindowTabGroups([]);
  });

  it('compresses duplicate changed-only group events before replay', () => {
    const tab = createVSCodeTab({ filePath: '/workspace/a.ts' });
    const group = createVSCodeTabGroup({ viewColumn: 1, tabs: [tab] });

    setWindowTabGroups([group]);
    const stableSnapshot = captureVersioned(1);

    const tracker = {
      resolveObservedBucket: vi.fn((bucket) =>
        createResolvedEventForBucket(bucket.id)
      ),
      reset: vi.fn()
    };

    const observer = new TabChangeBatchCoordinator(tracker as any);

    observer.record({
      type: 'group',
      event: { opened: [], closed: [], changed: [group] },
      observedAtMs: 10,
      beforeSnapshot: stableSnapshot,
      afterSnapshot: stableSnapshot
    });
    observer.record({
      type: 'group',
      event: { opened: [], closed: [], changed: [group] },
      observedAtMs: 11,
      beforeSnapshot: stableSnapshot,
      afterSnapshot: stableSnapshot
    });

    const result = observer.buildResolvedEvent();

    expect(tracker.resolveObservedBucket).toHaveBeenCalledTimes(1);
    expect(tracker.reset).toHaveBeenCalledTimes(1);
    expect(result.bucketId).toBeGreaterThan(0);
    expect(result.resolvedBucketDelta.bucketId).toBe(result.bucketId);
    expect(result.tabRewireDeltas).toHaveLength(0);
  });

  it('short-circuits deep snapshot comparison when versions already match', () => {
    const tab = createVSCodeTab({ filePath: '/workspace/a.ts' });
    const group = createVSCodeTabGroup({ viewColumn: 1, tabs: [tab] });

    setWindowTabGroups([group]);
    const firstSnapshot = captureVersioned(7);
    const secondSnapshot = captureVersioned(7);
    const snapshotEqualsSpy = vi.spyOn(TabObserverService, 'snapshotEquals');

    const tracker = {
      resolveObservedBucket: vi.fn((bucket) =>
        createResolvedEventForBucket(bucket.id)
      ),
      reset: vi.fn()
    };

    const observer = new TabChangeBatchCoordinator(tracker as any);

    observer.record({
      type: 'group',
      event: { opened: [], closed: [], changed: [group] },
      observedAtMs: 10,
      beforeSnapshot: firstSnapshot,
      afterSnapshot: firstSnapshot
    });
    observer.record({
      type: 'group',
      event: { opened: [], closed: [], changed: [group] },
      observedAtMs: 11,
      beforeSnapshot: secondSnapshot,
      afterSnapshot: secondSnapshot
    });

    observer.buildResolvedEvent();

    expect(snapshotEqualsSpy).not.toHaveBeenCalled();
  });

  it('absorbs a redundant changed event that immediately follows an open', () => {
    const beforeSnapshot = captureVersioned(0);
    const tab = createVSCodeTab({
      filePath: '/workspace/a.ts',
      isActive: true
    });
    const group = createVSCodeTabGroup({
      viewColumn: 1,
      tabs: [tab],
      isActive: true,
      activeTab: tab
    });

    setWindowTabGroups([group]);
    const afterSnapshot = captureVersioned(1);

    const tracker = {
      resolveObservedBucket: vi.fn((bucket) =>
        createResolvedEventForBucket(bucket.id)
      ),
      reset: vi.fn()
    };

    const observer = new TabChangeBatchCoordinator(tracker as any);

    observer.record({
      type: 'tab',
      event: { opened: [tab], closed: [], changed: [] },
      observedAtMs: 20,
      beforeSnapshot,
      afterSnapshot
    });
    observer.record({
      type: 'tab',
      event: { opened: [], closed: [], changed: [tab] },
      observedAtMs: 21,
      beforeSnapshot: afterSnapshot,
      afterSnapshot
    });

    observer.buildResolvedEvent();

    expect(tracker.resolveObservedBucket).toHaveBeenCalledTimes(1);
    expect(tracker.resolveObservedBucket).toHaveBeenCalledWith(
      expect.objectContaining({
        beforeSnapshot,
        afterSnapshot,
        events: [
          expect.objectContaining({
            type: 'tab',
            event: { opened: [tab], closed: [], changed: [] }
          })
        ]
      })
    );
  });
});
