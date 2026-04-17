import { describe, expect, it } from 'vitest';
import type { Tab as VsCodeTab, TabGroup as VsCodeTabGroup } from 'vscode';

import { TabChangeResolver } from '../../../src/handlers/tab-change';
import { TabObserverService } from '../../../src/services/tab-observer';
import { createStateTransferDecision } from '../../../src/types/tab-change-proxy';
import {
  createVSCodeTab,
  createVSCodeTabGroup,
  setWindowTabGroups
} from '../../factories';
import type { VSCodeTabFactoryOptions } from '../../factories/vscode-tab.factory';

// ---------- Helpers ----------

const createGroup = (
  viewColumn: number,
  tabs: VsCodeTab[] = [],
  overrides: Partial<VsCodeTabGroup> = {}
): VsCodeTabGroup => {
  return createVSCodeTabGroup({ viewColumn, tabs, ...overrides });
};

const createTab = (
  filePath: string,
  overrides: Partial<VSCodeTabFactoryOptions> = {}
): VsCodeTab => createVSCodeTab({ filePath, ...overrides });

const createTracker = () => {
  const tracker = new TabChangeResolver();
  tracker.refreshSnapshots(TabObserverService.capture());
  return tracker;
};

/** Shorthand: process with empty event hints + live snapshot capture. */
const processEvent = (tracker: TabChangeResolver) => {
  tracker.processEvent(
    { opened: [], closed: [], changed: [] },
    TabObserverService.capture()
  );
};

