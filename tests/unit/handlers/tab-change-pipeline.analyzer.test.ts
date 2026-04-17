import { describe, expect, it } from 'vitest';

import type {
  WindowSnapshot,
  VersionedWindowSnapshot,
} from '../../../src/types/tab-change-proxy';
import {
  listAnalyzerScenarioNames,
  loadAnalyzerScenario,
} from '../../helpers/event-analyzer-fixture';
import {
  findMovedTab,
  findUpdatedTab,
  labels,
  type NormalizedResult,
  normalizeResolvedResult,
  runAnalyzerScenario,
} from '../../helpers/tab-change-pipeline-analyzer';

interface NormalizedSnapshotTab {
  exactKeyClue: string;
  localRefClue: string;
  globalRefClue: string;
  groupFingerprintClue: string;
  label: string;
  viewColumn: number;
  index: number;
  isActive: boolean;
  isDirty: boolean;
  isPinned: boolean;
  isPreview: boolean;
}

interface NormalizedSnapshotGroup {
  viewColumn: number;
  fingerprintClue: string;
  fingerprint: string;
  isActive: boolean;
}

interface NormalizedSnapshot {
  version: number;
  tabs: NormalizedSnapshotTab[];
  groups: NormalizedSnapshotGroup[];
}

const comprehensiveScenarioExpectations: Record<string, NormalizedResult> = {
  'C: move tab cross-column': {
    created: [],
    closed: [],
    moved: [
      {
        label: 'README.md',
        fromViewColumn: 1,
        toViewColumn: 2,
        fromIndex: 1,
        toIndex: 1,
        changed: ['isActive'],
      },
    ],
    updated: [
      { label: 'package.json', changed: ['isActive'] },
      { label: 'tsconfig.json', changed: ['isActive'] },
    ],
  },
  'H: activate different tab': {
    created: [],
    closed: [],
    moved: [],
    updated: [
      { label: 'package.json', changed: ['isActive'] },
      { label: 'README.md', changed: ['isActive'] },
    ],
  },
  'I: duplicate in another column': {
    created: ['package.json'],
    closed: [],
    moved: [],
    updated: [],
  },
  'J: close last in group': {
    created: [],
    closed: ['README.md'],
    moved: [],
    updated: [{ label: 'package.json', changed: ['isActive'] }],
  },
  'K: multi-step reorder': {
    created: [],
    closed: [],
    moved: [
      {
        label: 'package.json',
        fromViewColumn: 1,
        toViewColumn: 1,
        fromIndex: 0,
        toIndex: 1,
        changed: [],
      },
      {
        label: 'README.md',
        fromViewColumn: 1,
        toViewColumn: 1,
        fromIndex: 1,
        toIndex: 2,
        changed: [],
      },
      {
        label: 'tsconfig.json',
        fromViewColumn: 1,
        toViewColumn: 1,
        fromIndex: 2,
        toIndex: 3,
        changed: [],
      },
      {
        label: 'vitest.config.ts',
        fromViewColumn: 1,
        toViewColumn: 1,
        fromIndex: 3,
        toIndex: 2,
        changed: [],
      },
    ],
    updated: [],
  },
  'L: 3-column group move': {
    created: [],
    closed: [],
    moved: [
      {
        label: 'package.json',
        fromViewColumn: 1,
        toViewColumn: 2,
        fromIndex: 0,
        toIndex: 0,
        changed: [],
      },
      {
        label: 'README.md',
        fromViewColumn: 2,
        toViewColumn: 1,
        fromIndex: 0,
        toIndex: 0,
        changed: [],
      },
    ],
    updated: [],
  },
  'M: 4-col move vc1→vc4': {
    created: [],
    closed: [],
    moved: [
      {
        label: 'package.json',
        fromViewColumn: 1,
        toViewColumn: 4,
        fromIndex: 0,
        toIndex: 0,
        changed: [],
      },
      {
        label: 'README.md',
        fromViewColumn: 1,
        toViewColumn: 4,
        fromIndex: 1,
        toIndex: 1,
        changed: [],
      },
      {
        label: 'tsconfig.json',
        fromViewColumn: 2,
        toViewColumn: 1,
        fromIndex: 0,
        toIndex: 0,
        changed: [],
      },
      {
        label: 'vitest.config.ts',
        fromViewColumn: 2,
        toViewColumn: 1,
        fromIndex: 1,
        toIndex: 1,
        changed: [],
      },
      {
        label: 'LICENSE',
        fromViewColumn: 2,
        toViewColumn: 1,
        fromIndex: 2,
        toIndex: 2,
        changed: [],
      },
      {
        label: 'CHANGELOG.md',
        fromViewColumn: 3,
        toViewColumn: 2,
        fromIndex: 0,
        toIndex: 0,
        changed: [],
      },
      {
        label: 'webview.html',
        fromViewColumn: 3,
        toViewColumn: 2,
        fromIndex: 1,
        toIndex: 1,
        changed: [],
      },
      {
        label: 'webview.css',
        fromViewColumn: 4,
        toViewColumn: 3,
        fromIndex: 0,
        toIndex: 0,
        changed: [],
      },
      {
        label: 'webview.js',
        fromViewColumn: 4,
        toViewColumn: 3,
        fromIndex: 1,
        toIndex: 1,
        changed: [],
      },
    ],
    updated: [],
  },
  'N: multi-hop tab move': {
    created: [],
    closed: [],
    moved: [
      {
        label: 'README.md',
        fromViewColumn: 1,
        toViewColumn: 3,
        fromIndex: 1,
        toIndex: 1,
        changed: ['isActive'],
      },
    ],
    updated: [
      { label: 'package.json', changed: ['isActive'] },
      { label: 'tsconfig.json', changed: ['isActive'] },
      { label: 'vitest.config.ts', changed: ['isActive'] },
    ],
  },
  'O: group swap + close': {
    created: [],
    closed: ['package.json'],
    moved: [
      {
        label: 'README.md',
        fromViewColumn: 2,
        toViewColumn: 1,
        fromIndex: 0,
        toIndex: 0,
        changed: [],
      },
      {
        label: 'tsconfig.json',
        fromViewColumn: 2,
        toViewColumn: 1,
        fromIndex: 1,
        toIndex: 1,
        changed: [],
      },
    ],
    updated: [],
  },
  'P: group move + reorder': {
    created: [],
    closed: [],
    moved: [
      {
        label: 'package.json',
        fromViewColumn: 1,
        toViewColumn: 2,
        fromIndex: 0,
        toIndex: 0,
        changed: [],
      },
      {
        label: 'README.md',
        fromViewColumn: 1,
        toViewColumn: 2,
        fromIndex: 1,
        toIndex: 1,
        changed: [],
      },
      {
        label: 'tsconfig.json',
        fromViewColumn: 1,
        toViewColumn: 2,
        fromIndex: 2,
        toIndex: 2,
        changed: [],
      },
      {
        label: 'vitest.config.ts',
        fromViewColumn: 2,
        toViewColumn: 1,
        fromIndex: 0,
        toIndex: 0,
        changed: [],
      },
    ],
    updated: [],
  },
  'R: split editor': {
    created: ['package.json'],
    closed: [],
    moved: [],
    updated: [{ label: 'package.json', changed: ['isActive'] }],
  },
  'S: cross-group with index': {
    created: [],
    closed: [],
    moved: [
      {
        label: 'README.md',
        fromViewColumn: 2,
        toViewColumn: 1,
        fromIndex: 0,
        toIndex: 0,
        changed: [],
      },
      {
        label: 'tsconfig.json',
        fromViewColumn: 2,
        toViewColumn: 1,
        fromIndex: 1,
        toIndex: 1,
        changed: [],
      },
      {
        label: 'vitest.config.ts',
        fromViewColumn: 2,
        toViewColumn: 1,
        fromIndex: 2,
        toIndex: 2,
        changed: [],
      },
    ],
    updated: [{ label: 'package.json', changed: ['isActive'] }],
  },
};

