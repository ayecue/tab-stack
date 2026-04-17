import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import type {
  ResolvedTabChangeEvent,
  VersionedWindowSnapshot,
} from '../../../src/types/tab-change-proxy';
import {
  AUXILIARY_ANALYZER_SCENARIO_CODES,
  type DocVerifierKey,
  TAB_BEHAVIOUR_SECTION_CONTRACTS,
} from '../../helpers/tab-behaviour-doc-contract';
import {
  getAnalyzerScenarioCode,
  normalizeResolvedResult,
  runAnalyzerScenario,
} from '../../helpers/tab-change-pipeline-analyzer';
import { listAnalyzerScenarioNames } from '../../helpers/event-analyzer-fixture';

interface FlatTabEntry {
  label: string;
  viewColumn: number;
  index: number;
  isActive: boolean;
  isDirty: boolean;
  isPinned: boolean;
  isPreview: boolean;
}

interface FlatGroupEntry {
  viewColumn: number;
  isActive: boolean;
  tabCount: number;
}

interface ScenarioContext {
  scenarioName: string;
  scenarioCode: string;
  result: ResolvedTabChangeEvent;
  normalized: ReturnType<typeof normalizeResolvedResult>;
  beforeTabs: FlatTabEntry[];
  afterTabs: FlatTabEntry[];
  beforeGroups: FlatGroupEntry[];
  afterGroups: FlatGroupEntry[];
}

interface ParsedDocSection {
  heading: string;
  status: string;
  evidence: string[];
}

const VALIDATION_DOC_PATH = path.resolve(
  __dirname,
  '../../../docs/tab-behaviour-validation.md',
);

function flattenTabs(snapshot: VersionedWindowSnapshot): FlatTabEntry[] {
  return [...snapshot.tabs.values()]
    .map((entry) => ({
      label: entry.tab.label,
      viewColumn: entry.viewColumn,
      index: entry.index,
      isActive: entry.isActive,
      isDirty: entry.isDirty,
      isPinned: entry.isPinned,
      isPreview: entry.isPreview,
    }))
    .sort((left, right) => {
      return (
        left.viewColumn - right.viewColumn ||
        left.index - right.index ||
        left.label.localeCompare(right.label)
      );
    });
}

function flattenGroups(snapshot: VersionedWindowSnapshot): FlatGroupEntry[] {
  const tabs = flattenTabs(snapshot);

  return [...snapshot.groups.values()]
    .map((group) => ({
      viewColumn: group.viewColumn,
      isActive: group.isActive,
      tabCount: tabs.filter((tab) => tab.viewColumn === group.viewColumn).length,
    }))
    .sort((left, right) => left.viewColumn - right.viewColumn);
}

function parseValidationDocSections(markdown: string): ParsedDocSection[] {
  return markdown
    .split('\n### ')
    .slice(1)
    .map((chunk) => {
      const [headingLine, ...restLines] = chunk.split('\n');
      const body = restLines.join('\n');
      const statusMatch = body.match(/\nStatus:\s+([^\n]+)/);
      const evidenceMatch = body.match(/\nEvidence:\s*([^\n]+)/);

      if (!statusMatch || !evidenceMatch) {
        throw new Error(`Could not parse validation doc section ${headingLine.trim()}`);
      }

      return {
        heading: headingLine.trim(),
        status: statusMatch[1].trim(),
        evidence: [...evidenceMatch[1].matchAll(/\[([^\]]+)\]/g)].map((match) => match[1]),
      };
    });
}

