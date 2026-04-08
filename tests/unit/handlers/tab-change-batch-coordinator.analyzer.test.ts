import { describe, expect, it, vi } from 'vitest';

import { TabChangeBatchCoordinator } from '../../../src/handlers/tab-change-batch-coordinator';
import { createEmptyResolvedTabChangeEvent } from '../../../src/types/tab-change-proxy';
import type { ResolvedTabChangeEvent } from '../../../src/types/tab-change-proxy';
import { loadAnalyzerScenario } from '../../helpers/event-analyzer-fixture';

function createResolvedEvent(): ResolvedTabChangeEvent {
  return createEmptyResolvedTabChangeEvent();
}

describe('TabChangeBatchCoordinator analyzer fixtures', () => {
  it('replays the real scenario A tab sequence without collapsing the active-state change', () => {
    const fixture = loadAnalyzerScenario('A: open a single file');
    const resolveObservedBucket = vi.fn(() => createResolvedEvent());
    const tracker = {
      resolveObservedBucket,
      reset: vi.fn(),
    };

    const coordinator = new TabChangeBatchCoordinator(tracker as any);
    fixture.observedEvents.forEach((observed) => coordinator.record(observed));

    coordinator.buildResolvedEvent();

    expect(resolveObservedBucket).toHaveBeenCalledTimes(1);

    const [bucket] = resolveObservedBucket.mock.calls[0];
    expect(bucket.beforeSnapshot).toEqual(fixture.observedEvents[0].beforeSnapshot);
    expect(bucket.afterSnapshot).toEqual(
      fixture.observedEvents[fixture.observedEvents.length - 1].afterSnapshot,
    );
    expect(bucket.events).toHaveLength(3);

    const openEvent = bucket.events[0].event;
    const openSnapshot = bucket.events[0].afterSnapshot;
    expect(openEvent.opened).toHaveLength(1);
    expect(openEvent.opened[0].label).toBe('package.json');
    expect(openEvent.closed).toHaveLength(0);
    expect(openEvent.changed).toHaveLength(0);
    expect(openSnapshot.version).toBe(1);

    const changedEvent = bucket.events[1].event;
    const changedSnapshot = bucket.events[1].afterSnapshot;
    expect(changedEvent.opened).toHaveLength(0);
    expect(changedEvent.closed).toHaveLength(0);
    expect(changedEvent.changed).toHaveLength(1);
    expect(changedEvent.changed[0].label).toBe('package.json');
    expect(changedSnapshot.version).toBe(2);

    expect(bucket.events[2].type).toBe('group');
  });

  it('merges duplicate changed-only group events from scenario E', () => {
    const fixture = loadAnalyzerScenario('E: group swap');
    const resolveObservedBucket = vi.fn(() => createResolvedEvent());
    const tracker = {
      resolveObservedBucket,
      reset: vi.fn(),
    };

    const coordinator = new TabChangeBatchCoordinator(tracker as any);
    fixture.observedEvents.forEach((observed) => coordinator.record(observed));

    coordinator.buildResolvedEvent();

    expect(resolveObservedBucket).toHaveBeenCalledTimes(1);

    const [bucket] = resolveObservedBucket.mock.calls[0];
    expect(bucket.events).toHaveLength(1);

    const groupEvent = bucket.events[0].event;
    const afterSnapshot = bucket.events[0].afterSnapshot;
    expect(groupEvent.opened).toHaveLength(0);
    expect(groupEvent.closed).toHaveLength(0);
    expect(groupEvent.changed.map((group: { viewColumn: number }) => group.viewColumn)).toEqual([2, 1]);
    expect(afterSnapshot.version).toBe(2);
  });
});