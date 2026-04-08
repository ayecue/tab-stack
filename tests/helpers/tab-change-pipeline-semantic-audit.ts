import type {
  TabChangeProperty,
  TabEntrySnapshot,
  TabRewireDelta,
  WindowSnapshot,
} from '../../src/types/tab-change-proxy';
import {
  getAnalyzerScenarioCode,
  runAnalyzerScenario,
} from './tab-change-pipeline-analyzer';
import { listAnalyzerScenarioNames } from './event-analyzer-fixture';

export interface SemanticOracleMove {
  beforeExactKeyClue: string;
  afterExactKeyClue: string;
  beforeViewColumn: number;
  beforeIndex: number;
  afterViewColumn: number;
  afterIndex: number;
  changed: TabChangeProperty[];
}

export interface SemanticOracleUpdate {
  beforeExactKeyClue: string;
  afterExactKeyClue: string;
  changed: TabChangeProperty[];
}

export interface EndpointSemanticOracle {
  creates: string[];
  closes: string[];
  moves: SemanticOracleMove[];
  updates: SemanticOracleUpdate[];
  ambiguousGlobalRefClues: string[];
}

export interface ScenarioSemanticAuditFinding {
  scenarioName: string;
  scenarioCode: string;
  ambiguousGlobalRefClues: string[];
  missingCreates: string[];
  extraCreates: string[];
  missingCloses: string[];
  extraCloses: string[];
  missingMoves: string[];
  extraMoves: string[];
  missingUpdates: string[];
  extraUpdates: string[];
  noOpPatches: string[];
  suspicious: boolean;
}

export interface SemanticAuditSummary {
  totalScenarios: number;
  suspiciousScenarios: number;
  cleanScenarios: number;
}

export interface SemanticAuditReport {
  summary: SemanticAuditSummary;
  suspiciousScenarioCodes: string[];
  findings: ScenarioSemanticAuditFinding[];
}

interface SemanticMoveRecord {
  before: TabEntrySnapshot;
  after: TabEntrySnapshot;
  changed: TabChangeProperty[];
}

function compareExactKeyClues(left: string, right: string): number {
  return left.localeCompare(right);
}

function createSnapshotAddressKey(entry: TabEntrySnapshot): string {
  return `${entry.viewColumn}:${entry.index}:${entry.globalRefClue}`;
}

function hasSnapshotAddress(
  snapshot: WindowSnapshot,
  entry: Pick<TabEntrySnapshot, 'viewColumn' | 'index' | 'globalRefClue'>,
): boolean {
  return snapshot.tabs.has(createSnapshotAddressKey(entry as TabEntrySnapshot));
}

function getUniqueEntriesByGlobalRef(
  snapshot: WindowSnapshot,
): Map<string, TabEntrySnapshot> {
  const grouped = groupByGlobalRef(sortEntries(snapshot.tabs.values()));
  const uniqueEntries = new Map<string, TabEntrySnapshot>();

  for (const [globalRefClue, entries] of grouped) {
    if (entries.length === 1) {
      uniqueEntries.set(globalRefClue, entries[0]);
    }
  }

  return uniqueEntries;
}

function getDuplicateGlobalRefClues(snapshot: WindowSnapshot): string[] {
  return [...groupByGlobalRef(sortEntries(snapshot.tabs.values())).entries()]
    .filter(([, entries]) => entries.length > 1)
    .map(([globalRefClue]) => globalRefClue)
    .sort(compareExactKeyClues);
}

function sortEntries(entries: Iterable<TabEntrySnapshot>): TabEntrySnapshot[] {
  return [...entries].sort(
    (left, right) =>
      left.viewColumn - right.viewColumn ||
      left.index - right.index ||
      left.exactKeyClue.localeCompare(right.exactKeyClue),
  );
}

function groupByGlobalRef(
  entries: readonly TabEntrySnapshot[],
): Map<string, TabEntrySnapshot[]> {
  const grouped = new Map<string, TabEntrySnapshot[]>();

  for (const entry of entries) {
    const existing = grouped.get(entry.globalRefClue);

    if (existing) {
      existing.push(entry);
    } else {
      grouped.set(entry.globalRefClue, [entry]);
    }
  }

  for (const values of grouped.values()) {
    values.sort(
      (left, right) =>
        left.viewColumn - right.viewColumn ||
        left.index - right.index ||
        left.exactKeyClue.localeCompare(right.exactKeyClue),
    );
  }

  return grouped;
}