function compareLabels(left: string, right: string): number {
  return left.toLowerCase().localeCompare(right.toLowerCase());
}

function compareSnapshotTabs(
  left: NormalizedSnapshotTab,
  right: NormalizedSnapshotTab,
): number {
  return (
    left.viewColumn - right.viewColumn ||
    left.index - right.index ||
    compareLabels(left.label, right.label) ||
    left.exactKeyClue.localeCompare(right.exactKeyClue)
  );
}

function compareSnapshotGroups(
  left: NormalizedSnapshotGroup,
  right: NormalizedSnapshotGroup,
): number {
  return left.viewColumn - right.viewColumn;
}

function hasStructuralDelta(delta: {
  structural: {
    fromViewColumn: number | null;
    toViewColumn: number | null;
    fromIndex: number | null;
    toIndex: number | null;
  };
}): boolean {
  return (
    delta.structural.fromViewColumn !== delta.structural.toViewColumn ||
    delta.structural.fromIndex !== delta.structural.toIndex
  );
}

function hasPropertyDelta(delta: { properties: object }): boolean {
  return Object.keys(delta.properties).length > 0;
}

function normalizeSnapshot(
  snapshot: WindowSnapshot | VersionedWindowSnapshot,
): NormalizedSnapshot {
  return {
    version: 'version' in snapshot ? snapshot.version : -1,
    tabs: [...snapshot.tabs.values()]
      .map((entry) => ({
        exactKeyClue: entry.exactKeyClue,
        localRefClue: entry.localRefClue,
        globalRefClue: entry.globalRefClue,
        groupFingerprintClue: entry.groupFingerprintClue,
        label: entry.tab.label,
        viewColumn: entry.viewColumn,
        index: entry.index,
        isActive: entry.isActive,
        isDirty: entry.isDirty,
        isPinned: entry.isPinned,
        isPreview: entry.isPreview,
      }))
      .sort(compareSnapshotTabs),
    groups: [...snapshot.groups.values()]
      .map((group) => ({
        viewColumn: group.viewColumn,
        fingerprintClue: group.fingerprintClue,
        fingerprint: group.fingerprint,
        isActive: group.isActive,
      }))
      .sort(compareSnapshotGroups),
  };
}

