import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { window } from 'vscode';

import { TabChangeProxyService } from '../../../src/services/tab-change-proxy';
import { BUFFER_DELAY } from '../../../src/state-machines/tab-buffer';
import type { ResolvedTabChangeEvent } from '../../../src/types/tab-change-proxy';
import {
  createVSCodeTab,
  createVSCodeTabGroup,
  setWindowTabGroups
} from '../../factories';

describe('TabChangeProxyService', () => {
  let tabChangeCbs: Array<(e: any) => void>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    tabChangeCbs = [];

    (window.tabGroups as any).onDidChangeTabs = vi.fn((cb: any) => {
      tabChangeCbs.push(cb);
      return { dispose: vi.fn() };
    });
    (window.tabGroups as any).onDidChangeTabGroups = vi.fn(() => ({
      dispose: vi.fn()
    }));

    setWindowTabGroups([]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function fireTabEvent(event: {
    opened?: any[];
    closed?: any[];
    changed?: any[];
  }) {
    const normalized = {
      opened: event.opened ?? [],
      closed: event.closed ?? [],
      changed: event.changed ?? []
    };
    for (const cb of tabChangeCbs) {
      cb(normalized);
    }
  }

  it('emits resolved event after buffer delay', () => {
    const proxy = new TabChangeProxyService();
    const events: ResolvedTabChangeEvent[] = [];
    proxy.onDidChangeTabs((e) => events.push(e));

    try {
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

      fireTabEvent({ opened: [tab] });

      expect(events).toHaveLength(0);

      vi.advanceTimersByTime(BUFFER_DELAY);

      expect(events).toHaveLength(1);
      expect(
        events[0].created.length +
          events[0].closed.length +
          events[0].moved.length +
          events[0].updated.length
      ).toBeGreaterThan(0);
      expect(events[0].source).toBe('delta');
      expect(
        events[0].createdEntries.get(events[0].created[0])?.exactKeyClue
      ).toBeDefined();
      expect(events[0].bucketId).toBeGreaterThan(0);
      expect(events[0].tabRewireDeltas.length).toBeGreaterThan(0);
      expect(events[0].resolvedBucketDelta.bucketId).toBe(events[0].bucketId);
      expect(events[0].resolvedBucketDelta.tabRewireDeltas).toEqual(
        events[0].tabRewireDeltas
      );
    } finally {
      proxy.dispose();
    }
  });

  it('projects snapshot events into rewire deltas', () => {
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

    const proxy = new TabChangeProxyService();

    try {
      const event = proxy.createSnapshotEvent();

      expect(event.source).toBe('snapshot');
      expect(event.created).toHaveLength(1);
      expect(event.beforeSnapshot.tabs.size).toBe(0);
      expect(event.bucketId).toBe(event.resolvedBucketDelta.bucketId);
      expect(event.tabRewireDeltas).toHaveLength(1);
      expect(event.tabRewireDeltas[0].kind).toBe('create');
      expect(event.tabRewireDeltas[0].stateTransfer.disposition).toBe('fresh');
      expect(event.resolvedBucketDelta.source).toBe('snapshot');
      expect(event.resolvedBucketDelta.tabRewireDeltas).toEqual(
        event.tabRewireDeltas
      );
    } finally {
      proxy.dispose();
    }
  });

  it('does not re-emit unchanged snapshot baselines', () => {
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

    const proxy = new TabChangeProxyService();

    try {
      const firstEvent = proxy.createSnapshotEvent();
      const secondEvent = proxy.createSnapshotEvent();

      expect(firstEvent.tabRewireDeltas).toHaveLength(1);
      expect(secondEvent.created).toHaveLength(0);
      expect(secondEvent.closed).toHaveLength(0);
      expect(secondEvent.updated).toHaveLength(0);
      expect(secondEvent.tabRewireDeltas).toHaveLength(0);
      expect(secondEvent.beforeSnapshot.tabs.size).toBe(1);
    } finally {
      proxy.dispose();
    }
  });

  it('carries snapshot patches only on exact continuity', () => {
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

    const proxy = new TabChangeProxyService();

    try {
      proxy.createSnapshotEvent();

      const updatedTab = createVSCodeTab({
        filePath: '/workspace/a.ts',
        isActive: false,
        isDirty: true
      });
      const updatedGroup = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [updatedTab],
        isActive: true,
        activeTab: updatedTab
      });
      setWindowTabGroups([updatedGroup]);

      fireTabEvent({ changed: [updatedTab] });

      const event = proxy.createSnapshotEvent();

      expect(event.created).toHaveLength(0);
      expect(event.closed).toHaveLength(0);
      expect(event.updated).toHaveLength(1);
      expect(event.tabRewireDeltas).toHaveLength(1);
      expect(event.tabRewireDeltas[0].kind).toBe('patch');
      expect(event.tabRewireDeltas[0].stateTransfer.disposition).toBe('carry');
    } finally {
      proxy.dispose();
    }
  });

  it('does not emit empty resolved events', () => {
    const proxy = new TabChangeProxyService();
    const events: ResolvedTabChangeEvent[] = [];
    proxy.onDidChangeTabs((e) => events.push(e));

    try {
      // Fire a no-op tab event (no actual state change)
      fireTabEvent({});

      vi.advanceTimersByTime(BUFFER_DELAY);

      expect(events).toHaveLength(0);
    } finally {
      proxy.dispose();
    }
  });

  it('batches multiple rapid events into a single emission', () => {
    const proxy = new TabChangeProxyService();
    const events: ResolvedTabChangeEvent[] = [];
    proxy.onDidChangeTabs((e) => events.push(e));

    try {
      const tab1 = createVSCodeTab({
        filePath: '/workspace/a.ts',
        isActive: true
      });
      const group1 = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tab1],
        isActive: true,
        activeTab: tab1
      });
      setWindowTabGroups([group1]);
      fireTabEvent({ opened: [tab1] });

      // Add a second tab shortly after
      vi.advanceTimersByTime(BUFFER_DELAY / 2);
      const tab2 = createVSCodeTab({ filePath: '/workspace/b.ts' });
      const group2 = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tab1, tab2],
        isActive: true,
        activeTab: tab1
      });
      setWindowTabGroups([group2]);
      fireTabEvent({ opened: [tab2] });

      vi.advanceTimersByTime(BUFFER_DELAY);

      // Should have a single batched emission
      expect(events).toHaveLength(1);
    } finally {
      proxy.dispose();
    }
  });

  it('suppresses events during mute and resumes after unmute', () => {
    const proxy = new TabChangeProxyService();
    const events: ResolvedTabChangeEvent[] = [];
    proxy.onDidChangeTabs((e) => events.push(e));

    try {
      proxy.mute();

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
      fireTabEvent({ opened: [tab] });

      vi.advanceTimersByTime(BUFFER_DELAY * 2);
      expect(events).toHaveLength(0);

      proxy.unmute();

      // New events after unmute should be processed
      const tab2 = createVSCodeTab({
        filePath: '/workspace/b.ts',
        isActive: true
      });
      const group2 = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tab, tab2],
        isActive: true,
        activeTab: tab2
      });
      setWindowTabGroups([group2]);
      fireTabEvent({ opened: [tab2] });

      vi.advanceTimersByTime(BUFFER_DELAY);
      expect(events).toHaveLength(1);
    } finally {
      proxy.dispose();
    }
  });

  it('detects tab activation change when tabs already exist', () => {
    // Simulate: extension activates with existing tabs, then user switches active tab
    const tab1 = createVSCodeTab({
      filePath: '/workspace/a.ts',
      isActive: true
    });
    const tab2 = createVSCodeTab({
      filePath: '/workspace/b.ts',
      isActive: false
    });
    const group = createVSCodeTabGroup({
      viewColumn: 1,
      tabs: [tab1, tab2],
      isActive: true,
      activeTab: tab1
    });
    setWindowTabGroups([group]);

    const proxy = new TabChangeProxyService();
    const events: ResolvedTabChangeEvent[] = [];
    proxy.onDidChangeTabs((e) => events.push(e));

    try {
      // User clicks tab2 → VS Code creates new Tab objects with updated isActive
      const tab1Updated = createVSCodeTab({
        filePath: '/workspace/a.ts',
        isActive: false
      });
      const tab2Updated = createVSCodeTab({
        filePath: '/workspace/b.ts',
        isActive: true
      });
      const groupUpdated = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tab1Updated, tab2Updated],
        isActive: true,
        activeTab: tab2Updated
      });
      setWindowTabGroups([groupUpdated]);

      fireTabEvent({ changed: [tab1Updated, tab2Updated] });
      vi.advanceTimersByTime(BUFFER_DELAY);

      expect(events).toHaveLength(1);
      const resolved = events[0];
      // Should detect changes (created + closed + moved + updated > 0)
      const totalChanges =
        resolved.created.length +
        resolved.closed.length +
        resolved.moved.length +
        resolved.updated.length;
      expect(totalChanges).toBeGreaterThan(0);
    } finally {
      proxy.dispose();
    }
  });

  it('detects new tab in existing group', () => {
    // Start with one tab, then open a second
    const tab1 = createVSCodeTab({
      filePath: '/workspace/a.ts',
      isActive: true
    });
    const group = createVSCodeTabGroup({
      viewColumn: 1,
      tabs: [tab1],
      isActive: true,
      activeTab: tab1
    });
    setWindowTabGroups([group]);

    const proxy = new TabChangeProxyService();
    const events: ResolvedTabChangeEvent[] = [];
    proxy.onDidChangeTabs((e) => events.push(e));

    try {
      const tab2 = createVSCodeTab({
        filePath: '/workspace/c.ts',
        isActive: true
      });
      const tab1Deactivated = createVSCodeTab({
        filePath: '/workspace/a.ts',
        isActive: false
      });
      const groupUpdated = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tab1Deactivated, tab2],
        isActive: true,
        activeTab: tab2
      });
      setWindowTabGroups([groupUpdated]);

      fireTabEvent({ opened: [tab2], changed: [tab1Deactivated] });
      vi.advanceTimersByTime(BUFFER_DELAY);

      expect(events).toHaveLength(1);
      expect(events[0].created.length).toBeGreaterThanOrEqual(1);
    } finally {
      proxy.dispose();
    }
  });

  it('detects tab close in existing group', () => {
    const tab1 = createVSCodeTab({
      filePath: '/workspace/a.ts',
      isActive: true
    });
    const tab2 = createVSCodeTab({
      filePath: '/workspace/b.ts',
      isActive: false
    });
    const group = createVSCodeTabGroup({
      viewColumn: 1,
      tabs: [tab1, tab2],
      isActive: true,
      activeTab: tab1
    });
    setWindowTabGroups([group]);

    const proxy = new TabChangeProxyService();
    const events: ResolvedTabChangeEvent[] = [];
    proxy.onDidChangeTabs((e) => events.push(e));

    try {
      // Close tab2
      const groupUpdated = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tab1],
        isActive: true,
        activeTab: tab1
      });
      setWindowTabGroups([groupUpdated]);

      fireTabEvent({ closed: [tab2] });
      vi.advanceTimersByTime(BUFFER_DELAY);

      expect(events).toHaveLength(1);
      expect(events[0].closed.length).toBeGreaterThanOrEqual(1);
      expect(
        events[0].closedEntries.get(events[0].closed[0])?.exactKeyClue
      ).toBeDefined();
    } finally {
      proxy.dispose();
    }
  });

  it('creates snapshot events from the current observer state', () => {
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

    const proxy = new TabChangeProxyService();

    try {
      const event = proxy.createSnapshotEvent();

      expect(event.source).toBe('snapshot');
      expect(event.created).toEqual([tab]);
      expect(event.createdEntries.get(tab)?.exactKeyClue).toBeDefined();
      expect(event.closed).toEqual([]);
    } finally {
      proxy.dispose();
    }
  });

  it('disposes cleanly', () => {
    const proxy = new TabChangeProxyService();
    const events: ResolvedTabChangeEvent[] = [];
    proxy.onDidChangeTabs((e) => events.push(e));

    // Should not throw
    proxy.dispose();

    // Events after dispose should not propagate
    const tab = createVSCodeTab({ filePath: '/workspace/a.ts' });
    const group = createVSCodeTabGroup({ viewColumn: 1, tabs: [tab] });
    setWindowTabGroups([group]);

    // The callbacks may still exist, but the proxy is disposed
    // This tests that disposal doesn't leave broken state
    expect(() => {
      fireTabEvent({ opened: [tab] });
      vi.advanceTimersByTime(BUFFER_DELAY);
    }).not.toThrow();

    expect(events).toHaveLength(0);
  });
});