function diffProperties(
  before: TabEntrySnapshot,
  after: TabEntrySnapshot,
): TabChangeProperty[] {
  const changed: TabChangeProperty[] = [];

  if (before.isActive !== after.isActive) {
    changed.push('isActive');
  }

  if (before.isDirty !== after.isDirty) {
    changed.push('isDirty');
  }

  if (before.isPinned !== after.isPinned) {
    changed.push('isPinned');
  }

  if (before.isPreview !== after.isPreview) {
    changed.push('isPreview');
  }

  return changed;
}

function normalizeMoveProperties(
  beforeViewColumn: number,
  beforeIndex: number,
  afterViewColumn: number,
  afterIndex: number,
  changed: readonly TabChangeProperty[],
  groupCountChanged: boolean,
): TabChangeProperty[] {
  const normalized = [...changed];

  if (groupCountChanged) {
    return normalized.filter((property) => property !== 'isActive').sort();
  }

  // Same-group reorder traces often carry transient activity churn that does not
  // survive to the final endpoint snapshot. Keep the structural move, but do not
  // treat that focus noise as a semantic mismatch.
  if (beforeViewColumn === afterViewColumn && beforeIndex !== afterIndex) {
    return normalized.filter((property) => property !== 'isActive').sort();
  }

  return normalized.sort();
}

function toMoveSignature(
  beforeExactKeyClue: string,
  afterExactKeyClue: string,
  beforeViewColumn: number,
  beforeIndex: number,
  afterViewColumn: number,
  afterIndex: number,
  changed: readonly TabChangeProperty[],
  groupCountChanged: boolean,
): string | null {
  if (groupCountChanged && beforeViewColumn === afterViewColumn) {
    return null;
  }

  return `${beforeExactKeyClue}->${afterExactKeyClue}|${normalizeMoveProperties(beforeViewColumn, beforeIndex, afterViewColumn, afterIndex, changed, groupCountChanged).join(',')}`;
}

function toUpdateSignature(
  beforeExactKeyClue: string,
  afterExactKeyClue: string,
  changed: readonly TabChangeProperty[],
): string {
  return `${beforeExactKeyClue}->${afterExactKeyClue}|${[...changed].sort().join(',')}`;
}

function getRewirePropertyChanges(delta: TabRewireDelta): TabChangeProperty[] {
  return Object.keys(delta.properties)
    .sort()
    .filter(
      (changed): changed is TabChangeProperty =>
        changed === 'isActive' ||
        changed === 'isDirty' ||
        changed === 'isPinned' ||
        changed === 'isPreview',
    );
}

function canonicalizeMoveEntry(
  entry: TabEntrySnapshot,
  snapshot: WindowSnapshot,
  uniqueEntriesByGlobalRef: ReadonlyMap<string, TabEntrySnapshot>,
): TabEntrySnapshot {
  if (hasSnapshotAddress(snapshot, entry)) {
    return entry;
  }

  return uniqueEntriesByGlobalRef.get(entry.globalRefClue) ?? entry;
}

function resolveUpdateEndpointEntry(
  entry: TabEntrySnapshot,
  snapshot: WindowSnapshot,
  uniqueEntriesByGlobalRef: ReadonlyMap<string, TabEntrySnapshot>,
): TabEntrySnapshot {
  return (
    snapshot.tabs.get(entry.exactKeyClue) ??
    uniqueEntriesByGlobalRef.get(entry.globalRefClue) ??
    entry
  );
}

function mergeCanonicalMoveRecords(
  moves: readonly SemanticMoveRecord[],
): SemanticMoveRecord[] {
  const merged = new Map<string, SemanticMoveRecord>();

  for (const move of moves) {
    const key = `${createSnapshotAddressKey(move.before)}->${createSnapshotAddressKey(move.after)}`;
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, {
        before: move.before,
        after: move.after,
        changed: [...move.changed].sort(),
      });
      continue;
    }

    existing.changed = [...new Set([...existing.changed, ...move.changed])].sort();
  }

  return [...merged.values()].sort(
    (left, right) =>
      compareExactKeyClues(left.before.exactKeyClue, right.before.exactKeyClue) ||
      compareExactKeyClues(left.after.exactKeyClue, right.after.exactKeyClue) ||
      left.before.index - right.before.index ||
      left.after.index - right.after.index,
  );
}