function expectResolvedEventToMatchFixtureCapture(scenarioName: string): void {
  const fixture = loadAnalyzerScenario(scenarioName);
  const result = runAnalyzerScenario(scenarioName);
  const normalizedBeforeSnapshot = normalizeSnapshot(result.beforeSnapshot);
  const normalizedAfterSnapshot = normalizeSnapshot(result.afterSnapshot);
  const tabEndpointChanged =
    JSON.stringify(normalizedBeforeSnapshot.tabs) !==
    JSON.stringify(normalizedAfterSnapshot.tabs);

  expect(normalizedBeforeSnapshot).toEqual(normalizeSnapshot(fixture.initialSnapshot));
  expect(normalizedAfterSnapshot).toEqual(normalizeSnapshot(fixture.finalSnapshot));

  expect(result.source).toBe('delta');
  expect(result.bucketId).toBeGreaterThan(0);
  expect(result.bucketId).toBe(result.resolvedBucketDelta.bucketId);
  expect(result.resolvedBucketDelta.source).toBe(result.source);
  expect(normalizeSnapshot(result.resolvedBucketDelta.beforeSnapshot)).toEqual(
    normalizeSnapshot(result.beforeSnapshot),
  );
  expect(normalizeSnapshot(result.resolvedBucketDelta.afterSnapshot)).toEqual(
    normalizeSnapshot(result.afterSnapshot),
  );
  expect(result.resolvedBucketDelta.tabRewireDeltas).toEqual(
    result.tabRewireDeltas,
  );

  if (tabEndpointChanged) {
    expect(result.tabRewireDeltas.length).toBeGreaterThan(0);
  } else {
    expect(result.tabRewireDeltas).toHaveLength(0);
  }
  expect(result.createdEntries.size).toBe(result.created.length);
  expect(result.closedEntries.size).toBe(result.closed.length);

  for (const tab of result.created) {
    const createdEntry = result.createdEntries.get(tab);

    expect(createdEntry).toBeDefined();
    expect(createdEntry!.tab.label).toBe(tab.label);
    expect(createdEntry!.exactKeyClue).toContain(createdEntry!.globalRefClue);
  }

  for (const tab of result.closed) {
    const closedEntry = result.closedEntries.get(tab);

    expect(closedEntry).toBeDefined();
    expect(closedEntry!.tab.label).toBe(tab.label);
    expect(closedEntry!.exactKeyClue).toContain(closedEntry!.globalRefClue);
  }

  for (const move of result.moved) {
    expect(move.oldEntry.tab.label).toBe(move.tab.label);
    expect(move.entry.tab.label).toBe(move.tab.label);
    expect(move.fromViewColumn).toBeGreaterThan(0);
    expect(move.toViewColumn).toBeGreaterThan(0);
    expect(move.fromIndex).toBeGreaterThanOrEqual(0);
    expect(move.toIndex).toBeGreaterThanOrEqual(0);
  }

  for (const update of result.updated) {
    expect(update.oldEntry.tab.label).toBe(update.tab.label);
    expect(update.entry.tab.label).toBe(update.tab.label);
    expect(update.changed.size).toBeGreaterThan(0);
  }

  for (const delta of result.tabRewireDeltas) {
    if (delta.before != null) {
      expect(delta.entryExactKeyClue).toBe(delta.before.exactKeyClue);
    }

    if (delta.after != null) {
      expect(delta.endExactKeyClue).toBe(delta.after.exactKeyClue);
    }

    switch (delta.kind) {
      case 'create':
        expect(delta.before).toBeNull();
        expect(delta.after).not.toBeNull();
        break;
      case 'close':
        expect(delta.before).not.toBeNull();
        expect(delta.after).toBeNull();
        break;
      case 'move':
        expect(delta.before).not.toBeNull();
        expect(delta.after).not.toBeNull();
        expect(hasStructuralDelta(delta)).toBe(true);
        expect(hasPropertyDelta(delta)).toBe(false);
        break;
      case 'patch':
        expect(delta.before).not.toBeNull();
        expect(delta.after).not.toBeNull();
        expect(hasStructuralDelta(delta)).toBe(false);
        expect(hasPropertyDelta(delta)).toBe(true);
        break;
      case 'move-and-patch':
        expect(delta.before).not.toBeNull();
        expect(delta.after).not.toBeNull();
        expect(hasStructuralDelta(delta)).toBe(true);
        expect(hasPropertyDelta(delta)).toBe(true);
        break;
      case 'ambiguous':
        expect(delta.before != null || delta.after != null).toBe(true);
        break;
    }
  }
}

