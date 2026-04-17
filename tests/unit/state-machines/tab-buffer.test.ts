import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createActor } from 'xstate';

import { tabBufferMachine, BUFFER_DELAY } from '../../../src/state-machines/tab-buffer';
import { createEmptyResolvedTabChangeEvent } from '../../../src/types/tab-change-proxy';
import type {
  ObservedTabEvent,
  ObservedGroupEvent,
  ResolvedTabChangeEvent,
  VersionedWindowSnapshot,
} from '../../../src/types/tab-change-proxy';

function createEmptySnapshot(version = 0): VersionedWindowSnapshot {
  return { tabs: new Map(), groups: new Map(), version };
}

function createResolvedEvent(): ResolvedTabChangeEvent {
  return createEmptyResolvedTabChangeEvent();
}

function fakeTabEvent(version = 0): ObservedTabEvent {
  const snap = createEmptySnapshot(version);
  return {
    type: 'tab',
    event: { opened: [], closed: [], changed: [] },
    observedAtMs: Date.now(),
    beforeSnapshot: snap,
    afterSnapshot: snap,
  };
}

function fakeGroupEvent(version = 0): ObservedGroupEvent {
  const snap = createEmptySnapshot(version);
  return {
    type: 'group',
    event: { opened: [], closed: [], changed: [] },
    observedAtMs: Date.now(),
    beforeSnapshot: snap,
    afterSnapshot: snap,
  };
}