export function createEndpointSemanticOracle(
  beforeSnapshot: WindowSnapshot,
  afterSnapshot: WindowSnapshot,
): EndpointSemanticOracle {
  const creates: string[] = [];
  const closes: string[] = [];
  const moves: SemanticOracleMove[] = [];
  const updates: SemanticOracleUpdate[] = [];
  const groupCountChanged =
    beforeSnapshot.groups.size !== afterSnapshot.groups.size;
  const ambiguousGlobalRefClueSet = new Set<string>([
    ...getDuplicateGlobalRefClues(beforeSnapshot),
    ...getDuplicateGlobalRefClues(afterSnapshot),
  ]);
  const beforeByAddress = new Map(
    sortEntries(beforeSnapshot.tabs.values()).map((entry) => [createSnapshotAddressKey(entry), entry]),
  );
  const afterByAddress = new Map(
    sortEntries(afterSnapshot.tabs.values()).map((entry) => [createSnapshotAddressKey(entry), entry]),
  );
  const sharedAddressKeys = [...beforeByAddress.keys()].filter((addressKey) =>
    afterByAddress.has(addressKey),
  );
  const beforeOnly = sortEntries(
    [...beforeByAddress.values()].filter(
      (entry) => !afterByAddress.has(createSnapshotAddressKey(entry)),
    ),
  );
  const afterOnly = sortEntries(
    [...afterByAddress.values()].filter(
      (entry) => !beforeByAddress.has(createSnapshotAddressKey(entry)),
    ),
  );

  for (const addressKey of sharedAddressKeys) {
    const before = beforeByAddress.get(addressKey)!;
    const after = afterByAddress.get(addressKey)!;

    if (ambiguousGlobalRefClueSet.has(before.globalRefClue)) {
      continue;
    }

    const changed = diffProperties(before, after);

    if (changed.length > 0) {
      updates.push({
        beforeExactKeyClue: before.exactKeyClue,
        afterExactKeyClue: after.exactKeyClue,
        changed,
      });
    }
  }

  const beforeOnlyByGlobalRef = groupByGlobalRef(beforeOnly);
  const afterOnlyByGlobalRef = groupByGlobalRef(afterOnly);
  const globalRefClues = new Set([
    ...beforeOnlyByGlobalRef.keys(),
    ...afterOnlyByGlobalRef.keys(),
  ]);

  for (const globalRefClue of [...globalRefClues].sort()) {
    if (ambiguousGlobalRefClueSet.has(globalRefClue)) {
      continue;
    }

    const beforeEntries = beforeOnlyByGlobalRef.get(globalRefClue) ?? [];
    const afterEntries = afterOnlyByGlobalRef.get(globalRefClue) ?? [];

    if (beforeEntries.length > 1 || afterEntries.length > 1) {
      if (beforeEntries.length > 0 || afterEntries.length > 0) {
        ambiguousGlobalRefClueSet.add(globalRefClue);
      }

      continue;
    }

    const before = beforeEntries[0] ?? null;
    const after = afterEntries[0] ?? null;

    if (before && after) {
      const changed = diffProperties(before, after);
      const structuralChanged =
        before.viewColumn !== after.viewColumn || before.index !== after.index;

      if (structuralChanged) {
        if (
          groupCountChanged &&
          before.viewColumn === after.viewColumn &&
          changed.length > 0
        ) {
          updates.push({
            beforeExactKeyClue: before.exactKeyClue,
            afterExactKeyClue: after.exactKeyClue,
            changed,
          });
          continue;
        }

        moves.push({
          beforeExactKeyClue: before.exactKeyClue,
          afterExactKeyClue: after.exactKeyClue,
          beforeViewColumn: before.viewColumn,
          beforeIndex: before.index,
          afterViewColumn: after.viewColumn,
          afterIndex: after.index,
          changed,
        });
      } else if (changed.length > 0) {
        updates.push({
          beforeExactKeyClue: before.exactKeyClue,
          afterExactKeyClue: after.exactKeyClue,
          changed,
        });
      }

      continue;
    }

    if (before) {
      closes.push(before.exactKeyClue);
    }

    if (after) {
      creates.push(after.exactKeyClue);
    }
  }

  return {
    creates: creates.sort(compareExactKeyClues),
    closes: closes.sort(compareExactKeyClues),
    moves: moves.sort(
      (left, right) =>
        compareExactKeyClues(left.beforeExactKeyClue, right.beforeExactKeyClue) ||
        compareExactKeyClues(left.afterExactKeyClue, right.afterExactKeyClue),
    ),
    updates: updates.sort(
      (left, right) =>
        compareExactKeyClues(left.beforeExactKeyClue, right.beforeExactKeyClue) ||
        compareExactKeyClues(left.afterExactKeyClue, right.afterExactKeyClue),
    ),
    ambiguousGlobalRefClues: [...ambiguousGlobalRefClueSet].sort(compareExactKeyClues),
  };
}

