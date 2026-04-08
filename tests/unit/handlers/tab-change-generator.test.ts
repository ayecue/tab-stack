import { describe, expect, it } from 'vitest';
import type { Tab as VsCodeTab, TabGroup as VsCodeTabGroup } from 'vscode';

import { TabChangeResolver } from '../../../src/handlers/tab-change';
import { TabObserverService } from '../../../src/services/tab-observer';
import {
  createVSCodeTab,
  createVSCodeTabGroup,
  setWindowTabGroups,
} from '../../factories';
import type { VSCodeTabFactoryOptions } from '../../factories/vscode-tab.factory';

// ---------- Helpers ----------

const createGroup = (
  viewColumn: number,
  tabs: VsCodeTab[] = [],
  overrides: Partial<VsCodeTabGroup> = {},
): VsCodeTabGroup => {
  return createVSCodeTabGroup({ viewColumn, tabs, ...overrides });
};

const createTab = (
  filePath: string,
  overrides: Partial<VSCodeTabFactoryOptions> = {},
): VsCodeTab => createVSCodeTab({ filePath, ...overrides });

const createTracker = () => {
  const tracker = new TabChangeResolver();
  tracker.refreshSnapshots(TabObserverService.capture());
  return tracker;
};

describe('TabChangeResolver — processGroupChanges generator pipeline', () => {
  describe('Stage 1: closedGroups', () => {
    it('detects tab closes when a group is destroyed', () => {
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      const group1 = createGroup(1, [tabA]);
      const group2 = createGroup(2, [tabB]);
      setWindowTabGroups([group1, group2]);
      const tracker = createTracker();

      // Group 2 is destroyed — tabB is closed
      setWindowTabGroups([group1]);
      const freshSnapshot = TabObserverService.capture();

      tracker.processGroupChanges(
        { opened: [], closed: [group2], changed: [] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      expect(result.closed).toHaveLength(1);
      expect(result.closed[0]).toBe(tabB);
      expect(result.created).toHaveLength(0);
      expect(result.moved).toHaveLength(0);
    });

    it('does not double-close tabs already removed by prior TAB events', () => {
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      const group1 = createGroup(1, [tabA]);
      const group2 = createGroup(2, [tabB]);
      setWindowTabGroups([group1, group2]);
      const tracker = createTracker();

      // TAB close event fires first for tabB
      setWindowTabGroups([group1]);
      const freshSnapshot = TabObserverService.capture();
      tracker.processEvent(
        { opened: [], closed: [tabB], changed: [] },
        freshSnapshot,
      );

      // Then GROUP closed event fires — tabB is already gone
      tracker.processGroupChanges(
        { opened: [], closed: [group2], changed: [] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      expect(result.closed).toHaveLength(1);
      expect(result.closed[0]).toBe(tabB);
    });
  });

  describe('Stage 2: openedGroups', () => {
    it('detects tab opens when a new group appears', () => {
      const tabA = createTab('/workspace/a.ts');
      const group1 = createGroup(1, [tabA]);
      setWindowTabGroups([group1]);
      const tracker = createTracker();

      // A new group appears with a new tab
      const tabB = createTab('/workspace/b.ts');
      const group2 = createGroup(2, [tabB]);
      setWindowTabGroups([group1, group2]);
      const freshSnapshot = TabObserverService.capture();

      tracker.processGroupChanges(
        { opened: [group2], closed: [], changed: [] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      expect(result.created).toHaveLength(1);
      expect(result.created[0]).toBe(tabB);
      expect(result.closed).toHaveLength(0);
    });
  });

  describe('Stage 3: cascadingVCShifts', () => {
    it('detects VC renumbering when middle group is destroyed (Scenario Q)', () => {
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      const tabC = createTab('/workspace/c.ts');
      const group1 = createGroup(1, [tabA]);
      const group2 = createGroup(2, [tabB]);
      const group3 = createGroup(3, [tabC]);
      setWindowTabGroups([group1, group2, group3]);
      const tracker = createTracker();

      // Simulate: TAB close for group2's tabs already processed
      setWindowTabGroups([group1, createGroup(2, [tabC])]);
      const tabCloseSnapshot = TabObserverService.capture();
      tracker.processEvent(
        { opened: [], closed: [tabB], changed: [] },
        tabCloseSnapshot,
      );

      // GROUP closed(vc2) + changed(vc3→vc2 renumber via tabC)
      // After renumber: tabC moves from vc3 to vc2
      const freshSnapshot = TabObserverService.capture();
      tracker.processGroupChanges(
        {
          opened: [],
          closed: [group2],
          changed: [createGroup(2, [tabC])],
        },
        freshSnapshot,
      );
      const result = tracker.resolve();

      expect(result.closed).toHaveLength(1);
      expect(result.closed[0]).toBe(tabB);
      expect(result.moved).toHaveLength(1);
      expect(result.moved[0].tab).toBe(tabC);
      expect(result.moved[0].fromViewColumn).toBe(3);
      expect(result.moved[0].toViewColumn).toBe(2);
    });
  });

  describe('Stage 4: changedGroups', () => {
    it('detects group swap as moves (Scenario E)', () => {
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      const group1 = createGroup(1, [tabA]);
      const group2 = createGroup(2, [tabB]);
      setWindowTabGroups([group1, group2]);
      const tracker = createTracker();

      // Swap: tabA goes to vc2, tabB goes to vc1
      const newGroup1 = createGroup(1, [tabB]);
      const newGroup2 = createGroup(2, [tabA]);
      setWindowTabGroups([newGroup1, newGroup2]);
      const freshSnapshot = TabObserverService.capture();

      tracker.processGroupChanges(
        { opened: [], closed: [], changed: [newGroup1, newGroup2] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      expect(result.moved).toHaveLength(2);
      const moveA = result.moved.find((m) => m.tab === tabA);
      const moveB = result.moved.find((m) => m.tab === tabB);
      expect(moveA).toBeDefined();
      expect(moveA!.fromViewColumn).toBe(1);
      expect(moveA!.toViewColumn).toBe(2);
      expect(moveB).toBeDefined();
      expect(moveB!.fromViewColumn).toBe(2);
      expect(moveB!.toViewColumn).toBe(1);
      expect(result.created).toHaveLength(0);
      expect(result.closed).toHaveLength(0);
    });

    it('detects property changes in changed groups', () => {
      const tabA = createTab('/workspace/a.ts', { isActive: false });
      const group1 = createGroup(1, [tabA]);
      setWindowTabGroups([group1]);
      const tracker = createTracker();

      // tabA becomes active within same group
      (tabA as any).isActive = true;
      const newGroup1 = createGroup(1, [tabA]);
      setWindowTabGroups([newGroup1]);
      const freshSnapshot = TabObserverService.capture();

      tracker.processGroupChanges(
        { opened: [], closed: [], changed: [newGroup1] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      expect(result.updated).toHaveLength(1);
      expect(result.updated[0].tab).toBe(tabA);
      expect(result.updated[0].changed).toEqual(new Set(['isActive']));
    });

    it('detects new tab in changed group as created', () => {
      const tabA = createTab('/workspace/a.ts');
      const group1 = createGroup(1, [tabA]);
      setWindowTabGroups([group1]);
      const tracker = createTracker();

      // A new tab appears in the existing group
      const tabB = createTab('/workspace/b.ts');
      const newGroup = createGroup(1, [tabA, tabB]);
      setWindowTabGroups([newGroup]);
      const freshSnapshot = TabObserverService.capture();

      tracker.processGroupChanges(
        { opened: [], closed: [], changed: [newGroup] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      expect(result.created).toHaveLength(1);
      expect(result.created[0]).toBe(tabB);
    });
  });

  describe('Stage 5: classifyMoves', () => {
    it('classifies close+open of same Tab ref as move', () => {
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      const group1 = createGroup(1, [tabA]);
      const group2 = createGroup(2, [tabB]);
      setWindowTabGroups([group1, group2]);
      const tracker = createTracker();

      // tabA moves from vc1 to vc2, tabB moves from vc2 to vc1
      const newGroup1 = createGroup(1, [tabB]);
      const newGroup2 = createGroup(2, [tabA]);
      setWindowTabGroups([newGroup1, newGroup2]);
      const freshSnapshot = TabObserverService.capture();

      tracker.processGroupChanges(
        { opened: [], closed: [], changed: [newGroup1, newGroup2] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      // Both should be moves, not creates+closes
      expect(result.moved).toHaveLength(2);
      expect(result.created).toHaveLength(0);
      expect(result.closed).toHaveLength(0);
    });
  });

  describe('duplicate group events', () => {
    it('produces no ops from second identical group event', () => {
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      const group1 = createGroup(1, [tabA]);
      const group2 = createGroup(2, [tabB]);
      setWindowTabGroups([group1, group2]);
      const tracker = createTracker();

      // Swap
      const newGroup1 = createGroup(1, [tabB]);
      const newGroup2 = createGroup(2, [tabA]);
      setWindowTabGroups([newGroup1, newGroup2]);
      const freshSnapshot = TabObserverService.capture();

      // First group event processes the swap
      tracker.processGroupChanges(
        { opened: [], closed: [], changed: [newGroup1, newGroup2] },
        freshSnapshot,
      );

      // Second identical group event (VS Code fires duplicates)
      tracker.processGroupChanges(
        { opened: [], closed: [], changed: [newGroup1, newGroup2] },
        freshSnapshot,
      );

      const result = tracker.resolve();

      // Should still have exactly 2 moves, not 4
      expect(result.moved).toHaveLength(2);
    });
  });

  describe('multi-group scenarios', () => {
    it('handles 3-column group move (Scenario L)', () => {
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      const tabC = createTab('/workspace/c.ts');
      const g1 = createGroup(1, [tabA]);
      const g2 = createGroup(2, [tabB]);
      const g3 = createGroup(3, [tabC]);
      setWindowTabGroups([g1, g2, g3]);
      const tracker = createTracker();

      // Move vc1 to right → vc1 becomes vc3, vc2→vc1, vc3→vc2
      const ng1 = createGroup(1, [tabB]);
      const ng2 = createGroup(2, [tabC]);
      const ng3 = createGroup(3, [tabA]);
      setWindowTabGroups([ng1, ng2, ng3]);
      const freshSnapshot = TabObserverService.capture();

      tracker.processGroupChanges(
        { opened: [], closed: [], changed: [ng1, ng2, ng3] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      expect(result.moved).toHaveLength(3);
      const moveA = result.moved.find((m) => m.tab === tabA);
      const moveB = result.moved.find((m) => m.tab === tabB);
      const moveC = result.moved.find((m) => m.tab === tabC);
      expect(moveA).toBeDefined();
      expect(moveA!.fromViewColumn).toBe(1);
      expect(moveA!.toViewColumn).toBe(3);
      expect(moveB).toBeDefined();
      expect(moveB!.fromViewColumn).toBe(2);
      expect(moveB!.toViewColumn).toBe(1);
      expect(moveC).toBeDefined();
      expect(moveC!.fromViewColumn).toBe(3);
      expect(moveC!.toViewColumn).toBe(2);
      expect(result.created).toHaveLength(0);
      expect(result.closed).toHaveLength(0);
    });

    it('handles group move + close (Scenario O)', () => {
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      const tabC = createTab('/workspace/c.ts');
      const g1 = createGroup(1, [tabA]);
      const g2 = createGroup(2, [tabB]);
      const g3 = createGroup(3, [tabC]);
      setWindowTabGroups([g1, g2, g3]);
      const tracker = createTracker();

      // Swap groups, then close tabC — group events carry the swap,
      // tab event carries the close.
      // After swap: tabB@vc1, tabA@vc2, tabC@vc3
      const sg1 = createGroup(1, [tabB]);
      const sg2 = createGroup(2, [tabA]);
      const sg3 = createGroup(3, [tabC]);
      setWindowTabGroups([sg1, sg2, sg3]);
      const swapSnapshot = TabObserverService.capture();

      tracker.processGroupChanges(
        { opened: [], closed: [], changed: [sg1, sg2, sg3] },
        swapSnapshot,
      );

      // Now close tabC
      setWindowTabGroups([sg1, sg2]);
      const closeSnapshot = TabObserverService.capture();
      tracker.processEvent(
        { opened: [], closed: [tabC], changed: [] },
        closeSnapshot,
      );

      const result = tracker.resolve();

      expect(result.moved).toHaveLength(2);
      expect(result.closed).toHaveLength(1);
      expect(result.closed[0]).toBe(tabC);
    });
  });

  describe('no-op scenarios', () => {
    it('handles empty group event', () => {
      const tabA = createTab('/workspace/a.ts');
      const group = createGroup(1, [tabA]);
      setWindowTabGroups([group]);
      const tracker = createTracker();

      const freshSnapshot = TabObserverService.capture();
      tracker.processGroupChanges(
        { opened: [], closed: [], changed: [] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      expect(result.created).toHaveLength(0);
      expect(result.closed).toHaveLength(0);
      expect(result.moved).toHaveLength(0);
      expect(result.updated).toHaveLength(0);
    });
  });

  describe('event Tab ref mismatch (real VS Code behavior)', () => {
    it('detects group moves when event groups have different Tab refs from snapshot', () => {
      // In real VS Code, onDidChangeTabGroups provides TabGroup objects
      // whose Tab refs are different instances from window.tabGroups.all.
      // The snapshot captures Tab refs from window.tabGroups.all, so
      // _stageChangedGroups must not iterate event group.tabs.

      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      const tabC = createTab('/workspace/c.ts');
      const tabD = createTab('/workspace/d.ts');
      const g1 = createGroup(1, [tabA, tabB]);
      const g2 = createGroup(2, [tabC, tabD]);
      setWindowTabGroups([g1, g2]);
      const tracker = createTracker();

      // Group 2 moves to vc1, group 1 moves to vc2
      const swappedG1 = createGroup(1, [tabC, tabD]);
      const swappedG2 = createGroup(2, [tabA, tabB]);
      setWindowTabGroups([swappedG1, swappedG2]);
      const freshSnapshot = TabObserverService.capture();

      // Create event groups with DIFFERENT Tab refs (clones) — simulates
      // real VS Code behavior where event.changed[].tabs are not the
      // same objects as window.tabGroups.all tabs.
      const eventTabC = createTab('/workspace/c.ts');
      const eventTabD = createTab('/workspace/d.ts');
      const eventTabA = createTab('/workspace/a.ts');
      const eventTabB = createTab('/workspace/b.ts');
      const eventGroup1 = createGroup(1, [eventTabC, eventTabD]);
      const eventGroup2 = createGroup(2, [eventTabA, eventTabB]);

      tracker.processGroupChanges(
        { opened: [], closed: [], changed: [eventGroup1, eventGroup2] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      expect(result.moved).toHaveLength(4);
      expect(result.created).toHaveLength(0);
      expect(result.closed).toHaveLength(0);

      const moveA = result.moved.find((m) => m.tab === tabA);
      const moveB = result.moved.find((m) => m.tab === tabB);
      const moveC = result.moved.find((m) => m.tab === tabC);
      const moveD = result.moved.find((m) => m.tab === tabD);

      expect(moveA).toBeDefined();
      expect(moveA!.fromViewColumn).toBe(1);
      expect(moveA!.toViewColumn).toBe(2);
      expect(moveB).toBeDefined();
      expect(moveB!.fromViewColumn).toBe(1);
      expect(moveB!.toViewColumn).toBe(2);
      expect(moveC).toBeDefined();
      expect(moveC!.fromViewColumn).toBe(2);
      expect(moveC!.toViewColumn).toBe(1);
      expect(moveD).toBeDefined();
      expect(moveD!.fromViewColumn).toBe(2);
      expect(moveD!.toViewColumn).toBe(1);
    });

    it('detects property changes in changed groups with mismatched Tab refs', () => {
      const tabA = createTab('/workspace/a.ts', { isActive: false });
      const group1 = createGroup(1, [tabA]);
      setWindowTabGroups([group1]);
      const tracker = createTracker();

      // tabA becomes active — same vc, same tab ref in snapshot
      (tabA as any).isActive = true;
      const newGroup1 = createGroup(1, [tabA]);
      setWindowTabGroups([newGroup1]);
      const freshSnapshot = TabObserverService.capture();

      // Event group has a DIFFERENT Tab ref
      const eventTab = createTab('/workspace/a.ts', { isActive: true });
      const eventGroup = createGroup(1, [eventTab]);

      tracker.processGroupChanges(
        { opened: [], closed: [], changed: [eventGroup] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      expect(result.updated).toHaveLength(1);
      expect(result.updated[0].tab).toBe(tabA);
      expect(result.updated[0].changed).toEqual(new Set(['isActive']));
    });
  });

  describe('snapshot Tab ref instability (VS Code replaces Tab objects on group move)', () => {
    it('detects moves when ALL Tab refs change between before/after snapshots', () => {
      // Simulate VS Code creating new Tab objects when groups move.
      // The tracker's seedSnapshot has old Tab refs, but the fresh
      // capture in processGroupChanges has entirely new Tab refs for
      // the same tabs.

      const oldTabA = createTab('/workspace/a.ts');
      const oldTabB = createTab('/workspace/b.ts');
      const oldTabC = createTab('/workspace/c.ts');
      const oldTabD = createTab('/workspace/d.ts');
      const g1 = createGroup(1, [oldTabA, oldTabB, oldTabC]);
      const g2 = createGroup(2, [oldTabD]);
      setWindowTabGroups([g1, g2]);

      const tracker = new TabChangeResolver();
      tracker.seedSnapshot(TabObserverService.capture());

      // After group move: vc1 content goes to vc2, vc2 content goes to vc1.
      // VS Code creates entirely NEW Tab objects.
      const newTabA = createTab('/workspace/a.ts');
      const newTabB = createTab('/workspace/b.ts');
      const newTabC = createTab('/workspace/c.ts');
      const newTabD = createTab('/workspace/d.ts');
      const ng1 = createGroup(1, [newTabD]);
      const ng2 = createGroup(2, [newTabA, newTabB, newTabC]);
      setWindowTabGroups([ng1, ng2]);
      const freshSnapshot = TabObserverService.capture();

      // Event groups also have different refs (doesn't matter after reconciliation)
      const evG1 = createGroup(1, [createTab('/workspace/d.ts')]);
      const evG2 = createGroup(2, [createTab('/workspace/a.ts'), createTab('/workspace/b.ts'), createTab('/workspace/c.ts')]);

      tracker.processGroupChanges(
        { opened: [], closed: [], changed: [evG1, evG2] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      expect(result.moved).toHaveLength(4);
      expect(result.created).toHaveLength(0);
      expect(result.closed).toHaveLength(0);

      // Moves should reference the NEW Tab refs (from fresh snapshot)
      const moveA = result.moved.find((m) => m.tab === newTabA);
      const moveB = result.moved.find((m) => m.tab === newTabB);
      const moveC = result.moved.find((m) => m.tab === newTabC);
      const moveD = result.moved.find((m) => m.tab === newTabD);

      expect(moveA).toBeDefined();
      expect(moveA!.fromViewColumn).toBe(1);
      expect(moveA!.toViewColumn).toBe(2);
      expect(moveD).toBeDefined();
      expect(moveD!.fromViewColumn).toBe(2);
      expect(moveD!.toViewColumn).toBe(1);
    });

    it('handles duplicate files across groups with new Tab refs', () => {
      // Same file open in two different groups — globalRefClue is identical.
      // After group move, must correctly match old entries to new entries
      // using group fingerprinting, not just the coarse global clue.

      const oldE1 = createTab('/workspace/shared.ts');
      const oldE2 = createTab('/workspace/shared.ts');
      const oldUniq1 = createTab('/workspace/unique-a.ts');
      const oldUniq2 = createTab('/workspace/unique-b.ts');
      const g1 = createGroup(1, [oldE1, oldUniq1]);
      const g2 = createGroup(2, [oldE2, oldUniq2]);
      setWindowTabGroups([g1, g2]);

      const tracker = new TabChangeResolver();
      tracker.seedSnapshot(TabObserverService.capture());

      // Swap groups: g1→vc2, g2→vc1 — all new Tab refs
      const newE1 = createTab('/workspace/shared.ts');
      const newE2 = createTab('/workspace/shared.ts');
      const newUniq1 = createTab('/workspace/unique-a.ts');
      const newUniq2 = createTab('/workspace/unique-b.ts');
      const ng1 = createGroup(1, [newE2, newUniq2]); // old g2 content
      const ng2 = createGroup(2, [newE1, newUniq1]); // old g1 content
      setWindowTabGroups([ng1, ng2]);
      const freshSnapshot = TabObserverService.capture();

      tracker.processGroupChanges(
        { opened: [], closed: [], changed: [ng1, ng2] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      expect(result.moved).toHaveLength(4);
      expect(result.created).toHaveLength(0);
      expect(result.closed).toHaveLength(0);

      // All moves should be vc1↔vc2 swaps
      for (const m of result.moved) {
        if (m.fromViewColumn === 1) {
          expect(m.toViewColumn).toBe(2);
        } else {
          expect(m.fromViewColumn).toBe(2);
          expect(m.toViewColumn).toBe(1);
        }
      }
    });

    it('handles 4-group rotation with duplicate files and new Tab refs', () => {
      // Reproduces the exact user scenario: 4 groups, some files open
      // in multiple groups, VS Code replaces ALL Tab refs on group move.

      const s1 = createTab('/workspace/smartappliance.src');
      const s2 = createTab('/workspace/smartappliance.src');
      const n1 = createTab('/workspace/notes.src');
      const n2 = createTab('/workspace/notes.src');
      const l1 = createTab('/workspace/libs.src');
      const l2 = createTab('/workspace/libs.src');
      const net = createTab('/workspace/netsession.src');
      const meta = createTab('/workspace/metalib.src');
      const mail = createTab('/workspace/mail.src');
      const traf = createTab('/workspace/trafficnet.src');
      const proc = createTab('/workspace/processes.src');
      const osint = createTab('/workspace/osint.src');
      const welcome = createTab('/workspace/welcome.md');

      const g1 = createGroup(1, [net, meta, mail, traf, s1]);
      const g2 = createGroup(2, [s2, n1]);
      const g3 = createGroup(3, [l1, n2, proc, osint]);
      const g4 = createGroup(4, [l2, welcome]);
      setWindowTabGroups([g1, g2, g3, g4]);

      const tracker = new TabChangeResolver();
      tracker.seedSnapshot(TabObserverService.capture());

      // Rotate: vc4→vc1, vc1→vc2, vc2→vc3, vc3→vc4 — ALL new Tab refs
      const ns1 = createTab('/workspace/smartappliance.src');
      const ns2 = createTab('/workspace/smartappliance.src');
      const nn1 = createTab('/workspace/notes.src');
      const nn2 = createTab('/workspace/notes.src');
      const nl1 = createTab('/workspace/libs.src');
      const nl2 = createTab('/workspace/libs.src');
      const nnet = createTab('/workspace/netsession.src');
      const nmeta = createTab('/workspace/metalib.src');
      const nmail = createTab('/workspace/mail.src');
      const ntraf = createTab('/workspace/trafficnet.src');
      const nproc = createTab('/workspace/processes.src');
      const nosint = createTab('/workspace/osint.src');
      const nwelcome = createTab('/workspace/welcome.md');

      const ng1 = createGroup(1, [nl2, nwelcome]);             // was g4
      const ng2 = createGroup(2, [nnet, nmeta, nmail, ntraf, ns1]); // was g1
      const ng3 = createGroup(3, [ns2, nn1]);                  // was g2
      const ng4 = createGroup(4, [nl1, nn2, nproc, nosint]);   // was g3
      setWindowTabGroups([ng1, ng2, ng3, ng4]);
      const freshSnapshot = TabObserverService.capture();

      tracker.processGroupChanges(
        { opened: [], closed: [], changed: [ng1, ng2, ng3, ng4] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      expect(result.moved).toHaveLength(13);
      expect(result.created).toHaveLength(0);
      expect(result.closed).toHaveLength(0);
    });
  });

  describe('processEvent Stage 2: index-shift derivation', () => {
    it('derives neighbor index shifts when a tab is closed', () => {
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      const tabC = createTab('/workspace/c.ts');
      const group = createGroup(1, [tabA, tabB, tabC]);
      setWindowTabGroups([group]);
      const tracker = createTracker();

      // Close tabA (index 0) — tabB shifts 1→0, tabC shifts 2→1
      setWindowTabGroups([createGroup(1, [tabB, tabC])]);
      const freshSnapshot = TabObserverService.capture();

      tracker.processEvent(
        { opened: [], closed: [tabA], changed: [] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      expect(result.closed).toHaveLength(1);
      expect(result.closed[0]).toBe(tabA);
      expect(result.updated).toHaveLength(0);
      expect(result.moved).toHaveLength(2);

      const moveB = result.moved.find((move) => move.tab === tabB);
      const moveC = result.moved.find((move) => move.tab === tabC);

      expect(moveB).toBeDefined();
      expect(moveB!.fromIndex).toBe(1);
      expect(moveB!.toIndex).toBe(0);
      expect(moveC).toBeDefined();
      expect(moveC!.fromIndex).toBe(2);
      expect(moveC!.toIndex).toBe(1);
    });

    it('derives neighbor index shifts when a tab is opened', () => {
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      const group = createGroup(1, [tabA, tabB]);
      setWindowTabGroups([group]);
      const tracker = createTracker();

      // Insert tabC at index 0 — tabA shifts 0→1, tabB shifts 1→2
      const tabC = createTab('/workspace/c.ts');
      setWindowTabGroups([createGroup(1, [tabC, tabA, tabB])]);
      const freshSnapshot = TabObserverService.capture();

      tracker.processEvent(
        { opened: [tabC], closed: [], changed: [] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      expect(result.created).toHaveLength(1);
      expect(result.created[0]).toBe(tabC);
      expect(result.updated).toHaveLength(0);
      expect(result.moved).toHaveLength(2);

      const moveA = result.moved.find((move) => move.tab === tabA);
      const moveB = result.moved.find((move) => move.tab === tabB);

      expect(moveA).toBeDefined();
      expect(moveA!.fromIndex).toBe(0);
      expect(moveA!.toIndex).toBe(1);
      expect(moveB).toBeDefined();
      expect(moveB!.fromIndex).toBe(1);
      expect(moveB!.toIndex).toBe(2);
    });

    it('derives index shifts for cross-group move source group', () => {
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      const tabC = createTab('/workspace/c.ts');
      const g1 = createGroup(1, [tabA, tabB, tabC]);
      setWindowTabGroups([g1]);
      const tracker = createTracker();

      // tabA moves out of vc1 — tabB shifts 1→0, tabC shifts 2→1
      const movedA = createTab('/workspace/a.ts');
      setWindowTabGroups([
        createGroup(1, [tabB, tabC]),
        createGroup(2, [movedA]),
      ]);
      const freshSnapshot = TabObserverService.capture();

      tracker.processEvent(
        { opened: [movedA], closed: [tabA], changed: [] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      expect(result.moved).toHaveLength(3);

      const moveA = result.moved.find((move) => move.tab === movedA);
      const moveB = result.moved.find((move) => move.tab === tabB);
      const moveC = result.moved.find((move) => move.tab === tabC);

      expect(moveA).toBeDefined();
      expect(moveA!.fromViewColumn).toBe(1);
      expect(moveA!.toViewColumn).toBe(2);
      expect(moveB).toBeDefined();
      expect(moveB!.fromIndex).toBe(1);
      expect(moveB!.toIndex).toBe(0);
      expect(moveC).toBeDefined();
      expect(moveC!.fromIndex).toBe(2);
      expect(moveC!.toIndex).toBe(1);
    });

    it('does not derive shifts for unaffected groups', () => {
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      const tabC = createTab('/workspace/c.ts');
      const g1 = createGroup(1, [tabA]);
      const g2 = createGroup(2, [tabB, tabC]);
      setWindowTabGroups([g1, g2]);
      const tracker = createTracker();

      // Close tabA from vc1 — vc2 tabs should NOT be affected
      setWindowTabGroups([createGroup(2, [tabB, tabC])]);
      const freshSnapshot = TabObserverService.capture();

      tracker.processEvent(
        { opened: [], closed: [tabA], changed: [] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      expect(result.closed).toHaveLength(1);
      expect(result.closed[0]).toBe(tabA);
      // tabB and tabC in vc2 should not have any ops recorded
      expect(result.moved).toHaveLength(0);
      expect(result.updated).toHaveLength(0);
    });
  });

  describe('diagnostic scenarios', () => {
    it('Scenario M: 4-column complex multi-group shift', () => {
      // 4 groups, 2 tabs each. Move vc1→vc4 (all groups shift).
      const t1a = createTab('/workspace/1a.ts');
      const t1b = createTab('/workspace/1b.ts');
      const t2a = createTab('/workspace/2a.ts');
      const t2b = createTab('/workspace/2b.ts');
      const t3a = createTab('/workspace/3a.ts');
      const t3b = createTab('/workspace/3b.ts');
      const t4a = createTab('/workspace/4a.ts');
      const t4b = createTab('/workspace/4b.ts');
      setWindowTabGroups([
        createGroup(1, [t1a, t1b]),
        createGroup(2, [t2a, t2b]),
        createGroup(3, [t3a, t3b]),
        createGroup(4, [t4a, t4b]),
      ]);
      const tracker = createTracker();

      // vc1→vc4: vc2→vc1, vc3→vc2, vc4→vc3, old-vc1→vc4
      const ng1 = createGroup(1, [t2a, t2b]);
      const ng2 = createGroup(2, [t3a, t3b]);
      const ng3 = createGroup(3, [t4a, t4b]);
      const ng4 = createGroup(4, [t1a, t1b]);
      setWindowTabGroups([ng1, ng2, ng3, ng4]);
      const freshSnapshot = TabObserverService.capture();

      tracker.processGroupChanges(
        { opened: [], closed: [], changed: [ng1, ng2, ng3, ng4] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      // All 8 tabs moved
      expect(result.moved).toHaveLength(8);
      expect(result.created).toHaveLength(0);
      expect(result.closed).toHaveLength(0);

      // Verify representative moves
      const move1a = result.moved.find((m) => m.tab === t1a);
      expect(move1a).toBeDefined();
      expect(move1a!.fromViewColumn).toBe(1);
      expect(move1a!.toViewColumn).toBe(4);

      const move2a = result.moved.find((m) => m.tab === t2a);
      expect(move2a).toBeDefined();
      expect(move2a!.fromViewColumn).toBe(2);
      expect(move2a!.toViewColumn).toBe(1);
    });

    it('Scenario N: multi-hop move vc1→vc2→vc3 collapses to one move', () => {
      // Tab moves from vc1 to vc2 to vc3 within one batch.
      // VS Code fires: open(vc2), close(vc1), open(vc3), close(vc2)
      const tab = createTab('/workspace/a.ts');
      const other = createTab('/workspace/other.ts');
      setWindowTabGroups([
        createGroup(1, [tab]),
        createGroup(2, [other]),
        createGroup(3, []),
      ]);
      const tracker = createTracker();

      // Hop 1: tab moves vc1→vc2
      const tabAtVc2 = createTab('/workspace/a.ts');
      setWindowTabGroups([
        createGroup(1, []),
        createGroup(2, [tabAtVc2, other]),
        createGroup(3, []),
      ]);
      tracker.processEvent(
        { opened: [tabAtVc2], closed: [tab], changed: [] },
        TabObserverService.capture(),
      );

      // Hop 2: tab moves vc2→vc3
      const tabAtVc3 = createTab('/workspace/a.ts');
      setWindowTabGroups([
        createGroup(1, []),
        createGroup(2, [other]),
        createGroup(3, [tabAtVc3]),
      ]);
      tracker.processEvent(
        { opened: [tabAtVc3], closed: [tabAtVc2], changed: [] },
        TabObserverService.capture(),
      );

      const result = tracker.resolve();

      // Should collapse to one net move vc1→vc3
      expect(result.moved).toHaveLength(1);
      expect(result.moved[0].fromViewColumn).toBe(1);
      expect(result.moved[0].toViewColumn).toBe(3);
      expect(result.created).toHaveLength(0);
      expect(result.closed).toHaveLength(0);
    });

    it('Scenario P: group move + within-group reorder compose cleanly', () => {
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      const tabC = createTab('/workspace/c.ts');
      setWindowTabGroups([
        createGroup(1, [tabA, tabB]),
        createGroup(2, [tabC]),
      ]);
      const tracker = createTracker();

      // Group swap: vc1↔vc2
      const sg1 = createGroup(1, [tabC]);
      const sg2 = createGroup(2, [tabA, tabB]);
      setWindowTabGroups([sg1, sg2]);
      tracker.processGroupChanges(
        { opened: [], closed: [], changed: [sg1, sg2] },
        TabObserverService.capture(),
      );

      // Then reorder within vc2: tabB moves to index 0
      (sg2 as any).tabs = [tabB, tabA];
      setWindowTabGroups([sg1, createGroup(2, [tabB, tabA])]);
      tracker.processEvent(
        { opened: [], closed: [], changed: [tabB] },
        TabObserverService.capture(),
      );

      const result = tracker.resolve();

      // tabA, tabB, tabC all moved across groups
      // tabB also reordered within vc2
      expect(result.moved.length).toBeGreaterThanOrEqual(3);
      expect(result.created).toHaveLength(0);
      expect(result.closed).toHaveLength(0);
    });

    it('Scenario R: split editor creates duplicate globalRefClue, NOT a move', () => {
      const tabA = createTab('/workspace/a.ts');
      setWindowTabGroups([createGroup(1, [tabA])]);
      const tracker = createTracker();

      // Split: same file opens in a new group
      const tabASplit = createTab('/workspace/a.ts');
      const g1 = createGroup(1, [tabA]);
      const g2 = createGroup(2, [tabASplit]);
      setWindowTabGroups([g1, g2]);
      const freshSnapshot = TabObserverService.capture();

      tracker.processGroupChanges(
        { opened: [g2], closed: [], changed: [] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      // tabASplit is new — NOT a move from tabA
      expect(result.created).toHaveLength(1);
      expect(result.created[0]).toBe(tabASplit);
      expect(result.moved).toHaveLength(0);
      expect(result.closed).toHaveLength(0);
    });

    it('Scenario S: move sole tab (source group destroys) + VC renumber', () => {
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      const tabC = createTab('/workspace/c.ts');
      setWindowTabGroups([
        createGroup(1, [tabA]),
        createGroup(2, [tabB]),
        createGroup(3, [tabC]),
      ]);
      const tracker = createTracker();

      // Move tabA from vc1 to vc2 (between tabB's group)
      // Source group 1 is destroyed. vc2→vc1, vc3→vc2 renumbering.
      // Event sequence: TAB opened(tabA@vc1), TAB closed(tabA@vc1, old),
      // GROUP closed(old vc1), GROUP changed(renumber)

      // Step 1: TAB open+close for the move
      setWindowTabGroups([
        createGroup(1, [tabA, tabB]),
        createGroup(2, [tabC]),
      ]);
      tracker.processEvent(
        { opened: [tabA], closed: [tabA], changed: [] },
        TabObserverService.capture(),
      );

      const result = tracker.resolve();

      // tabA moved. tabB/tabC may have VC renumber depending on what
      // group events follow. At minimum, tabA should not be both
      // created and closed.
      expect(result.created).toHaveLength(0);
      // tabA bounced (same tab ref, add + remove at same position?
      // Actually, the open is at new vc1/idx0 and the old was at old vc1/idx0
      // The globalRefClue is the same, the position (vc1, idx0) is the same after renumber.
      // So this becomes a bounced tab via Phase 1b.
    });
  });

  describe('chain-collapse with group events', () => {
    it('group-moved tab then closed → single close from original', () => {
      const tabA = createTab('/workspace/a.ts');
      const tabB = createTab('/workspace/b.ts');
      setWindowTabGroups([
        createGroup(1, [tabA]),
        createGroup(2, [tabB]),
      ]);
      const tracker = createTracker();

      // Group swap: tabA → vc2, tabB → vc1
      const sg1 = createGroup(1, [tabB]);
      const sg2 = createGroup(2, [tabA]);
      setWindowTabGroups([sg1, sg2]);
      tracker.processGroupChanges(
        { opened: [], closed: [], changed: [sg1, sg2] },
        TabObserverService.capture(),
      );

      // Then close tabA from vc2
      setWindowTabGroups([sg1]);
      tracker.processEvent(
        { opened: [], closed: [tabA], changed: [] },
        TabObserverService.capture(),
      );

      const result = tracker.resolve();

      // Net: tabA closed (from original vc1), tabB moved vc2→vc1
      expect(result.closed).toHaveLength(1);
      expect(result.closed[0]).toBe(tabA);
      expect(result.moved).toHaveLength(1);
      expect(result.moved[0].tab).toBe(tabB);
      expect(result.moved[0].fromViewColumn).toBe(2);
      expect(result.moved[0].toViewColumn).toBe(1);
    });
  });

  describe('ambiguous duplicate-content tabs', () => {
    it('does not infer move when multiple tabs share same globalRefClue', () => {
      // Two terminals with same label in vc1, one terminal in vc2
      const term1 = createVSCodeTab({ kind: 'terminal', label: 'bash' });
      const term2 = createVSCodeTab({ kind: 'terminal', label: 'bash' });
      setWindowTabGroups([
        createGroup(1, [term1, term2]),
        createGroup(2, []),
      ]);
      const tracker = createTracker();

      // Both disappear from vc1, two new ones appear in vc2
      const term3 = createVSCodeTab({ kind: 'terminal', label: 'bash' });
      const term4 = createVSCodeTab({ kind: 'terminal', label: 'bash' });
      setWindowTabGroups([
        createGroup(1, []),
        createGroup(2, [term3, term4]),
      ]);

      tracker.processEvent(
        { opened: [term3, term4], closed: [term1, term2], changed: [] },
        TabObserverService.capture(),
      );
      const result = tracker.resolve();

      // Ambiguous: 2 adds + 2 removes for same globalRefClue → create+close, not move
      expect(result.moved).toHaveLength(0);
      expect(result.created).toHaveLength(2);
      expect(result.closed).toHaveLength(2);
    });
  });

  describe('group active-state changes', () => {
    it('synthesizes isActive update when VC focus shifts with no tab property change', () => {
      // Two groups: vc1 is active, vc2 is not.
      const tabA = createTab('/workspace/a.ts', { isActive: true });
      const tabB = createTab('/workspace/b.ts', { isActive: true });
      const g1 = createGroup(1, [tabA], { isActive: true });
      const g2 = createGroup(2, [tabB], { isActive: false });
      setWindowTabGroups([g1, g2]);
      const tracker = createTracker();

      // User clicks on vc2: group isActive flips, tab properties unchanged
      const ng1 = createGroup(1, [tabA], { isActive: false });
      const ng2 = createGroup(2, [tabB], { isActive: true });
      setWindowTabGroups([ng1, ng2]);
      const freshSnapshot = TabObserverService.capture();

      tracker.processGroupChanges(
        { opened: [], closed: [], changed: [ng1, ng2] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      expect(result.created).toHaveLength(0);
      expect(result.closed).toHaveLength(0);
      expect(result.moved).toHaveLength(0);
      // Both active tabs get a synthetic isActive update
      expect(result.updated).toHaveLength(2);
      const updatedTabs = result.updated.map((u) => u.tab);
      expect(updatedTabs).toContain(tabA);
      expect(updatedTabs).toContain(tabB);
      for (const u of result.updated) {
        expect(u.changed).toEqual(new Set(['isActive']));
      }
    });

    it('does not duplicate update when tab already has events from the pipeline', () => {
      // vc1 active, vc2 not. A tab in vc1 also changes property (isDirty).
      const tabA = createTab('/workspace/a.ts', { isActive: true, isDirty: false });
      const tabB = createTab('/workspace/b.ts', { isActive: true });
      const g1 = createGroup(1, [tabA], { isActive: true });
      const g2 = createGroup(2, [tabB], { isActive: false });
      setWindowTabGroups([g1, g2]);
      const tracker = createTracker();

      // vc1 → inactive, vc2 → active. Also tabA becomes dirty.
      (tabA as any).isDirty = true;
      const ng1 = createGroup(1, [tabA], { isActive: false });
      const ng2 = createGroup(2, [tabB], { isActive: true });
      setWindowTabGroups([ng1, ng2]);
      const freshSnapshot = TabObserverService.capture();

      tracker.processGroupChanges(
        { opened: [], closed: [], changed: [ng1, ng2] },
        freshSnapshot,
      );
      const result = tracker.resolve();

      // tabA has isDirty change from the pipeline + isActive from group active
      // tabB gets only the synthetic isActive
      expect(result.moved).toHaveLength(0);
      expect(result.created).toHaveLength(0);
      expect(result.closed).toHaveLength(0);

      // tabA should appear in updated with isDirty (from pipeline change detection)
      const updateA = result.updated.find((u) => u.tab === tabA);
      expect(updateA).toBeDefined();
      expect(updateA!.changed).toContain('isDirty');

      // tabB should appear with synthetic isActive
      const updateB = result.updated.find((u) => u.tab === tabB);
      expect(updateB).toBeDefined();
      expect(updateB!.changed).toEqual(new Set(['isActive']));
    });
  });
});
