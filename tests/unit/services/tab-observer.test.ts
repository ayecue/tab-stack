import { beforeEach, describe, expect, it, vi } from 'vitest';
import { window } from 'vscode';

import { TabObserverService } from '../../../src/services/tab-observer';
import {
  createVSCodeTab,
  createVSCodeTabGroup,
  setWindowTabGroups
} from '../../factories';

describe('TabObserverService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setWindowTabGroups([]);
  });

  // ── Static snapshot utilities ──────────────────────────────────────

  describe('capture()', () => {
    it('returns empty maps for empty workspace', () => {
      const snapshot = TabObserverService.capture();
      expect(snapshot.tabs.size).toBe(0);
      expect(snapshot.groups.size).toBe(0);
    });

    it('captures all tabs and groups from window state', () => {
      const tab1 = createVSCodeTab({ filePath: '/workspace/a.ts' });
      const tab2 = createVSCodeTab({ filePath: '/workspace/b.ts' });
      const group1 = createVSCodeTabGroup({ viewColumn: 1, tabs: [tab1] });
      const group2 = createVSCodeTabGroup({ viewColumn: 2, tabs: [tab2] });
      setWindowTabGroups([group1, group2]);

      const snapshot = TabObserverService.capture();
      expect(snapshot.tabs.size).toBe(2);
      expect(snapshot.groups.size).toBe(2);
      expect(snapshot.groups.has(1)).toBe(true);
      expect(snapshot.groups.has(2)).toBe(true);
    });

    it('produces tab entries with correct properties', () => {
      const tab = createVSCodeTab({
        filePath: '/workspace/a.ts',
        isActive: true,
        isDirty: true
      });
      const group = createVSCodeTabGroup({ viewColumn: 1, tabs: [tab] });
      setWindowTabGroups([group]);

      const snapshot = TabObserverService.capture();
      const entries = [...snapshot.tabs.values()];
      expect(entries).toHaveLength(1);
      expect(entries[0].isActive).toBe(true);
      expect(entries[0].isDirty).toBe(true);
      expect(entries[0].viewColumn).toBe(1);
      expect(entries[0].index).toBe(0);
      expect(entries[0].tab).toBe(tab);
      expect(entries[0].localRefClue).toBeDefined();
      expect(entries[0].globalRefClue).toBeDefined();
      expect(entries[0].groupFingerprintClue).toBe(
        snapshot.groups.get(1)?.fingerprintClue
      );
      expect(snapshot.groups.get(1)?.fingerprintClue).toBe(
        snapshot.groups.get(1)?.fingerprint
      );
    });
  });

  describe('clone()', () => {
    it('deep-clones tab and group maps', () => {
      const tab = createVSCodeTab({ filePath: '/workspace/a.ts' });
      const group = createVSCodeTabGroup({ viewColumn: 1, tabs: [tab] });
      setWindowTabGroups([group]);

      const original = TabObserverService.capture();
      const cloned = TabObserverService.clone(original);

      expect(cloned.tabs.size).toBe(original.tabs.size);
      expect(cloned.groups.size).toBe(original.groups.size);
      // Maps are distinct references
      expect(cloned.tabs).not.toBe(original.tabs);
      expect(cloned.groups).not.toBe(original.groups);
      // Entry objects are distinct
      const [origEntry] = original.tabs.values();
      const [clonedEntry] = cloned.tabs.values();
      expect(clonedEntry).not.toBe(origEntry);
      expect(clonedEntry).toEqual(origEntry);
    });
  });

  describe('withVersion()', () => {
    it('stamps a version onto a snapshot clone', () => {
      const tab = createVSCodeTab({ filePath: '/workspace/a.ts' });
      const group = createVSCodeTabGroup({ viewColumn: 1, tabs: [tab] });
      setWindowTabGroups([group]);

      const snapshot = TabObserverService.capture();
      const versioned = TabObserverService.withVersion(snapshot, 42);

      expect(versioned.version).toBe(42);
      expect(versioned.tabs.size).toBe(snapshot.tabs.size);
      // Original not mutated
      expect((snapshot as any).version).toBeUndefined();
    });
  });

  describe('snapshotEquals()', () => {
    it('treats two empty snapshots as equal', () => {
      const a = TabObserverService.withVersion(TabObserverService.capture(), 0);
      const b = TabObserverService.withVersion(TabObserverService.capture(), 0);
      expect(TabObserverService.snapshotEquals(a, b)).toBe(true);
    });

    it('detects tab count difference', () => {
      const a = TabObserverService.withVersion(TabObserverService.capture(), 0);

      const tab = createVSCodeTab({ filePath: '/workspace/a.ts' });
      const group = createVSCodeTabGroup({ viewColumn: 1, tabs: [tab] });
      setWindowTabGroups([group]);
      const b = TabObserverService.withVersion(TabObserverService.capture(), 1);

      expect(TabObserverService.snapshotEquals(a, b)).toBe(false);
    });

    it('detects group count difference', () => {
      const tab = createVSCodeTab({ filePath: '/workspace/a.ts' });
      const group1 = createVSCodeTabGroup({ viewColumn: 1, tabs: [tab] });
      setWindowTabGroups([group1]);
      const a = TabObserverService.withVersion(TabObserverService.capture(), 0);

      const tab2 = createVSCodeTab({ filePath: '/workspace/b.ts' });
      const group2 = createVSCodeTabGroup({ viewColumn: 2, tabs: [tab2] });
      setWindowTabGroups([group1, group2]);
      const b = TabObserverService.withVersion(TabObserverService.capture(), 1);

      expect(TabObserverService.snapshotEquals(a, b)).toBe(false);
    });

    it('detects tab property changes (isActive)', () => {
      const tab = createVSCodeTab({
        filePath: '/workspace/a.ts',
        isActive: false
      });
      const group = createVSCodeTabGroup({ viewColumn: 1, tabs: [tab] });
      setWindowTabGroups([group]);
      const a = TabObserverService.withVersion(TabObserverService.capture(), 0);

      const tab2 = createVSCodeTab({
        filePath: '/workspace/a.ts',
        isActive: true
      });
      const group2 = createVSCodeTabGroup({ viewColumn: 1, tabs: [tab2] });
      setWindowTabGroups([group2]);
      const b = TabObserverService.withVersion(TabObserverService.capture(), 1);

      expect(TabObserverService.snapshotEquals(a, b)).toBe(false);
    });

    it('considers equal snapshots equal regardless of version', () => {
      const tab = createVSCodeTab({ filePath: '/workspace/a.ts' });
      const group = createVSCodeTabGroup({ viewColumn: 1, tabs: [tab] });
      setWindowTabGroups([group]);
      const a = TabObserverService.withVersion(TabObserverService.capture(), 0);
      const b = TabObserverService.withVersion(TabObserverService.capture(), 5);
      expect(TabObserverService.snapshotEquals(a, b)).toBe(true);
    });

    it('detects group fingerprint change', () => {
      const tabA = createVSCodeTab({ filePath: '/workspace/a.ts' });
      const tabB = createVSCodeTab({ filePath: '/workspace/b.ts' });
      const group1 = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tabA, tabB]
      });
      setWindowTabGroups([group1]);
      const a = TabObserverService.withVersion(TabObserverService.capture(), 0);

      // Reverse tab order → fingerprint changes
      const group2 = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tabB, tabA]
      });
      setWindowTabGroups([group2]);
      const b = TabObserverService.withVersion(TabObserverService.capture(), 1);

      expect(TabObserverService.snapshotEquals(a, b)).toBe(false);
    });
  });

  describe('computeFingerprint()', () => {
    it('produces deterministic fingerprint based on tab order', () => {
      const tabA = createVSCodeTab({ filePath: '/workspace/a.ts' });
      const tabB = createVSCodeTab({ filePath: '/workspace/b.ts' });
      const group = createVSCodeTabGroup({ viewColumn: 1, tabs: [tabA, tabB] });

      const fp1 = TabObserverService.computeFingerprint(group);
      const fp2 = TabObserverService.computeFingerprint(group);
      expect(fp1).toBe(fp2);
    });

    it('changes when tab order changes', () => {
      const tabA = createVSCodeTab({ filePath: '/workspace/a.ts' });
      const tabB = createVSCodeTab({ filePath: '/workspace/b.ts' });
      const groupAB = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tabA, tabB]
      });
      const groupBA = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tabB, tabA]
      });

      expect(TabObserverService.computeFingerprint(groupAB)).not.toBe(
        TabObserverService.computeFingerprint(groupBA)
      );
    });
  });

  // ── Instance behavior ──────────────────────────────────────────────

  describe('constructor', () => {
    it('captures initial snapshot and subscribes to window events', () => {
      const onDidChangeTabs = vi.fn(() => ({ dispose: vi.fn() }));
      const onDidChangeTabGroups = vi.fn(() => ({ dispose: vi.fn() }));
      (window.tabGroups as any).onDidChangeTabs = onDidChangeTabs;
      (window.tabGroups as any).onDidChangeTabGroups = onDidChangeTabGroups;

      const service = new TabObserverService();
      try {
        expect(onDidChangeTabs).toHaveBeenCalledOnce();
        expect(onDidChangeTabGroups).toHaveBeenCalledOnce();
        expect(service.currentSnapshot.version).toBe(0);
      } finally {
        service.dispose();
      }
    });
  });

  describe('currentSnapshot', () => {
    it('returns the same reference (structural sharing, no defensive clone)', () => {
      const service = new TabObserverService();
      try {
        const s1 = service.currentSnapshot;
        const s2 = service.currentSnapshot;
        expect(s1).toBe(s2);
        expect(s1.tabs).toBe(s2.tabs);
        expect(s1.version).toBe(s2.version);
      } finally {
        service.dispose();
      }
    });
  });

  describe('mute / unmute', () => {
    it('suppresses events while muted', () => {
      const tabChangeCbs: Array<(e: any) => void> = [];
      (window.tabGroups as any).onDidChangeTabs = vi.fn((cb: any) => {
        tabChangeCbs.push(cb);
        return { dispose: vi.fn() };
      });
      (window.tabGroups as any).onDidChangeTabGroups = vi.fn(() => ({
        dispose: vi.fn()
      }));

      const service = new TabObserverService();
      const events: unknown[] = [];
      service.onDidObserveTabEvent((e) => events.push(e));

      try {
        service.mute();

        // Simulate VS Code firing a tab event while muted
        for (const cb of tabChangeCbs) {
          cb({ opened: [], closed: [], changed: [] });
        }

        expect(events).toHaveLength(0);
      } finally {
        service.dispose();
      }
    });

    it('resumes events after unmute and refreshes snapshot', () => {
      const tabChangeCbs: Array<(e: any) => void> = [];
      (window.tabGroups as any).onDidChangeTabs = vi.fn((cb: any) => {
        tabChangeCbs.push(cb);
        return { dispose: vi.fn() };
      });
      (window.tabGroups as any).onDidChangeTabGroups = vi.fn(() => ({
        dispose: vi.fn()
      }));

      const service = new TabObserverService();
      const events: unknown[] = [];
      service.onDidObserveTabEvent((e) => events.push(e));

      try {
        service.mute();
        service.unmute();

        // Fire a tab event after unmute
        for (const cb of tabChangeCbs) {
          cb({ opened: [], closed: [], changed: [] });
        }

        expect(events).toHaveLength(1);
      } finally {
        service.dispose();
      }
    });
  });

  describe('version semantics', () => {
    it('increments version when window state changes', () => {
      const tabChangeCbs: Array<(e: any) => void> = [];
      (window.tabGroups as any).onDidChangeTabs = vi.fn((cb: any) => {
        tabChangeCbs.push(cb);
        return { dispose: vi.fn() };
      });
      (window.tabGroups as any).onDidChangeTabGroups = vi.fn(() => ({
        dispose: vi.fn()
      }));

      setWindowTabGroups([]);
      const service = new TabObserverService();
      try {
        expect(service.currentSnapshot.version).toBe(0);

        // Change window state then simulate event
        const tab = createVSCodeTab({ filePath: '/workspace/a.ts' });
        const group = createVSCodeTabGroup({ viewColumn: 1, tabs: [tab] });
        setWindowTabGroups([group]);

        for (const cb of tabChangeCbs) {
          cb({ opened: [tab], closed: [], changed: [] });
        }

        expect(service.currentSnapshot.version).toBe(1);
      } finally {
        service.dispose();
      }
    });

    it('does not increment version when state is unchanged', () => {
      const tabChangeCbs: Array<(e: any) => void> = [];
      (window.tabGroups as any).onDidChangeTabs = vi.fn((cb: any) => {
        tabChangeCbs.push(cb);
        return { dispose: vi.fn() };
      });
      (window.tabGroups as any).onDidChangeTabGroups = vi.fn(() => ({
        dispose: vi.fn()
      }));

      setWindowTabGroups([]);
      const service = new TabObserverService();
      try {
        // Fire a no-op event (state stays empty)
        for (const cb of tabChangeCbs) {
          cb({ opened: [], closed: [], changed: [] });
        }

        expect(service.currentSnapshot.version).toBe(0);
      } finally {
        service.dispose();
      }
    });
  });

  describe('event payloads', () => {
    it('emits tab events with before and after snapshots', () => {
      const tabChangeCbs: Array<(e: any) => void> = [];
      (window.tabGroups as any).onDidChangeTabs = vi.fn((cb: any) => {
        tabChangeCbs.push(cb);
        return { dispose: vi.fn() };
      });
      (window.tabGroups as any).onDidChangeTabGroups = vi.fn(() => ({
        dispose: vi.fn()
      }));

      setWindowTabGroups([]);
      const service = new TabObserverService();
      const events: any[] = [];
      service.onDidObserveTabEvent((e) => events.push(e));

      try {
        const tab = createVSCodeTab({ filePath: '/workspace/a.ts' });
        const group = createVSCodeTabGroup({ viewColumn: 1, tabs: [tab] });
        setWindowTabGroups([group]);

        for (const cb of tabChangeCbs) {
          cb({ opened: [tab], closed: [], changed: [] });
        }

        expect(events).toHaveLength(1);
        expect(events[0].type).toBe('tab');
        expect(events[0].beforeSnapshot.tabs.size).toBe(0);
        expect(events[0].afterSnapshot.tabs.size).toBe(1);
        expect(events[0].beforeSnapshot.version).toBe(0);
        expect(events[0].afterSnapshot.version).toBe(1);
      } finally {
        service.dispose();
      }
    });

    it('emits group events with before and after snapshots', () => {
      const groupChangeCbs: Array<(e: any) => void> = [];
      (window.tabGroups as any).onDidChangeTabs = vi.fn(() => ({
        dispose: vi.fn()
      }));
      (window.tabGroups as any).onDidChangeTabGroups = vi.fn((cb: any) => {
        groupChangeCbs.push(cb);
        return { dispose: vi.fn() };
      });

      setWindowTabGroups([]);
      const service = new TabObserverService();
      const events: any[] = [];
      service.onDidObserveGroupEvent((e) => events.push(e));

      try {
        const tab = createVSCodeTab({ filePath: '/workspace/a.ts' });
        const group = createVSCodeTabGroup({ viewColumn: 1, tabs: [tab] });
        setWindowTabGroups([group]);

        for (const cb of groupChangeCbs) {
          cb({ opened: [group], closed: [], changed: [] });
        }

        expect(events).toHaveLength(1);
        expect(events[0].type).toBe('group');
        expect(events[0].beforeSnapshot.groups.size).toBe(0);
        expect(events[0].afterSnapshot.groups.size).toBe(1);
      } finally {
        service.dispose();
      }
    });
  });

  describe('dispose()', () => {
    it('cleans up subscriptions and emitters', () => {
      const tabDispose = vi.fn();
      const groupDispose = vi.fn();
      (window.tabGroups as any).onDidChangeTabs = vi.fn(() => ({
        dispose: tabDispose
      }));
      (window.tabGroups as any).onDidChangeTabGroups = vi.fn(() => ({
        dispose: groupDispose
      }));

      const service = new TabObserverService();
      service.dispose();

      expect(tabDispose).toHaveBeenCalledOnce();
      expect(groupDispose).toHaveBeenCalledOnce();
    });
  });
});