function getActualCreates(
  result: { tabRewireDeltas: readonly TabRewireDelta[] },
  ignoredGlobalRefClues: ReadonlySet<string>,
): string[] {
  return result.tabRewireDeltas
    .filter(
      (delta) =>
        delta.kind === 'create' &&
        delta.after != null &&
        !ignoredGlobalRefClues.has(delta.after.globalRefClue),
    )
    .map((delta) => delta.after!.exactKeyClue)
    .sort(compareExactKeyClues);
}

function getActualCloses(
  result: { tabRewireDeltas: readonly TabRewireDelta[] },
  ignoredGlobalRefClues: ReadonlySet<string>,
): string[] {
  return result.tabRewireDeltas
    .filter(
      (delta) =>
        delta.kind === 'close' &&
        delta.before != null &&
        !ignoredGlobalRefClues.has(delta.before.globalRefClue),
    )
    .map((delta) => delta.before!.exactKeyClue)
    .sort(compareExactKeyClues);
}

function getActualMoves(result: {
  beforeSnapshot: WindowSnapshot;
  afterSnapshot: WindowSnapshot;
  tabRewireDeltas: readonly TabRewireDelta[];
}, ignoredGlobalRefClues: ReadonlySet<string>): string[] {
  const groupCountChanged =
    result.beforeSnapshot.groups.size !== result.afterSnapshot.groups.size;
  const uniqueBeforeEntriesByGlobalRef = getUniqueEntriesByGlobalRef(
    result.beforeSnapshot,
  );
  const uniqueAfterEntriesByGlobalRef = getUniqueEntriesByGlobalRef(
    result.afterSnapshot,
  );

  const canonicalMoves = mergeCanonicalMoveRecords(
    result.tabRewireDeltas
    .filter(
      (delta) =>
        (delta.kind === 'move' || delta.kind === 'move-and-patch') &&
        delta.before != null &&
        delta.after != null,
    )
    .map((delta) => ({
      before: canonicalizeMoveEntry(
        delta.before!,
        result.beforeSnapshot,
        uniqueBeforeEntriesByGlobalRef,
      ),
      after: canonicalizeMoveEntry(
        delta.after!,
        result.afterSnapshot,
        uniqueAfterEntriesByGlobalRef,
      ),
      changed: getRewirePropertyChanges(delta),
    })),
  );

  return canonicalMoves
    .filter(
      (move) =>
        !ignoredGlobalRefClues.has(move.before.globalRefClue) &&
        !ignoredGlobalRefClues.has(move.after.globalRefClue),
    )
    .map((move) =>
      toMoveSignature(
        move.before.exactKeyClue,
        move.after.exactKeyClue,
        move.before.viewColumn,
        move.before.index,
        move.after.viewColumn,
        move.after.index,
        move.changed,
        groupCountChanged,
      ),
    )
    .filter((signature): signature is string => signature != null)
    .sort(compareExactKeyClues);
}