function createScenarioContext(scenarioName: string): ScenarioContext {
  const result = runAnalyzerScenario(scenarioName);

  return {
    scenarioName,
    scenarioCode: getAnalyzerScenarioCode(scenarioName),
    result,
    normalized: normalizeResolvedResult(result),
    beforeTabs: flattenTabs(result.beforeSnapshot),
    afterTabs: flattenTabs(result.afterSnapshot),
    beforeGroups: flattenGroups(result.beforeSnapshot),
    afterGroups: flattenGroups(result.afterSnapshot),
  };
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function countLabel(entries: readonly FlatTabEntry[], label: string): number {
  return entries.filter((entry) => entry.label === label).length;
}

function distributionSignature(entries: readonly FlatTabEntry[]): string[] {
  return entries
    .map((entry) => `${entry.label}@${entry.viewColumn}@${entry.index}`)
    .sort();
}

function groupDistributionSignature(entries: readonly FlatTabEntry[]): string[] {
  return entries.map((entry) => `${entry.label}@${entry.viewColumn}`).sort();
}

function activeGroupColumns(groups: readonly FlatGroupEntry[]): number[] {
  return groups.filter((group) => group.isActive).map((group) => group.viewColumn);
}

function updatedOnlyContains(
  context: ScenarioContext,
  expectedChange: string,
): void {
  expect(context.result.updated.length).toBeGreaterThan(0);

  for (const update of context.normalized.updated) {
    expect(update.changed).toEqual([expectedChange]);
  }
}

function activitySignalsOnlyContain(
  context: ScenarioContext,
  expectedChange: string,
): void {
  const movedWithSignals = context.normalized.moved.filter(
    (move) => move.changed.length > 0,
  );

  expect(movedWithSignals.length + context.normalized.updated.length).toBeGreaterThan(0);

  for (const move of movedWithSignals) {
    expect(move.changed).toEqual([expectedChange]);
  }

  for (const update of context.normalized.updated) {
    expect(update.changed).toEqual([expectedChange]);
  }
}

function expectFlagTransition(
  context: ScenarioContext,
  key: 'isDirty' | 'isPinned' | 'isPreview',
  beforeValue: boolean,
  afterValue: boolean,
): void {
  const updatedLabels = unique(context.normalized.updated.map((update) => update.label));

  expect(
    updatedLabels.some((label) => {
      const beforeEntries = context.beforeTabs.filter((entry) => entry.label === label);
      const afterEntries = context.afterTabs.filter((entry) => entry.label === label);

      return beforeEntries.some(
        (beforeEntry) =>
          beforeEntry[key] === beforeValue &&
          afterEntries.some((afterEntry) => afterEntry[key] === afterValue),
      );
    }),
  ).toBe(true);
}

function verifyTabActivation(context: ScenarioContext): void {
  expect(context.normalized.created).toHaveLength(0);
  expect(context.normalized.closed).toHaveLength(0);
  expect(context.normalized.moved).toHaveLength(0);
  updatedOnlyContains(context, 'isActive');
  expect(activeGroupColumns(context.afterGroups)).toEqual(activeGroupColumns(context.beforeGroups));
}

function verifySingleTabClose(context: ScenarioContext): void {
  expect(context.normalized.created).toHaveLength(0);
  expect(context.normalized.closed.length).toBeGreaterThan(0);
  expect(context.afterTabs.length).toBe(context.beforeTabs.length - context.normalized.closed.length);
}

function verifyCloseOtherTabs(context: ScenarioContext): void {
  expect(context.normalized.created).toHaveLength(0);
  expect(context.normalized.closed.length).toBeGreaterThan(0);
  expect(context.afterGroups.length).toBe(context.beforeGroups.length);
  expect(context.afterTabs.length).toBeLessThan(context.beforeTabs.length);
}

function verifyOpenFileInActiveGroup(context: ScenarioContext): void {
  expect(context.normalized.closed).toHaveLength(0);
  if (context.normalized.created.length > 0) {
    if (context.beforeTabs.length > 0) {
      updatedOnlyContains(context, 'isActive');
    } else {
      expect(context.normalized.updated).toHaveLength(0);
    }
    expect(context.afterTabs.length).toBe(context.beforeTabs.length + context.normalized.created.length);
  } else {
    expect(context.normalized.moved).toHaveLength(0);
    updatedOnlyContains(context, 'isActive');
    expect(context.afterTabs.length).toBe(context.beforeTabs.length);
  }
}

function verifySameGroupReorder(context: ScenarioContext): void {
  expect(context.normalized.created).toHaveLength(0);
  expect(context.normalized.closed).toHaveLength(0);
  expect(context.normalized.updated).toHaveLength(0);
  expect(context.normalized.moved.length).toBeGreaterThan(0);

  for (const move of context.normalized.moved) {
    expect(move.fromViewColumn).toBe(move.toViewColumn);
  }
}

function verifyCrossGroupMove(context: ScenarioContext): void {
  expect(context.afterGroups.length).toBeLessThanOrEqual(context.beforeGroups.length);
  expect(context.normalized.created.length + context.normalized.closed.length + context.normalized.moved.length).toBeGreaterThan(0);
  expect(groupDistributionSignature(context.afterTabs)).not.toEqual(
    groupDistributionSignature(context.beforeTabs),
  );
}

function verifyMoveToNewGroup(context: ScenarioContext): void {
  expect(context.afterGroups.length).toBe(context.beforeGroups.length + 1);
  expect(context.normalized.created).toHaveLength(0);
  expect(context.normalized.moved.length).toBeGreaterThan(0);
}

function verifySplitEditor(context: ScenarioContext): void {
  expect(context.afterGroups.length).toBe(context.beforeGroups.length + 1);
  expect(context.normalized.closed).toHaveLength(0);
  expect(context.normalized.created.length).toBeGreaterThan(0);

  for (const label of unique(context.normalized.created)) {
    expect(countLabel(context.afterTabs, label)).toBe(countLabel(context.beforeTabs, label) + 1);
  }
}

function verifyMultiTabSameGroup(context: ScenarioContext): void {
  expect(context.normalized.created).toHaveLength(0);
  expect(context.normalized.closed).toHaveLength(0);
  expect(context.normalized.moved.length).toBeGreaterThan(0);
  activitySignalsOnlyContain(context, 'isActive');

  for (const move of context.normalized.moved) {
    expect(move.fromViewColumn).toBe(move.toViewColumn);
  }

  expect(unique(context.normalized.moved.map((move) => move.label)).length).toBeGreaterThan(1);
}

function verifyMultiTabCrossGroup(context: ScenarioContext): void {
  verifyCrossGroupMove(context);
  expect(
    unique([
      ...context.normalized.created,
      ...context.normalized.closed,
      ...context.normalized.moved.map((move) => move.label),
    ]).length,
  ).toBeGreaterThan(1);
}

function verifyMultiTabNewGroup(context: ScenarioContext): void {
  verifyMoveToNewGroup(context);
  expect(unique(context.normalized.moved.map((move) => move.label)).length).toBeGreaterThan(1);
}

function verifyMultiTabSplit(context: ScenarioContext): void {
  verifySplitEditor(context);
  expect(unique(context.normalized.created).length).toBeGreaterThan(1);
}

function verifyDuplicateTargetMove(context: ScenarioContext): void {
  expect(context.afterGroups.length).toBe(context.beforeGroups.length);
  expect(context.normalized.closed.length).toBeGreaterThan(0);
  expect(
    context.normalized.closed.some(
      (label) => countLabel(context.afterTabs, label) === countLabel(context.beforeTabs, label) - 1,
    ),
  ).toBe(true);
}

function verifyLastTabMoveOut(context: ScenarioContext): void {
  expect(context.afterGroups.length).toBe(context.beforeGroups.length - 1);
  expect(context.afterTabs.length).toBe(context.beforeTabs.length);
  expect(context.normalized.moved.length).toBeGreaterThan(0);
}

function verifyLastTabDuplicateMove(context: ScenarioContext): void {
  expect(context.afterGroups.length).toBe(context.beforeGroups.length - 1);
  expect(context.afterTabs.length).toBe(context.beforeTabs.length - 1);
  expect(context.normalized.closed.length).toBeGreaterThan(0);
}

function verifyDirtyDirect(context: ScenarioContext): void {
  expect(context.normalized.created).toHaveLength(0);
  expect(context.normalized.closed).toHaveLength(0);
  expect(context.normalized.moved).toHaveLength(0);
  updatedOnlyContains(context, 'isDirty');
  expectFlagTransition(context, 'isDirty', false, true);
}

function verifyPinDirect(context: ScenarioContext): void {
  expect(context.normalized.created).toHaveLength(0);
  expect(context.normalized.closed).toHaveLength(0);
  expect(context.normalized.moved).toHaveLength(0);
  updatedOnlyContains(context, 'isPinned');
  expectFlagTransition(context, 'isPinned', false, true);
}

function verifyPreviewPromotion(context: ScenarioContext): void {
  expect(context.normalized.created).toHaveLength(0);
  expect(context.normalized.closed).toHaveLength(0);
  expect(context.normalized.moved).toHaveLength(0);
  updatedOnlyContains(context, 'isPreview');
  expectFlagTransition(context, 'isPreview', true, false);
}

function verifyGroupActivation(context: ScenarioContext): void {
  expect(context.normalized.created).toHaveLength(0);
  expect(context.normalized.closed).toHaveLength(0);
  expect(context.normalized.moved).toHaveLength(0);
  updatedOnlyContains(context, 'isActive');
  expect(activeGroupColumns(context.afterGroups)).not.toEqual(activeGroupColumns(context.beforeGroups));
}

function verifyGroupClose(context: ScenarioContext): void {
  expect(context.afterGroups.length).toBe(context.beforeGroups.length - 1);
  expect(context.normalized.closed.length).toBeGreaterThan(0);
}

function verifyGroupCloseMultiple(context: ScenarioContext): void {
  verifyGroupClose(context);
  expect(context.normalized.closed.length).toBeGreaterThan(1);
}

function verifyGroupCreate(context: ScenarioContext): void {
  expect(context.afterGroups.length).toBe(context.beforeGroups.length + 1);
  expect(context.normalized.created).toHaveLength(0);
  expect(context.normalized.closed).toHaveLength(0);
  expect(context.normalized.moved).toHaveLength(0);
}

function verifyGroupReorder(context: ScenarioContext): void {
  expect(context.beforeGroups.length).toBe(context.afterGroups.length);
  expect(context.normalized.created).toHaveLength(0);
  expect(context.normalized.closed).toHaveLength(0);
  expect(context.normalized.moved.length).toBeGreaterThan(0);
  expect(distributionSignature(context.afterTabs)).not.toEqual(
    distributionSignature(context.beforeTabs),
  );
}

function verifyGroupMerge(context: ScenarioContext): void {
  expect(context.afterGroups.length).toBeLessThan(context.beforeGroups.length);
  expect(context.normalized.created).toHaveLength(0);
  expect(context.normalized.closed.length + context.normalized.moved.length).toBeGreaterThan(0);
  expect(context.afterTabs.length).toBeLessThanOrEqual(context.beforeTabs.length);
}

const VERIFY_BY_KEY: Record<DocVerifierKey, (context: ScenarioContext) => void> = {
  'tab-activation': verifyTabActivation,
  'single-tab-close': verifySingleTabClose,
  'close-other-tabs': verifyCloseOtherTabs,
  'open-file-active-group': verifyOpenFileInActiveGroup,
  'same-group-reorder': verifySameGroupReorder,
  'cross-group-move': verifyCrossGroupMove,
  'move-to-new-group': verifyMoveToNewGroup,
  'split-editor': verifySplitEditor,
  'multi-tab-same-group': verifyMultiTabSameGroup,
  'multi-tab-cross-group': verifyMultiTabCrossGroup,
  'multi-tab-new-group': verifyMultiTabNewGroup,
  'multi-tab-split': verifyMultiTabSplit,
  'duplicate-target-move': verifyDuplicateTargetMove,
  'last-tab-move-out': verifyLastTabMoveOut,
  'last-tab-duplicate-move': verifyLastTabDuplicateMove,
  'dirty-direct': verifyDirtyDirect,
  'pin-direct': verifyPinDirect,
  'preview-promotion': verifyPreviewPromotion,
  'group-activation': verifyGroupActivation,
  'group-close': verifyGroupClose,
  'group-close-multiple': verifyGroupCloseMultiple,
  'group-create': verifyGroupCreate,
  'group-reorder': verifyGroupReorder,
  'group-merge': verifyGroupMerge,
  'no-direct-evidence': () => {},
};

describe('tab behaviour validation doc alignment', () => {
  const validationDoc = fs.readFileSync(VALIDATION_DOC_PATH, 'utf8');
  const parsedSections = parseValidationDocSections(validationDoc);
  const parsedSectionsByHeading = new Map(
    parsedSections.map((section) => [section.heading, section]),
  );
  const scenarioNames = listAnalyzerScenarioNames();
  const scenarioNamesByCode = new Map(
    scenarioNames.map((name) => [getAnalyzerScenarioCode(name), name]),
  );

  it('keeps the validation summary counts in sync with the contract', () => {
    const summaryMatch = validationDoc.match(
      /Current summary:\n\n- Proven: (\d+)\n- Disproven: (\d+)\n- Conditional: (\d+)/,
    );

    expect(summaryMatch).not.toBeNull();

    const [, proven, disproven, conditional] = summaryMatch!;

    expect(Number(proven)).toBe(
      TAB_BEHAVIOUR_SECTION_CONTRACTS.filter((section) => section.status === 'Proven').length,
    );
    expect(Number(disproven)).toBe(
      TAB_BEHAVIOUR_SECTION_CONTRACTS.filter((section) => section.status === 'Disproven').length,
    );
    expect(Number(conditional)).toBe(
      TAB_BEHAVIOUR_SECTION_CONTRACTS.filter((section) => section.status === 'Conditional').length,
    );
  });

  it('documents the same section statuses and evidence as the contract', () => {
    expect(parsedSectionsByHeading.size).toBe(TAB_BEHAVIOUR_SECTION_CONTRACTS.length);

    for (const contract of TAB_BEHAVIOUR_SECTION_CONTRACTS) {
      const parsedSection = parsedSectionsByHeading.get(contract.heading);

      expect(parsedSection).toBeDefined();
      expect(parsedSection!.status).toBe(contract.status);
      expect(parsedSection!.evidence).toEqual(contract.evidence);
    }
  });

  it('accounts for every analyzer scenario as either direct evidence or auxiliary coverage', () => {
    const coveredCodes = new Set([
      ...TAB_BEHAVIOUR_SECTION_CONTRACTS.flatMap((section) => section.evidence),
      ...AUXILIARY_ANALYZER_SCENARIO_CODES,
    ]);

    expect(new Set(scenarioNames.map(getAnalyzerScenarioCode))).toEqual(coveredCodes);

    for (const code of AUXILIARY_ANALYZER_SCENARIO_CODES) {
      expect(validationDoc).toMatch(new RegExp(`\\[${code}\\]\\(`));
    }
  });

  it.each(
    TAB_BEHAVIOUR_SECTION_CONTRACTS.flatMap((section) =>
      section.evidence.map((scenarioCode) => ({
        heading: section.heading,
        verifier: section.verifier,
        scenarioCode,
      })),
    ),
  )('keeps $scenarioCode aligned with "$heading"', ({ verifier, scenarioCode }) => {
    const scenarioName = scenarioNamesByCode.get(scenarioCode);

    expect(scenarioName).toBeDefined();
    VERIFY_BY_KEY[verifier](createScenarioContext(scenarioName!));
  });
});