describe('tabBufferMachine', () => {
  let observer: {
    record: ReturnType<typeof vi.fn>;
    buildResolvedEvent: ReturnType<typeof vi.fn>;
    reset: ReturnType<typeof vi.fn>;
  };
  let tabObserverService: {
    mute: ReturnType<typeof vi.fn>;
    unmute: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.useFakeTimers();
    observer = {
      record: vi.fn(),
      buildResolvedEvent: vi.fn(() => createResolvedEvent()),
      reset: vi.fn(),
    };
    tabObserverService = {
      mute: vi.fn(),
      unmute: vi.fn(),
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function createTabBufferActor() {
    return createActor(tabBufferMachine, {
      input: {
        observer: observer as any,
        tabObserverService: tabObserverService as any,
      },
    });
  }

  describe('idle state', () => {
    it('starts in idle state', () => {
      const actor = createTabBufferActor();
      actor.start();
      expect(actor.getSnapshot().value).toBe('idle');
      actor.stop();
    });

    it('transitions to buffering on RAW_TAB_EVENT', () => {
      const actor = createTabBufferActor();
      actor.start();
      actor.send({ type: 'RAW_TAB_EVENT', observed: fakeTabEvent() });
      expect(actor.getSnapshot().value).toBe('buffering');
      actor.stop();
    });

    it('transitions to buffering on RAW_GROUP_EVENT', () => {
      const actor = createTabBufferActor();
      actor.start();
      actor.send({ type: 'RAW_GROUP_EVENT', observed: fakeGroupEvent() });
      expect(actor.getSnapshot().value).toBe('buffering');
      actor.stop();
    });

    it('records the observed event on transition to buffering', () => {
      const actor = createTabBufferActor();
      actor.start();

      const observed = fakeTabEvent();
      actor.send({ type: 'RAW_TAB_EVENT', observed });

      expect(observer.record).toHaveBeenCalledOnce();
      expect(observer.record).toHaveBeenCalledWith(observed);
      actor.stop();
    });

    it('transitions to muted on MUTE', () => {
      const actor = createTabBufferActor();
      actor.start();
      actor.send({ type: 'MUTE' });
      expect(actor.getSnapshot().value).toBe('muted');
      actor.stop();
    });

    it('resets observer and mutes service on MUTE', () => {
      const actor = createTabBufferActor();
      actor.start();
      actor.send({ type: 'MUTE' });

      expect(observer.reset).toHaveBeenCalledOnce();
      expect(tabObserverService.mute).toHaveBeenCalledOnce();
      actor.stop();
    });
  });

  describe('buffering state', () => {
    it('records additional events while buffering', () => {
      const actor = createTabBufferActor();
      actor.start();

      actor.send({ type: 'RAW_TAB_EVENT', observed: fakeTabEvent() });
      actor.send({ type: 'RAW_GROUP_EVENT', observed: fakeGroupEvent() });
      actor.send({ type: 'RAW_TAB_EVENT', observed: fakeTabEvent() });

      expect(observer.record).toHaveBeenCalledTimes(3);
      expect(actor.getSnapshot().value).toBe('buffering');
      actor.stop();
    });

    it('emits resolved event and returns to idle after BUFFER_DELAY', () => {
      const actor = createTabBufferActor();
      const emitted: ResolvedTabChangeEvent[] = [];
      actor.on('resolved', (e) => emitted.push(e.event));
      actor.start();

      actor.send({ type: 'RAW_TAB_EVENT', observed: fakeTabEvent() });
      expect(actor.getSnapshot().value).toBe('buffering');

      vi.advanceTimersByTime(BUFFER_DELAY);

      expect(actor.getSnapshot().value).toBe('idle');
      expect(observer.buildResolvedEvent).toHaveBeenCalledOnce();
      expect(emitted).toHaveLength(1);
      actor.stop();
    });

    it('resets the delay timer when a new event arrives (reenter)', () => {
      const actor = createTabBufferActor();
      const emitted: ResolvedTabChangeEvent[] = [];
      actor.on('resolved', (e) => emitted.push(e.event));
      actor.start();

      actor.send({ type: 'RAW_TAB_EVENT', observed: fakeTabEvent() });

      // Advance partway through the delay
      vi.advanceTimersByTime(BUFFER_DELAY - 100);
      expect(actor.getSnapshot().value).toBe('buffering');
      expect(emitted).toHaveLength(0);

      // Send another event — should reset the timer
      actor.send({ type: 'RAW_TAB_EVENT', observed: fakeTabEvent() });

      // Advance by another partial amount — still buffering
      vi.advanceTimersByTime(BUFFER_DELAY - 100);
      expect(actor.getSnapshot().value).toBe('buffering');
      expect(emitted).toHaveLength(0);

      // Now advance to fire the timer
      vi.advanceTimersByTime(100);
      expect(actor.getSnapshot().value).toBe('idle');
      expect(emitted).toHaveLength(1);
      actor.stop();
    });

    it('transitions to muted on MUTE, discarding buffered events', () => {
      const actor = createTabBufferActor();
      const emitted: ResolvedTabChangeEvent[] = [];
      actor.on('resolved', (e) => emitted.push(e.event));
      actor.start();

      actor.send({ type: 'RAW_TAB_EVENT', observed: fakeTabEvent() });
      actor.send({ type: 'RAW_TAB_EVENT', observed: fakeTabEvent() });
      actor.send({ type: 'MUTE' });

      expect(actor.getSnapshot().value).toBe('muted');
      expect(observer.reset).toHaveBeenCalledOnce();
      expect(tabObserverService.mute).toHaveBeenCalledOnce();

      // The delay should have been cancelled — no emission after BUFFER_DELAY
      vi.advanceTimersByTime(BUFFER_DELAY * 2);
      expect(emitted).toHaveLength(0);
      expect(observer.buildResolvedEvent).not.toHaveBeenCalled();
      actor.stop();
    });
  });

  describe('muted state', () => {
    it('ignores RAW_TAB_EVENT while muted', () => {
      const actor = createTabBufferActor();
      actor.start();

      actor.send({ type: 'MUTE' });
      actor.send({ type: 'RAW_TAB_EVENT', observed: fakeTabEvent() });

      expect(actor.getSnapshot().value).toBe('muted');
      // record should only have been called 0 times (MUTE resets, RAW event is ignored)
      expect(observer.record).not.toHaveBeenCalled();
      actor.stop();
    });

    it('ignores RAW_GROUP_EVENT while muted', () => {
      const actor = createTabBufferActor();
      actor.start();

      actor.send({ type: 'MUTE' });
      actor.send({ type: 'RAW_GROUP_EVENT', observed: fakeGroupEvent() });

      expect(actor.getSnapshot().value).toBe('muted');
      expect(observer.record).not.toHaveBeenCalled();
      actor.stop();
    });

    it('transitions to idle on UNMUTE', () => {
      const actor = createTabBufferActor();
      actor.start();

      actor.send({ type: 'MUTE' });
      actor.send({ type: 'UNMUTE' });

      expect(actor.getSnapshot().value).toBe('idle');
      expect(tabObserverService.unmute).toHaveBeenCalledOnce();
      actor.stop();
    });

    it('resumes normal buffering after UNMUTE', () => {
      const actor = createTabBufferActor();
      const emitted: ResolvedTabChangeEvent[] = [];
      actor.on('resolved', (e) => emitted.push(e.event));
      actor.start();

      actor.send({ type: 'MUTE' });
      actor.send({ type: 'UNMUTE' });
      actor.send({ type: 'RAW_TAB_EVENT', observed: fakeTabEvent() });

      expect(actor.getSnapshot().value).toBe('buffering');

      vi.advanceTimersByTime(BUFFER_DELAY);

      expect(actor.getSnapshot().value).toBe('idle');
      expect(emitted).toHaveLength(1);
      actor.stop();
    });
  });
});