function getActualUpdates(result: {
  beforeSnapshot: WindowSnapshot;
  afterSnapshot: WindowSnapshot;
  tabRewireDeltas: readonly TabRewireDelta[];
}, ignoredGlobalRefClues: ReadonlySet<string>): string[] {
  const groupCountChanged =
    result.beforeSnapshot.groups.size !== result.afterSnapshot.groups.size;
  const uniqueBeforeEntriesByGlobalRef = getUniqueEntriesByGlobalRef(
    result.beforeSnapshot,
  );
  const uniqueAfterEntriesByGlobalRef = getUniqueEntriesByGlobalRef(
    result.afterSnapshot,
  );

  return result.tabRewireDeltas
    .flatMap((delta) => {
      if (delta.before == null || delta.after == null) {
        return [];
      }

      const before =
        delta.kind === 'move' || delta.kind === 'move-and-patch'
          ? resolveUpdateEndpointEntry(
              delta.before,
              result.beforeSnapshot,
              uniqueBeforeEntriesByGlobalRef,
            )
          : delta.before;
      const after =
        delta.kind === 'move' || delta.kind === 'move-and-patch'
          ? resolveUpdateEndpointEntry(
              delta.after,
              result.afterSnapshot,
              uniqueAfterEntriesByGlobalRef,
            )
          : delta.after;

      if (
        ignoredGlobalRefClues.has(before.globalRefClue) ||
        ignoredGlobalRefClues.has(after.globalRefClue)
      ) {
        return [];
      }

      const changed = diffProperties(before, after);

      if (changed.length === 0) {
        return [];
      }

      if (delta.kind === 'patch') {
        return [toUpdateSignature(before.exactKeyClue, after.exactKeyClue, changed)];
      }

      if (
        (delta.kind === 'move' || delta.kind === 'move-and-patch') &&
        groupCountChanged &&
        before.exactKeyClue === after.exactKeyClue
      ) {
        return [toUpdateSignature(before.exactKeyClue, after.exactKeyClue, changed)];
      }

      return [];
    })
    .sort(compareExactKeyClues);
}

function getNoOpPatches(result: { tabRewireDeltas: readonly TabRewireDelta[] }): string[] {
  return result.tabRewireDeltas
    .filter((delta) => delta.kind === 'patch' && delta.before != null && delta.after != null)
    .filter((delta) => getRewirePropertyChanges(delta).length === 0)
    .map((delta) => `${delta.before!.exactKeyClue}->${delta.after!.exactKeyClue}`)
    .sort(compareExactKeyClues);
}

function diffExpectedToActual(
  expected: readonly string[],
  actual: readonly string[],
): { missing: string[]; extra: string[] } {
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);

  return {
    missing: expected.filter((value) => !actualSet.has(value)),
    extra: actual.filter((value) => !expectedSet.has(value)),
  };
}

export function auditAnalyzerScenarioSemantics(
  scenarioName: string,
): ScenarioSemanticAuditFinding {
  const result = runAnalyzerScenario(scenarioName);
  const groupCountChanged =
    result.beforeSnapshot.groups.size !== result.afterSnapshot.groups.size;
  const oracle = createEndpointSemanticOracle(
    result.beforeSnapshot,
    result.afterSnapshot,
  );
  const ignoredGlobalRefClues = new Set(oracle.ambiguousGlobalRefClues);
  const actualCreates = getActualCreates(result, ignoredGlobalRefClues);
  const actualCloses = getActualCloses(result, ignoredGlobalRefClues);
  const actualMoves = getActualMoves(result, ignoredGlobalRefClues);
  const actualUpdates = getActualUpdates(result, ignoredGlobalRefClues);
  const expectedMoveSignatures = oracle.moves
    .map((move) =>
      toMoveSignature(
        move.beforeExactKeyClue,
        move.afterExactKeyClue,
        move.beforeViewColumn,
        move.beforeIndex,
        move.afterViewColumn,
        move.afterIndex,
        move.changed,
        groupCountChanged,
      ),
    )
    .filter((signature): signature is string => signature != null);
  const createDiff = diffExpectedToActual(oracle.creates, actualCreates);
  const closeDiff = diffExpectedToActual(oracle.closes, actualCloses);
  const moveDiff = diffExpectedToActual(expectedMoveSignatures, actualMoves);
  const updateDiff = diffExpectedToActual(
    oracle.updates.map((update) =>
      toUpdateSignature(update.beforeExactKeyClue, update.afterExactKeyClue, update.changed),
    ),
    actualUpdates,
  );
  const noOpPatches = getNoOpPatches(result);

  return {
    scenarioName,
    scenarioCode: getAnalyzerScenarioCode(scenarioName),
    ambiguousGlobalRefClues: oracle.ambiguousGlobalRefClues,
    missingCreates: createDiff.missing,
    extraCreates: createDiff.extra,
    missingCloses: closeDiff.missing,
    extraCloses: closeDiff.extra,
    missingMoves: moveDiff.missing,
    extraMoves: moveDiff.extra,
    missingUpdates: updateDiff.missing,
    extraUpdates: updateDiff.extra,
    noOpPatches,
    suspicious:
      createDiff.missing.length > 0 ||
      createDiff.extra.length > 0 ||
      closeDiff.missing.length > 0 ||
      closeDiff.extra.length > 0 ||
      moveDiff.missing.length > 0 ||
      moveDiff.extra.length > 0 ||
      updateDiff.missing.length > 0 ||
      updateDiff.extra.length > 0 ||
      noOpPatches.length > 0,
  };
}