describe('TabChangeResolver', () => {
  describe('created tabs', () => {
    it('detects a newly opened tab', () => {
      setWindowTabGroups([createGroup(1)]);
      const tracker = createTracker();

      // Add a tab
      const tab = createTab('/workspace/a.ts');
      const group = createGroup(1, [tab]);
      setWindowTabGroups([group]);

      processEvent(tracker);
      const result = tracker.resolve();

      expect(result.created).toHaveLength(1);
      expect(result.created[0]).toBe(tab);
      expect(result.closed).toHaveLength(0);
      expect(result.moved).toHaveLength(0);
      expect(result.updated).toHaveLength(0);
    });

    it('attaches bucket metadata and stores an internal resolver trace when resolve options are provided', () => {
      setWindowTabGroups([createGroup(1)]);
      const tracker = createTracker();
      const beforeSnapshot = TabObserverService.capture();

      const tab = createTab('/workspace/a.ts');
      const group = createGroup(1, [tab]);
      setWindowTabGroups([group]);

      const afterSnapshot = TabObserverService.capture();

      tracker.processEvent(
        { opened: [tab], closed: [], changed: [] },
        afterSnapshot
      );

      const result = tracker.resolve({
        source: 'delta',
        bucketId: 7,
        beforeSnapshot,
        afterSnapshot
      });

      expect(result.bucketId).toBe(7);
      expect(result.resolvedBucketDelta.bucketId).toBe(7);
      expect(result.tabRewireDeltas).toHaveLength(1);
      expect(result.tabRewireDeltas[0].kind).toBe('create');
      expect(result.tabRewireDeltas[0].stateTransfer.disposition).toBe('fresh');
      expect(tracker.lastResolverTrace?.bucketId).toBe(7);
      expect(tracker.lastResolverTrace?.tabDeltas).toHaveLength(1);
      expect(
        tracker.lastResolverTrace?.tabDeltas[0].stateTransfer.disposition
      ).toBe('fresh');
    });

    it('treats changed-only tabs with no prior snapshot entry as created', () => {
      setWindowTabGroups([createGroup(1)]);
      const tracker = createTracker();

      const tab = createTab('/workspace/a.ts');
      setWindowTabGroups([createGroup(1, [tab])]);

      tracker.processEvent(
        { opened: [], closed: [], changed: [tab] },
        TabObserverService.capture()
      );
      const result = tracker.resolve();

      expect(result.created).toHaveLength(1);
      expect(result.created[0]).toBe(tab);
      expect(result.closed).toHaveLength(0);
      expect(result.moved).toHaveLength(0);
      expect(result.updated).toHaveLength(0);
    });

    it('detects multiple new tabs', () => {
      setWindowTabGroups([createGroup(1)]);
      const tracker = createTracker();

      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      const group = createGroup(1, [tabA, tabB]);
      setWindowTabGroups([group]);

      processEvent(tracker);
      const result = tracker.resolve();

      expect(result.created).toHaveLength(2);
    });

    it('reports cascading index shifts for tabs to the right when a tab opens', () => {
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      setWindowTabGroups([createGroup(1, [tabA, tabB])]);
      const tracker = createTracker();

      const tabC = createTab('/workspace/c.ts');
      setWindowTabGroups([createGroup(1, [tabC, tabA, tabB])]);

      tracker.processEvent(
        { opened: [tabC], closed: [], changed: [] },
        TabObserverService.capture()
      );
      const result = tracker.resolve();

      expect(result.created).toEqual([tabC]);
      expect(result.closed).toHaveLength(0);
      expect(result.updated).toHaveLength(0);
      expect(result.moved).toHaveLength(2);

      const moveA = result.moved.find((move) => move.tab === tabA);
      const moveB = result.moved.find((move) => move.tab === tabB);

      expect(moveA).toBeDefined();
      expect(moveA!.fromViewColumn).toBe(1);
      expect(moveA!.toViewColumn).toBe(1);
      expect(moveA!.fromIndex).toBe(0);
      expect(moveA!.toIndex).toBe(1);
      expect(moveB).toBeDefined();
      expect(moveB!.fromIndex).toBe(1);
      expect(moveB!.toIndex).toBe(2);
    });
  });

  describe('closed tabs', () => {
    it('detects a closed tab', () => {
      const tab = createTab('/workspace/a.ts');
      const group = createGroup(1, [tab]);
      setWindowTabGroups([group]);
      const tracker = createTracker();

      // Remove the tab
      (group as any).tabs = [];
      setWindowTabGroups([group]);

      processEvent(tracker);
      const result = tracker.resolve();

      expect(result.closed).toHaveLength(1);
      expect(result.closed[0]).toBe(tab);
      expect(result.created).toHaveLength(0);
    });

    it('reports cascading index shifts for tabs to the right when a tab closes', () => {
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      const tabC = createTab('/workspace/c.ts');
      setWindowTabGroups([createGroup(1, [tabA, tabB, tabC])]);
      const tracker = createTracker();

      setWindowTabGroups([createGroup(1, [tabB, tabC])]);

      tracker.processEvent(
        { opened: [], closed: [tabA], changed: [] },
        TabObserverService.capture()
      );
      const result = tracker.resolve();

      expect(result.created).toHaveLength(0);
      expect(result.closed).toEqual([tabA]);
      expect(result.updated).toHaveLength(0);
      expect(result.moved).toHaveLength(2);

      const moveB = result.moved.find((move) => move.tab === tabB);
      const moveC = result.moved.find((move) => move.tab === tabC);

      expect(moveB).toBeDefined();
      expect(moveB!.fromViewColumn).toBe(1);
      expect(moveB!.toViewColumn).toBe(1);
      expect(moveB!.fromIndex).toBe(1);
      expect(moveB!.toIndex).toBe(0);
      expect(moveC).toBeDefined();
      expect(moveC!.fromIndex).toBe(2);
      expect(moveC!.toIndex).toBe(1);
    });
  });

  describe('cross-column moves', () => {
    it('detects tab moved from column 1 to column 2', () => {
      const tab = createTab('/workspace/a.ts', { isActive: true });
      const group1 = createGroup(1, [tab]);
      setWindowTabGroups([group1]);
      const tracker = createTracker();

      // Move tab to column 2
      const tabInCol2 = createTab('/workspace/a.ts', { isActive: true });
      const group1Empty = createGroup(1);
      const group2 = createGroup(2, [tabInCol2]);
      setWindowTabGroups([group1Empty, group2]);

      processEvent(tracker);
      const result = tracker.resolve();

      expect(result.moved).toHaveLength(1);
      expect(result.moved[0].tab).toBe(tabInCol2);
      expect(result.moved[0].fromViewColumn).toBe(1);
      expect(result.moved[0].toViewColumn).toBe(2);
      expect(result.moved[0].fromIndex).toBe(0);
      expect(result.moved[0].toIndex).toBe(0);
      expect(result.created).toHaveLength(0);
      expect(result.closed).toHaveLength(0);
    });

    it('includes property changes on moved tab', () => {
      const tab = createTab('/workspace/a.ts', { isActive: true });
      const group1 = createGroup(1, [tab]);
      setWindowTabGroups([group1]);
      const tracker = createTracker();

      // Move tab to column 2 AND it becomes inactive
      const tabInCol2 = createTab('/workspace/a.ts', { isActive: false });
      const group1Empty = createGroup(1);
      const group2 = createGroup(2, [tabInCol2]);
      setWindowTabGroups([group1Empty, group2]);

      processEvent(tracker);
      const result = tracker.resolve();

      expect(result.moved).toHaveLength(1);
      expect(result.moved[0].changed).toEqual(new Set(['isActive']));
    });

    it('preserves earlier property changes when a tab moves later in the same batch', () => {
      const tab = createTab('/workspace/a.ts', { isDirty: false });
      setWindowTabGroups([createGroup(1, [tab])]);
      const tracker = createTracker();

      (tab as any).isDirty = true;
      setWindowTabGroups([createGroup(1, [tab])]);
      processEvent(tracker);

      const movedTab = createTab('/workspace/a.ts', { isDirty: true });
      setWindowTabGroups([createGroup(1), createGroup(2, [movedTab])]);
      processEvent(tracker);

      const result = tracker.resolve();

      expect(result.moved).toHaveLength(1);
      expect(result.moved[0].fromViewColumn).toBe(1);
      expect(result.moved[0].toViewColumn).toBe(2);
      expect(result.moved[0].changed).toEqual(new Set(['isDirty']));
      expect(result.updated).toHaveLength(0);
    });

    it('does not infer a move when multiple tabs share the same movable identity', () => {
      const initialGroup = createGroup(1, [
        createVSCodeTab({ kind: 'terminal', label: 'Terminal 1' }),
        createVSCodeTab({ kind: 'terminal', label: 'Terminal 1' })
      ]);
      setWindowTabGroups([initialGroup]);
      const tracker = createTracker();

      const movedGroup = createGroup(2, [
        createVSCodeTab({ kind: 'terminal', label: 'Terminal 1' }),
        createVSCodeTab({ kind: 'terminal', label: 'Terminal 1' })
      ]);
      setWindowTabGroups([createGroup(1), movedGroup]);

      processEvent(tracker);
      const result = tracker.resolve();

      expect(result.moved).toHaveLength(0);
      expect(result.created).toHaveLength(2);
      expect(result.closed).toHaveLength(2);
      expect(result.tabRewireDeltas).toHaveLength(2);
      expect(
        result.tabRewireDeltas.every((delta) => delta.kind === 'ambiguous')
      ).toBe(true);
      expect(
        result.tabRewireDeltas.every(
          (delta) => delta.stateTransfer.disposition === 'blocked'
        )
      ).toBe(true);
      expect(
        tracker.lastResolverTrace?.tabDeltas.every(
          (delta) => delta.kind === 'ambiguous'
        )
      ).toBe(true);
    });

    it('keeps duplicate same-file cross-group churn explicit in rewiring deltas', () => {
      const initialTabA = createTab('/workspace/a.ts');
      const initialTabB = createTab('/workspace/a.ts');
      setWindowTabGroups([
        createGroup(1, [initialTabA]),
        createGroup(2, [initialTabB])
      ]);
      const tracker = createTracker();

      const movedTabA = createTab('/workspace/a.ts');
      const movedTabB = createTab('/workspace/a.ts');
      setWindowTabGroups([
        createGroup(1),
        createGroup(2),
        createGroup(3, [movedTabA]),
        createGroup(4, [movedTabB])
      ]);

      tracker.processEvent(
        {
          opened: [movedTabA, movedTabB],
          closed: [initialTabA, initialTabB],
          changed: []
        },
        TabObserverService.capture()
      );
      const result = tracker.resolve();

      expect(result.moved).toHaveLength(0);
      expect(result.created).toHaveLength(2);
      expect(result.closed).toHaveLength(2);
      expect(result.tabRewireDeltas).toHaveLength(2);
      expect(
        result.tabRewireDeltas.every((delta) => delta.kind === 'ambiguous')
      ).toBe(true);
      expect(
        result.tabRewireDeltas.every(
          (delta) => delta.stateTransfer.disposition === 'blocked'
        )
      ).toBe(true);
    });

    it('keeps one-sided duplicate terminal churn explicit when only one successor remains', () => {
      const initialTerminalA = createVSCodeTab({
        kind: 'terminal',
        label: 'build-shell'
      });
      const initialTerminalB = createVSCodeTab({
        kind: 'terminal',
        label: 'build-shell'
      });
      setWindowTabGroups([
        createGroup(1, [initialTerminalA]),
        createGroup(2, [initialTerminalB])
      ]);
      const tracker = createTracker();

      const survivingTerminal = createVSCodeTab({
        kind: 'terminal',
        label: 'build-shell'
      });
      setWindowTabGroups([
        createGroup(1),
        createGroup(2),
        createGroup(3, [survivingTerminal])
      ]);

      tracker.processEvent(
        {
          opened: [survivingTerminal],
          closed: [initialTerminalA, initialTerminalB],
          changed: []
        },
        TabObserverService.capture()
      );
      const result = tracker.resolve();

      expect(result.moved).toHaveLength(0);
      expect(result.updated).toHaveLength(0);
      expect(result.created).toEqual([survivingTerminal]);
      expect(result.closed).toHaveLength(2);
      expect(result.tabRewireDeltas).toHaveLength(2);
      expect(
        result.tabRewireDeltas.filter((delta) => delta.kind === 'ambiguous')
      ).toHaveLength(1);
      expect(
        result.tabRewireDeltas.filter((delta) => delta.kind === 'close')
      ).toHaveLength(1);
      expect(
        result.tabRewireDeltas.some(
          (delta) => delta.stateTransfer.disposition === 'blocked'
        )
      ).toBe(true);
      expect(
        result.tabRewireDeltas.some(
          (delta) => delta.stateTransfer.disposition === 'release'
        )
      ).toBe(true);
      expect(
        tracker.lastResolverTrace?.tabDeltas.some(
          (delta) => delta.kind === 'ambiguous'
        )
      ).toBe(true);
    });

    it('downgrades carry continuity when the entry clue was already claimed', () => {
      const tracker = createTracker() as any;
      const beforeTab = createTab('/workspace/a.ts');
      const afterTab = createTab('/workspace/a.ts');
      const beforeEntry = TabObserverService.snapshotTab(beforeTab, 1, 0);
      const afterEntry = TabObserverService.snapshotTab(afterTab, 2, 0);

      tracker._session.claimEntryExactKeyClue(beforeEntry.exactKeyClue);
      tracker._session.claimStateDonor(beforeEntry.exactKeyClue);

      const delta = tracker._createResolvedTabDelta(
        'move',
        beforeEntry,
        afterEntry,
        createStateTransferDecision(
          'carry',
          'Test fixture requests tracked-state continuity.'
        )
      );

      expect(delta.kind).toBe('ambiguous');
      expect(delta.stateTransfer.disposition).toBe('blocked');
      expect(delta.stateTransfer.reason).toContain('already claimed');
      expect(
        tracker.lastResolverTrace?.tabDeltas.some(
          (trackedDelta: { kind: string }) => trackedDelta.kind === 'ambiguous'
        ) ?? false
      ).toBe(false);
      expect(tracker._session.ledger.ambiguities).toHaveLength(1);
      expect(tracker._session.ledger.ambiguities[0].reason).toContain(
        'already claimed'
      );
    });

    it('treats split-editor duplication as a fresh create instead of inferred continuity', () => {
      const tab = createTab('/workspace/a.ts');
      setWindowTabGroups([createGroup(1, [tab])]);
      const tracker = createTracker();

      const splitTab = createTab('/workspace/a.ts');
      const group1 = createGroup(1, [tab]);
      const group2 = createGroup(2, [splitTab]);
      setWindowTabGroups([group1, group2]);

      tracker.processGroupChanges(
        { opened: [group2], closed: [], changed: [] },
        TabObserverService.capture()
      );
      const result = tracker.resolve();

      expect(result.moved).toHaveLength(0);
      expect(result.closed).toHaveLength(0);
      expect(result.created).toEqual([splitTab]);
      expect(result.tabRewireDeltas).toHaveLength(1);
      expect(result.tabRewireDeltas[0].kind).toBe('create');
      expect(result.tabRewireDeltas[0].stateTransfer.disposition).toBe('fresh');
    });

    it('uses Tab object references to avoid false identity matches with duplicate globalRefClues', () => {
      // Col 1: x.ts, Col 2: a.ts (tabA), Col 3: a.ts (tabB)
      const tabX = createTab('/workspace/x.ts');
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/a.ts');
      setWindowTabGroups([
        createGroup(1, [tabX]),
        createGroup(2, [tabA]),
        createGroup(3, [tabB])
      ]);
      const tracker = createTracker();

      // A new group appears at col 1, everything shifts right.
      // VS Code reuses the same Tab references even though viewColumns change.
      setWindowTabGroups([
        createGroup(1, [createTab('/workspace/y.ts')]),
        createGroup(2, [tabX]), // tabX shifted 1→2
        createGroup(3, [tabA]), // tabA shifted 2→3
        createGroup(4, [tabB]) // tabB shifted 3→4
      ]);

      processEvent(tracker);
      const result = tracker.resolve();

      // Without Pass 0 (ref matching), old "3:…:a.ts" would match new "3:…:a.ts"
      // carrying tabB's identity to what is actually tabA. Pass 0 prevents this.
      expect(result.moved).toHaveLength(3);
      const moveX = result.moved.find((m) => m.tab === tabX);
      const moveA = result.moved.find((m) => m.tab === tabA);
      const moveB = result.moved.find((m) => m.tab === tabB);
      expect(moveX).toBeDefined();
      expect(moveX!.fromViewColumn).toBe(1);
      expect(moveX!.toViewColumn).toBe(2);
      expect(moveA).toBeDefined();
      expect(moveA!.fromViewColumn).toBe(2);
      expect(moveA!.toViewColumn).toBe(3);
      expect(moveB).toBeDefined();
      expect(moveB!.fromViewColumn).toBe(3);
      expect(moveB!.toViewColumn).toBe(4);
      expect(result.created).toHaveLength(1); // y.ts is new
      expect(result.closed).toHaveLength(0);
    });
  });

  describe('within-column moves (reorder)', () => {
    it('detects tab reorder within same column', () => {
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      const group = createGroup(1, [tabA, tabB]);
      setWindowTabGroups([group]);
      const tracker = createTracker();

      // Reorder: B moves to index 0, A to index 1
      const tabBReordered = createTab('/workspace/b.ts');
      const tabAReordered = createTab('/workspace/a.ts');
      const groupReordered = createGroup(1, [tabBReordered, tabAReordered]);
      setWindowTabGroups([groupReordered]);

      processEvent(tracker);
      const result = tracker.resolve();

      // Both tabs moved within the column
      expect(result.moved).toHaveLength(2);
      expect(result.updated).toHaveLength(0);
      expect(result.created).toHaveLength(0);
      expect(result.closed).toHaveLength(0);

      const moveA = result.moved.find(
        (m) => m.fromIndex === 0 && m.toIndex === 1
      );
      const moveB = result.moved.find(
        (m) => m.fromIndex === 1 && m.toIndex === 0
      );
      expect(moveA).toBeDefined();
      expect(moveB).toBeDefined();
      expect(moveA!.fromViewColumn).toBe(1);
      expect(moveA!.toViewColumn).toBe(1);
    });

    it('reports cascading index shifts for sibling tabs as moves (real VS Code: only dragged tab in changed)', () => {
      // In real VS Code, a within-group reorder fires changed=[draggedTab]
      // only. Siblings that shift index are NOT in the changed array.
      // The resolver should detect their index shifts via implicit
      // reconciliation and report them as moved (not updated).
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      const tabC = createTab('/workspace/c.ts');
      const group = createGroup(1, [tabA, tabB, tabC]);
      setWindowTabGroups([group]);
      const tracker = createTracker();

      // Move tabC from index 2 to index 0; tabA shifts 0→1, tabB shifts 1→2
      setWindowTabGroups([createGroup(1, [tabC, tabA, tabB])]);

      tracker.processEvent(
        { opened: [], closed: [], changed: [tabC] },
        TabObserverService.capture()
      );
      const result = tracker.resolve();

      expect(result.moved).toHaveLength(3);
      expect(result.updated).toHaveLength(0);

      const moveC = result.moved.find((m) => m.tab === tabC);
      expect(moveC).toBeDefined();
      expect(moveC!.fromIndex).toBe(2);
      expect(moveC!.toIndex).toBe(0);
      expect(moveC!.fromViewColumn).toBe(1);
      expect(moveC!.toViewColumn).toBe(1);

      const moveA = result.moved.find((m) => m.tab === tabA);
      expect(moveA).toBeDefined();
      expect(moveA!.fromIndex).toBe(0);
      expect(moveA!.toIndex).toBe(1);

      const moveB = result.moved.find((m) => m.tab === tabB);
      expect(moveB).toBeDefined();
      expect(moveB!.fromIndex).toBe(1);
      expect(moveB!.toIndex).toBe(2);
    });
  });

  describe('updated tabs (property changes)', () => {
    it('detects isActive change', () => {
      const tab = createTab('/workspace/a.ts', { isActive: false });
      const group = createGroup(1, [tab]);
      setWindowTabGroups([group]);
      const tracker = createTracker();

      // Mutate tab property
      (tab as any).isActive = true;
      setWindowTabGroups([createGroup(1, [tab])]);

      processEvent(tracker);
      const result = tracker.resolve();

      expect(result.updated).toHaveLength(1);
      expect(result.updated[0].tab).toBe(tab);
      expect(result.updated[0].changed).toEqual(new Set(['isActive']));
    });

    it('detects multiple property changes', () => {
      const tab = createTab('/workspace/a.ts', {
        isActive: false,
        isDirty: false
      });
      const group = createGroup(1, [tab]);
      setWindowTabGroups([group]);
      const tracker = createTracker();

      (tab as any).isActive = true;
      (tab as any).isDirty = true;
      setWindowTabGroups([createGroup(1, [tab])]);

      processEvent(tracker);
      const result = tracker.resolve();

      expect(result.updated).toHaveLength(1);
      expect(result.updated[0].changed).toEqual(
        new Set(['isActive', 'isDirty'])
      );
    });

    it('reports nothing when no properties changed', () => {
      const tab = createTab('/workspace/a.ts');
      const group = createGroup(1, [tab]);
      setWindowTabGroups([group]);
      const tracker = createTracker();

      // No change — re-snapshot same state
      setWindowTabGroups([createGroup(1, [tab])]);

      processEvent(tracker);
      const result = tracker.resolve();

      expect(result.updated).toHaveLength(0);
      expect(result.created).toHaveLength(0);
      expect(result.closed).toHaveLength(0);
      expect(result.moved).toHaveLength(0);
    });
  });

  describe('op compression', () => {
    it('add then remove in same batch = noop', () => {
      setWindowTabGroups([createGroup(1)]);
      const tracker = createTracker();

      // Event 1: tab appears
      const tab = createTab('/workspace/a.ts');
      const group = createGroup(1, [tab]);
      setWindowTabGroups([group]);
      processEvent(tracker);

      // Event 2: tab disappears (same batch, before flush)
      setWindowTabGroups([createGroup(1)]);
      processEvent(tracker);

      const result = tracker.resolve();

      expect(result.created).toHaveLength(0);
      expect(result.closed).toHaveLength(0);
      expect(result.moved).toHaveLength(0);
      expect(result.updated).toHaveLength(0);
    });

    it('update then remove = closed only (no updated)', () => {
      const tab = createTab('/workspace/a.ts', { isActive: false });
      const group = createGroup(1, [tab]);
      setWindowTabGroups([group]);
      const tracker = createTracker();

      // Event 1: property change
      (tab as any).isActive = true;
      setWindowTabGroups([createGroup(1, [tab])]);
      processEvent(tracker);

      // Event 2: tab closed
      setWindowTabGroups([createGroup(1)]);
      processEvent(tracker);

      const result = tracker.resolve();

      expect(result.closed).toHaveLength(1);
      expect(result.updated).toHaveLength(0);
    });

    it('add then update = created only (with latest state)', () => {
      setWindowTabGroups([createGroup(1)]);
      const tracker = createTracker();

      // Event 1: tab appears
      const tab = createTab('/workspace/a.ts', { isActive: false });
      const group = createGroup(1, [tab]);
      setWindowTabGroups([group]);
      processEvent(tracker);

      // Event 2: tab property changes
      (tab as any).isActive = true;
      setWindowTabGroups([createGroup(1, [tab])]);
      processEvent(tracker);

      const result = tracker.resolve();

      expect(result.created).toHaveLength(1);
      expect(result.created[0]).toBe(tab);
      expect(result.updated).toHaveLength(0);
    });

    it('remove then add at the same exact address = close plus fresh create', () => {
      const tab = createTab('/workspace/a.ts', { isActive: true });
      const group = createGroup(1, [tab]);
      setWindowTabGroups([group]);
      const tracker = createTracker();

      // Event 1: tab disappears
      setWindowTabGroups([createGroup(1)]);
      processEvent(tracker);

      // Event 2: tab reappears with different state
      const tabBack = createTab('/workspace/a.ts', { isActive: false });
      setWindowTabGroups([createGroup(1, [tabBack])]);
      processEvent(tracker);

      const result = tracker.resolve();

      expect(result.created).toHaveLength(1);
      expect(result.closed).toHaveLength(1);
      expect(result.updated).toHaveLength(0);
      expect(result.moved).toHaveLength(0);
      expect(
        result.tabRewireDeltas
          .map((delta) => delta.stateTransfer.disposition)
          .sort()
      ).toEqual(['fresh', 'release']);
      expect(
        result.tabRewireDeltas.some((delta) => delta.kind === 'create')
      ).toBe(true);
      expect(
        result.tabRewireDeltas.some((delta) => delta.kind === 'close')
      ).toBe(true);
    });

    it('does not carry terminal state across same-slot close and reopen with the same label', () => {
      const terminal = createVSCodeTab({
        kind: 'terminal',
        label: 'build-shell'
      });
      setWindowTabGroups([createGroup(1, [terminal])]);
      const tracker = createTracker();

      setWindowTabGroups([createGroup(1)]);
      processEvent(tracker);

      const reopenedTerminal = createVSCodeTab({
        kind: 'terminal',
        label: 'build-shell'
      });
      setWindowTabGroups([createGroup(1, [reopenedTerminal])]);
      processEvent(tracker);

      const result = tracker.resolve();

      expect(result.moved).toHaveLength(0);
      expect(result.updated).toHaveLength(0);
      expect(result.created).toHaveLength(1);
      expect(result.closed).toHaveLength(1);
      expect(
        result.tabRewireDeltas.every(
          (delta) => delta.stateTransfer.disposition !== 'carry'
        )
      ).toBe(true);
    });

    it('update then update = merged changed set', () => {
      const tab = createTab('/workspace/a.ts', {
        isActive: false,
        isDirty: false
      });
      const group = createGroup(1, [tab]);
      setWindowTabGroups([group]);
      const tracker = createTracker();

      // Event 1: isActive changes
      (tab as any).isActive = true;
      setWindowTabGroups([createGroup(1, [tab])]);
      processEvent(tracker);

      // Event 2: isDirty changes
      (tab as any).isDirty = true;
      setWindowTabGroups([createGroup(1, [tab])]);
      processEvent(tracker);

      const result = tracker.resolve();

      expect(result.updated).toHaveLength(1);
      expect(result.updated[0].changed).toEqual(
        new Set(['isActive', 'isDirty'])
      );
    });
  });

  describe('cross-column move then close (in same batch)', () => {
    it('move + close = only closed from original position', () => {
      const tab = createTab('/workspace/a.ts');
      const group1 = createGroup(1, [tab]);
      setWindowTabGroups([group1]);
      const tracker = createTracker();

      // Event 1: tab moves to column 2
      const tabInCol2 = createTab('/workspace/a.ts');
      const group2 = createGroup(2, [tabInCol2]);
      setWindowTabGroups([createGroup(1), group2]);
      processEvent(tracker);

      // Event 2: tab closed from column 2
      setWindowTabGroups([createGroup(1), createGroup(2)]);
      processEvent(tracker);

      const result = tracker.resolve();

      // Net effect: tab disappeared from col 1, never existed in col 2
      // The add(col2) + remove(col2) cancel out
      // The remove(col1) stays
      expect(result.closed).toHaveLength(1);
      expect(result.moved).toHaveLength(0);
      expect(result.created).toHaveLength(0);
    });
  });

  describe('race condition: active-state change after flush', () => {
    it('detects property changes across batch boundaries', () => {
      const tabA = createTab('/workspace/a.ts', { isActive: true });
      const tabB = createTab('/workspace/b.ts', { isActive: false });
      const group = createGroup(1, [tabA, tabB]);
      setWindowTabGroups([group]);
      const tracker = createTracker();

      // --- Batch 1: some event (e.g. a move in a different group) ---
      processEvent(tracker);
      tracker.resolve();
      tracker.reset();

      // --- Batch 2: active tab changes ---
      (tabA as any).isActive = false;
      (tabB as any).isActive = true;
      setWindowTabGroups([createGroup(1, [tabA, tabB])]);

      processEvent(tracker);
      const result = tracker.resolve();

      expect(result.updated).toHaveLength(2);
      const tabAUpdate = result.updated.find((u) => u.tab === tabA);
      const tabBUpdate = result.updated.find((u) => u.tab === tabB);
      expect(tabAUpdate).toBeDefined();
      expect(tabAUpdate!.changed).toEqual(new Set(['isActive']));
      expect(tabBUpdate).toBeDefined();
      expect(tabBUpdate!.changed).toEqual(new Set(['isActive']));
    });
  });

  describe('no cross-category duplicates', () => {
    it('moved tab does not appear in updated', () => {
      const tab = createTab('/workspace/a.ts', { isActive: true });
      const group1 = createGroup(1, [tab]);
      setWindowTabGroups([group1]);
      const tracker = createTracker();

      // Move to col 2 + property change
      const tabMoved = createTab('/workspace/a.ts', { isActive: false });
      const group2 = createGroup(2, [tabMoved]);
      setWindowTabGroups([createGroup(1), group2]);

      processEvent(tracker);
      const result = tracker.resolve();

      expect(result.moved).toHaveLength(1);
      expect(result.updated).toHaveLength(0);
      expect(result.moved[0].changed).toEqual(new Set(['isActive']));
    });

    it('created tab does not appear in updated', () => {
      setWindowTabGroups([createGroup(1)]);
      const tracker = createTracker();

      const tab = createTab('/workspace/a.ts', { isActive: true });
      setWindowTabGroups([createGroup(1, [tab])]);

      processEvent(tracker);
      const result = tracker.resolve();

      expect(result.created).toHaveLength(1);
      expect(result.updated).toHaveLength(0);
    });
  });

  describe('refreshSnapshots', () => {
    it('resets baseline from current window state', () => {
      const tab = createTab('/workspace/a.ts', { isActive: false });
      const group = createGroup(1, [tab]);
      setWindowTabGroups([group]);
      const tracker = createTracker();

      // Mutate without processEvent (simulates mute period)
      (tab as any).isActive = true;
      setWindowTabGroups([createGroup(1, [tab])]);

      tracker.refreshSnapshots(TabObserverService.capture());

      // Now process — should see no change
      processEvent(tracker);
      const result = tracker.resolve();

      expect(result.updated).toHaveLength(0);
    });
  });

  describe('empty events', () => {
    it('handles empty queue (no events)', () => {
      setWindowTabGroups([createGroup(1)]);
      const tracker = createTracker();

      const result = tracker.resolve();

      expect(result.created).toHaveLength(0);
      expect(result.closed).toHaveLength(0);
      expect(result.moved).toHaveLength(0);
      expect(result.updated).toHaveLength(0);
    });
  });
});