describe('tab/group event pipeline analyzer fixtures', () => {
  it.each(listAnalyzerScenarioNames())(
    'replays %s into a coherent resolved event',
    (scenarioName) => {
      expectResolvedEventToMatchFixtureCapture(scenarioName);
    },
  );

  it.each(listAnalyzerScenarioNames())(
    'matches the normalized result snapshot for %s',
    (scenarioName) => {
      expect(normalizeResolvedResult(runAnalyzerScenario(scenarioName))).toMatchSnapshot();
    },
  );

  it('resolves scenario A as a created tab', () => {
    const result = runAnalyzerScenario('A: open a single file');

    expect(labels(result.created)).toEqual(['package.json']);
    expect(result.closed).toHaveLength(0);
    expect(result.moved).toHaveLength(0);
  });

  it('resolves scenario B as a closed tab', () => {
    const result = runAnalyzerScenario('B: close a single tab');

    expect(labels(result.closed)).toEqual(['package.json']);
    expect(result.created).toHaveLength(0);
    expect(result.moved).toHaveLength(0);
  });

  it('resolves scenario D as within-group moves for all reordered tabs', () => {
    const result = runAnalyzerScenario('D: reorder within group');

    expect(result.moved).toHaveLength(2);
    expect(result.updated).toHaveLength(0);

    const movedTab = findMovedTab(result, 'tsconfig.json');
    expect(movedTab).toBeDefined();
    expect(movedTab!.fromViewColumn).toBe(1);
    expect(movedTab!.toViewColumn).toBe(1);
    expect(movedTab!.fromIndex).toBe(2);
    expect(movedTab!.toIndex).toBe(1);
    expect(movedTab!.changed).toEqual(new Set());

    const shiftedSibling = findMovedTab(result, 'README.md');
    expect(shiftedSibling).toBeDefined();
    expect(shiftedSibling!.fromViewColumn).toBe(1);
    expect(shiftedSibling!.toViewColumn).toBe(1);
    expect(shiftedSibling!.fromIndex).toBe(1);
    expect(shiftedSibling!.toIndex).toBe(2);
    expect(shiftedSibling!.changed).toEqual(new Set());
  });

  it('resolves scenario E as a three-tab group swap', () => {
    const result = runAnalyzerScenario('E: group swap');

    expect(result.created).toHaveLength(0);
    expect(result.closed).toHaveLength(0);
    expect(result.moved).toHaveLength(3);

    expect(findMovedTab(result, 'package.json')).toMatchObject({
      fromViewColumn: 1,
      toViewColumn: 2,
      fromIndex: 0,
      toIndex: 0,
    });
    expect(findMovedTab(result, 'README.md')).toMatchObject({
      fromViewColumn: 1,
      toViewColumn: 2,
      fromIndex: 1,
      toIndex: 1,
    });
    expect(findMovedTab(result, 'tsconfig.json')).toMatchObject({
      fromViewColumn: 2,
      toViewColumn: 1,
      fromIndex: 0,
      toIndex: 0,
    });
  });

  it('resolves scenario F as a pinned-state update', () => {
    const result = runAnalyzerScenario('F: pin a tab');

    const updatedTab = findUpdatedTab(result, 'package.json');
    expect(updatedTab).toBeDefined();
    expect(updatedTab!.changed).toEqual(new Set(['isPinned']));
    expect(result.created).toHaveLength(0);
    expect(result.closed).toHaveLength(0);
  });

  it('resolves scenario G as a dirty-state update', () => {
    const result = runAnalyzerScenario('G: dirty a tab');

    const updatedTab = findUpdatedTab(result, 'package.json');
    expect(updatedTab).toBeDefined();
    expect(updatedTab!.changed).toEqual(new Set(['isDirty']));
    expect(result.created).toHaveLength(0);
    expect(result.closed).toHaveLength(0);
  });

  it('resolves scenario Q as a middle-group close plus a renumbered move', () => {
    const result = runAnalyzerScenario('Q: close middle group');

    expect(labels(result.closed)).toEqual(['README.md', 'tsconfig.json']);
    expect(result.created).toHaveLength(0);

    const movedTab = findMovedTab(result, 'vitest.config.ts');
    expect(movedTab).toBeDefined();
    expect(movedTab!.fromViewColumn).toBe(3);
    expect(movedTab!.toViewColumn).toBe(2);
    expect(movedTab!.fromIndex).toBe(0);
    expect(movedTab!.toIndex).toBe(0);
  });

  it.each(Object.entries(comprehensiveScenarioExpectations))(
    'matches the analyzer-backed normalized result for %s',
    (scenarioName, expectedSummary) => {
      expect(normalizeResolvedResult(runAnalyzerScenario(scenarioName))).toEqual(expectedSummary);
    },
  );
});