export function buildAnalyzerSemanticAuditReport(): SemanticAuditReport {
  const findings = listAnalyzerScenarioNames()
    .map((scenarioName) => auditAnalyzerScenarioSemantics(scenarioName))
    .sort(
      (left, right) =>
        compareExactKeyClues(left.scenarioCode, right.scenarioCode) ||
        left.scenarioName.localeCompare(right.scenarioName),
    );
  const suspiciousScenarioCodes = findings
    .filter((finding) => finding.suspicious)
    .map((finding) => finding.scenarioCode);

  return {
    summary: {
      totalScenarios: findings.length,
      suspiciousScenarios: suspiciousScenarioCodes.length,
      cleanScenarios: findings.length - suspiciousScenarioCodes.length,
    },
    suspiciousScenarioCodes,
    findings,
  };
}

function renderIssueBlock(title: string, values: readonly string[]): string[] {
  if (values.length === 0) {
    return [];
  }

  return [`- ${title}:`, ...values.map((value) => `  - ${value}`)];
}

export function renderAnalyzerSemanticAuditMarkdown(
  report: SemanticAuditReport,
): string {
  const lines = [
    '# Tab Change Pipeline Semantic Audit',
    '',
    'This report compares endpoint-derived expectations from analyzer fixture before/after snapshots against the resolver output in `tabRewireDeltas`.',
    '',
    `- Total scenarios: ${report.summary.totalScenarios}`,
    `- Suspicious scenarios: ${report.summary.suspiciousScenarios}`,
    `- Clean scenarios: ${report.summary.cleanScenarios}`,
    '',
  ];

  if (report.suspiciousScenarioCodes.length > 0) {
    lines.push(`- Suspicious scenario codes: ${report.suspiciousScenarioCodes.join(', ')}`);
    lines.push('');
  }

  for (const finding of report.findings.filter((entry) => entry.suspicious)) {
    lines.push(`## ${finding.scenarioCode}: ${finding.scenarioName}`);
    lines.push('');
    lines.push(...renderIssueBlock('Ambiguous global clues', finding.ambiguousGlobalRefClues));
    lines.push(...renderIssueBlock('Missing creates', finding.missingCreates));
    lines.push(...renderIssueBlock('Extra creates', finding.extraCreates));
    lines.push(...renderIssueBlock('Missing closes', finding.missingCloses));
    lines.push(...renderIssueBlock('Extra closes', finding.extraCloses));
    lines.push(...renderIssueBlock('Missing moves', finding.missingMoves));
    lines.push(...renderIssueBlock('Extra moves', finding.extraMoves));
    lines.push(...renderIssueBlock('Missing updates', finding.missingUpdates));
    lines.push(...renderIssueBlock('Extra updates', finding.extraUpdates));
    lines.push(...renderIssueBlock('No-op patches', finding.noOpPatches));
    lines.push('');
  }

  return lines.join('\n');
}