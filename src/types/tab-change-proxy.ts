import {
  Tab,
  TabGroup,
  TabInputCustom,
  TabInputNotebook,
  TabInputNotebookDiff,
  TabInputTerminal,
  TabInputText,
  TabInputTextDiff,
  TabInputWebview,
  ViewColumn
} from 'vscode';

import type { TabChangeBatchCoordinator } from '../handlers/tab-change-batch-coordinator';
import type { TabObserverService } from '../services/tab-observer';
import { TabKind } from './tabs';

export type TabChangeProperty =
  | 'isActive'
  | 'isDirty'
  | 'isPinned'
  | 'isPreview';

export const TAB_CHANGE_PROPERTIES: TabChangeProperty[] = [
  'isActive',
  'isDirty',
  'isPinned',
  'isPreview'
];

/** Diff all trackable properties including position. */
export function diffFull(
  newEntry: TabEntrySnapshot,
  oldEntry: TabEntrySnapshot
): Set<TabChangeProperty | 'viewColumn' | 'index'> {
  const changed = new Set<TabChangeProperty | 'viewColumn' | 'index'>();
  for (const prop of TAB_CHANGE_PROPERTIES) {
    if (newEntry[prop] !== oldEntry[prop]) changed.add(prop);
  }
  if (newEntry.viewColumn !== oldEntry.viewColumn) changed.add('viewColumn');
  if (newEntry.index !== oldEntry.index) changed.add('index');
  return changed;
}

/** Diff only user-facing properties (not position). */
export function diffProperties(
  newEntry: TabEntrySnapshot,
  oldEntry: TabEntrySnapshot
): Set<TabChangeProperty> {
  const changed = new Set<TabChangeProperty>();
  for (const prop of TAB_CHANGE_PROPERTIES) {
    if (newEntry[prop] !== oldEntry[prop]) changed.add(prop);
  }
  return changed;
}

export type TabClueKind =
  | 'exact-key'
  | 'local-ref'
  | 'global-ref'
  | 'group-fingerprint';

export type RuntimeEvidenceKind = 'tab-ref';

export type ClueConfidence = 'highest' | 'high' | 'medium' | 'low';

export type ClueGate =
  | 'exact-continuity'
  | 'within-group-move'
  | 'cross-group-move'
  | 'group-structure'
  | 'property-patch';

export type ResolvedTabDeltaKind =
  | 'create'
  | 'close'
  | 'move'
  | 'patch'
  | 'move-and-patch'
  | 'ambiguous';

export type ResolvedGroupDeltaKind = 'open' | 'close' | 'move' | 'activate';

export type RewirePriority = 'high' | 'low';

export interface ClueSnapshot {
  exactKeyClue: string | null;
  localRefClue: string | null;
  globalRefClue: string | null;
  groupFingerprintClue: string | null;
}

export interface ResolutionClue {
  kind: TabClueKind | RuntimeEvidenceKind;
  confidence: ClueConfidence;
  gate: ClueGate;
  value: string;
  accepted: boolean;
  uniqueWithinBucket: boolean;
  notes: string[];
}

export interface ResolutionEvidence {
  clues: ResolutionClue[];
}

export interface ClueLifecycleHop {
  seq: number;
  gate: ClueGate;
  acceptedClues: ResolutionClue[];
  before: ClueSnapshot;
  after: ClueSnapshot;
  notes: string[];
}

export interface ExactKeyClueLifecycle {
  entryExactKeyClue: string | null;
  endExactKeyClue: string | null;
  hops: ClueLifecycleHop[];
  continuityProven: boolean;
}

export interface GroupFingerprintLifecycleHop {
  seq: number;
  beforeFingerprint: string | null;
  afterFingerprint: string | null;
  beforeViewColumn: number | null;
  afterViewColumn: number | null;
  notes: string[];
}

export interface GroupFingerprintLifecycle {
  entryFingerprint: string | null;
  endFingerprint: string | null;
  hops: GroupFingerprintLifecycleHop[];
  continuityProven: boolean;
}

export type StateTransferDisposition =
  | 'fresh'
  | 'carry'
  | 'release'
  | 'blocked';

export interface StateTransferDecision {
  disposition: StateTransferDisposition;
  transferMetadata: boolean;
  transferInstanceBindings: boolean;
  releaseDetachedBindings: boolean;
  reason: string;
}

export interface TabStructuralDelta {
  fromViewColumn: number | null;
  toViewColumn: number | null;
  fromIndex: number | null;
  toIndex: number | null;
}

export interface TabPropertyDelta {
  isActive?: { before: boolean; after: boolean };
  isDirty?: { before: boolean; after: boolean };
  isPinned?: { before: boolean; after: boolean };
  isPreview?: { before: boolean; after: boolean };
}

export interface TabEntrySnapshot {
  tab: Tab;
  /** Exact addressing clue for current snapshot position. */
  exactKeyClue: string;
  /** Same-group clue that drops index but retains the current group. */
  localRefClue: string;
  /** Cross-group clue used only as coarse matching evidence. */
  globalRefClue: string;
  /** Group fingerprint captured at the same snapshot boundary as this tab entry. */
  groupFingerprintClue: string;
  viewColumn: number;
  index: number;
  isActive: boolean;
  isDirty: boolean;
  isPinned: boolean;
  isPreview: boolean;
}

export interface GroupEntrySnapshot {
  group: TabGroup;
  viewColumn: number;
  /** First-class structural clue for group reconciliation. */
  fingerprintClue: string;
  fingerprint: string;
  isActive: boolean;
}

export interface WindowSnapshot {
  tabs: Map<string, TabEntrySnapshot>;
  groups: Map<number, GroupEntrySnapshot>;
}

export interface VersionedWindowSnapshot extends WindowSnapshot {
  version: number;
}

export interface TabChangeEventPayload {
  opened: readonly Tab[];
  closed: readonly Tab[];
  changed: readonly Tab[];
  moved?: readonly Tab[];
}

export interface GroupChangeEventPayload {
  opened: readonly TabGroup[];
  closed: readonly TabGroup[];
  changed: readonly TabGroup[];
}

export type TabOp =
  | { type: 'add'; entry: TabEntrySnapshot }
  | { type: 'remove'; entry: TabEntrySnapshot; oldEntry?: TabEntrySnapshot }
  | {
      type: 'update';
      entry: TabEntrySnapshot;
      oldEntry: TabEntrySnapshot;
      changed: Set<TabChangeProperty | 'viewColumn' | 'index'>;
    };

export type AddOp = Extract<TabOp, { type: 'add' }>;
export type RemoveOp = Extract<TabOp, { type: 'remove' }>;
export type UpdateOp = Extract<TabOp, { type: 'update' }>;

export interface MoveHop {
  addOp: AddOp;
  removeOp: RemoveOp;
}

export interface MoveClassificationResult {
  matchedAdds: Set<AddOp>;
  matchedRemoves: Set<RemoveOp>;
  unmatchedAdds: AddOp[];
  unmatchedRemoves: RemoveOp[];
  movedTabRefs: Set<Tab>;
  movedSourceTabRefs: Set<Tab>;
  bouncedTabs: Set<Tab>;
  moved: TabMoved[];
  /** Closed tabs detected during chain collapse. */
  chainClosed: TabEntrySnapshot[];
  /** Updates from bounced-tab property changes. */
  bouncedUpdates: TabUpdated[];
  /** Update ops consumed as implicit cross-group moves. */
  implicitMoveUpdates: Set<UpdateOp>;
  /** Update ops consumed as within-group reorder moves. */
  withinGroupMoveUpdates: Set<UpdateOp>;
  ambiguousCandidateGroups: AmbiguousCandidateGroup[];
}

export interface AmbiguousCandidateGroup {
  globalRefClue: string;
  beforeEntries: TabEntrySnapshot[];
  afterEntries: TabEntrySnapshot[];
}

export interface TabChangeComputationCacheApi {
  reset(): void;
  diffFull(
    newEntry: TabEntrySnapshot,
    oldEntry: TabEntrySnapshot
  ): Set<TabChangeProperty | 'viewColumn' | 'index'>;
  diffProperties(
    newEntry: TabEntrySnapshot,
    oldEntry: TabEntrySnapshot
  ): Set<TabChangeProperty>;
  indexByViewColumn(
    byRef: Map<Tab, TabEntrySnapshot>
  ): Map<number, Map<Tab, TabEntrySnapshot>>;
  groupFingerprintCluesByViewColumn(
    byRef: Map<Tab, TabEntrySnapshot>
  ): Map<number, string>;
  viewColumnsByGroupFingerprintClue(
    byRef: Map<Tab, TabEntrySnapshot>
  ): Map<string, readonly number[]>;
  entriesByViewColumnAndGlobalRef(
    byRef: Map<Tab, TabEntrySnapshot>
  ): Map<string, TabEntrySnapshot>;
}

export interface GeneratorContext {
  readonly snapshot: Map<Tab, TabEntrySnapshot>;
  readonly freshByRef: Map<Tab, TabEntrySnapshot>;
  readonly groupEvent: GroupChangeEventPayload;
  readonly computationCache: TabChangeComputationCacheApi;
  /** Snapshot entries indexed by viewColumn for O(1) group-scoped iteration. */
  readonly snapshotByVC: Map<number, Map<Tab, TabEntrySnapshot>>;
  /** Fresh entries indexed by viewColumn for O(1) group-scoped iteration. */
  readonly freshByVC: Map<number, Map<Tab, TabEntrySnapshot>>;
  opened: Tab[];
  closed: Tab[];
  changed: Tab[];
  moved: Tab[];
  processed: Set<Tab>;
  closedViewColumns: Set<number>;
  openedViewColumns: Set<number>;
}

export interface TabMoved {
  tab: Tab;
  oldEntry: TabEntrySnapshot;
  entry: TabEntrySnapshot;
  fromViewColumn: ViewColumn;
  toViewColumn: ViewColumn;
  fromIndex: number;
  toIndex: number;
  changed: Set<TabChangeProperty>;
}

export interface TabUpdated {
  tab: Tab;
  oldEntry: TabEntrySnapshot;
  entry: TabEntrySnapshot;
  changed: Set<TabChangeProperty | 'index'>;
}

export interface ResolvedTabDelta {
  kind: ResolvedTabDeltaKind;
  tabKind: TabKind;
  globalRefClue: string | null;
  before: TabEntrySnapshot | null;
  after: TabEntrySnapshot | null;
  structural: TabStructuralDelta;
  properties: TabPropertyDelta;
  carryTrackedState: boolean;
  stateTransfer: StateTransferDecision;
  exactKeyClueLifecycle: ExactKeyClueLifecycle;
  evidence: ResolutionEvidence;
}

export interface ResolvedGroupDelta {
  kind: ResolvedGroupDeltaKind;
  beforeViewColumn: number | null;
  afterViewColumn: number | null;
  beforeFingerprint: string | null;
  afterFingerprint: string | null;
  fingerprintLifecycle: GroupFingerprintLifecycle;
}

export interface ResolverTrace {
  source: ResolvedTabChangeEventSource;
  bucketId: number;
  beforeSnapshot: WindowSnapshot;
  afterSnapshot: WindowSnapshot;
  tabDeltas: ResolvedTabDelta[];
  groupDeltas: ResolvedGroupDelta[];
  diagnostics: string[];
}

export interface ResolverAmbiguityRecord {
  identityKey: string;
  reason: string;
  notes: string[];
}

export interface ResolverGatekeepingState {
  gate: ClueGate;
  acceptedClues: ResolutionClue[];
  rejectedClues: ResolutionClue[];
  notes: string[];
}

export interface ResolverExclusivityClaims {
  entryExactKeyClues: Set<string>;
  endExactKeyClues: Set<string>;
  lifecycleHops: Set<string>;
  stateDonors: Set<string>;
}

export interface ResolverLedgerState {
  acceptedClueMatches: Map<string, ResolutionClue[]>;
  rejectedClueCandidates: Map<string, ResolutionClue[]>;
  ambiguities: ResolverAmbiguityRecord[];
  gatekeeping: Map<string, ResolverGatekeepingState>;
  exactKeyClueLifecycles: Map<string, ExactKeyClueLifecycle>;
  groupFingerprintLifecycles: Map<string, GroupFingerprintLifecycle>;
  exclusivityClaims: ResolverExclusivityClaims;
  stateTransfers: Map<string, StateTransferDecision>;
}

export interface TabRewireDelta {
  kind: ResolvedTabDeltaKind;
  tabKind: TabKind;
  rewirePriority: RewirePriority;
  entryExactKeyClue: string | null;
  endExactKeyClue: string | null;
  before: TabEntrySnapshot | null;
  after: TabEntrySnapshot | null;
  structural: TabStructuralDelta;
  properties: TabPropertyDelta;
  stateTransfer: StateTransferDecision;
}

export interface ResolvedBucketDelta {
  /**
   * `snapshot` represents baseline reconciliation against the latest full window
   * snapshot. It is not sequential event replay and should only carry state on
   * one-to-one exact continuity.
   */
  source: ResolvedTabChangeEventSource;
  bucketId: number;
  beforeSnapshot: WindowSnapshot;
  afterSnapshot: WindowSnapshot;
  tabRewireDeltas: TabRewireDelta[];
}

/**
 * `snapshot` represents baseline reconciliation against a full observer snapshot,
 * not a replay of sequential tab or group events.
 */
export type ResolvedTabChangeEventSource = 'delta' | 'snapshot';

export interface ResolvedTabChangeEvent {
  source: ResolvedTabChangeEventSource;
  bucketId: number;
  tabRewireDeltas: readonly TabRewireDelta[];
  resolvedBucketDelta: ResolvedBucketDelta;
  /** @deprecated Prefer tabRewireDeltas during migration. */
  created: readonly Tab[];
  /** @deprecated Prefer tabRewireDeltas during migration. */
  closed: readonly Tab[];
  /** @deprecated Prefer tabRewireDeltas during migration. */
  moved: readonly TabMoved[];
  /** @deprecated Prefer tabRewireDeltas during migration. */
  updated: readonly TabUpdated[];
  createdEntries: ReadonlyMap<Tab, TabEntrySnapshot>;
  closedEntries: ReadonlyMap<Tab, TabEntrySnapshot>;
  beforeSnapshot: WindowSnapshot;
  afterSnapshot: WindowSnapshot;
}

export interface ResolveEventOptions {
  source?: ResolvedTabChangeEventSource;
  bucketId?: number;
  beforeSnapshot?: WindowSnapshot;
  afterSnapshot?: WindowSnapshot;
}

type LegacyResolvedEventProjection = Pick<
  ResolvedTabChangeEvent,
  | 'source'
  | 'created'
  | 'closed'
  | 'moved'
  | 'updated'
  | 'createdEntries'
  | 'closedEntries'
>;

export interface SnapshotResolvedEventProjection {
  created: readonly Tab[];
  closed: readonly Tab[];
  updated: readonly TabUpdated[];
  createdEntries: ReadonlyMap<Tab, TabEntrySnapshot>;
  closedEntries: ReadonlyMap<Tab, TabEntrySnapshot>;
  tabRewireDeltas: readonly TabRewireDelta[];
}

export function getSnapshotTabKind(entry: TabEntrySnapshot | null): TabKind {
  if (!entry) {
    return TabKind.Unknown;
  }

  const { tab } = entry;

  if (tab.input instanceof TabInputText) {
    return TabKind.TabInputText;
  }
  if (tab.input instanceof TabInputTextDiff) {
    return TabKind.TabInputTextDiff;
  }
  if (tab.input instanceof TabInputCustom) {
    return TabKind.TabInputCustom;
  }
  if (tab.input instanceof TabInputWebview) {
    return TabKind.TabInputWebview;
  }
  if (tab.input instanceof TabInputNotebook) {
    return TabKind.TabInputNotebook;
  }
  if (tab.input instanceof TabInputNotebookDiff) {
    return TabKind.TabInputNotebookDiff;
  }
  if (tab.input instanceof TabInputTerminal) {
    return TabKind.TabInputTerminal;
  }

  return TabKind.Unknown;
}

export function getRewirePriority(tabKind: TabKind): RewirePriority {
  switch (tabKind) {
    case TabKind.TabInputText:
    case TabKind.TabInputTextDiff:
    case TabKind.TabInputNotebook:
    case TabKind.TabInputNotebookDiff:
    case TabKind.TabInputTerminal:
      return 'high';
    default:
      return 'low';
  }
}

export function createStateTransferDecision(
  disposition: StateTransferDisposition,
  reason: string
): StateTransferDecision {
  return {
    disposition,
    transferMetadata: disposition === 'carry',
    transferInstanceBindings: disposition === 'carry',
    releaseDetachedBindings: disposition === 'release',
    reason
  };
}

export function createExactKeyClueLifecycle(
  entryExactKeyClue: string | null,
  endExactKeyClue: string | null,
  continuityProven = false,
  hops: ClueLifecycleHop[] = []
): ExactKeyClueLifecycle {
  return {
    entryExactKeyClue,
    endExactKeyClue,
    hops,
    continuityProven
  };
}

export function createGroupFingerprintLifecycle(
  entryFingerprint: string | null,
  endFingerprint: string | null,
  continuityProven = false,
  hops: GroupFingerprintLifecycleHop[] = []
): GroupFingerprintLifecycle {
  return {
    entryFingerprint,
    endFingerprint,
    hops,
    continuityProven
  };
}

export function createResolutionEvidence(
  clues: ResolutionClue[] = []
): ResolutionEvidence {
  return { clues };
}

export function createTabStructuralDelta(
  before: TabEntrySnapshot | null,
  after: TabEntrySnapshot | null
): TabStructuralDelta {
  return {
    fromViewColumn: before?.viewColumn ?? null,
    toViewColumn: after?.viewColumn ?? null,
    fromIndex: before?.index ?? null,
    toIndex: after?.index ?? null
  };
}

export function createTabPropertyDelta(
  before: TabEntrySnapshot | null,
  after: TabEntrySnapshot | null
): TabPropertyDelta {
  const properties: TabPropertyDelta = {};

  if (!before || !after) {
    return properties;
  }

  if (before.isActive !== after.isActive) {
    properties.isActive = { before: before.isActive, after: after.isActive };
  }
  if (before.isDirty !== after.isDirty) {
    properties.isDirty = { before: before.isDirty, after: after.isDirty };
  }
  if (before.isPinned !== after.isPinned) {
    properties.isPinned = { before: before.isPinned, after: after.isPinned };
  }
  if (before.isPreview !== after.isPreview) {
    properties.isPreview = { before: before.isPreview, after: after.isPreview };
  }

  return properties;
}

export function createResolvedBucketDelta(
  source: ResolvedTabChangeEventSource,
  bucketId: number,
  beforeSnapshot: WindowSnapshot,
  afterSnapshot: WindowSnapshot,
  tabRewireDeltas: TabRewireDelta[] = []
): ResolvedBucketDelta {
  return {
    source,
    bucketId,
    beforeSnapshot,
    afterSnapshot,
    tabRewireDeltas
  };
}

export function createEmptyResolverLedgerState(): ResolverLedgerState {
  return {
    acceptedClueMatches: new Map(),
    rejectedClueCandidates: new Map(),
    ambiguities: [],
    gatekeeping: new Map(),
    exactKeyClueLifecycles: new Map(),
    groupFingerprintLifecycles: new Map(),
    exclusivityClaims: {
      entryExactKeyClues: new Set(),
      endExactKeyClues: new Set(),
      lifecycleHops: new Set(),
      stateDonors: new Set()
    },
    stateTransfers: new Map()
  };
}

function hasTabStructuralDelta(structural: TabStructuralDelta): boolean {
  return (
    structural.fromViewColumn !== structural.toViewColumn ||
    structural.fromIndex !== structural.toIndex
  );
}

function hasTabPropertyDelta(properties: TabPropertyDelta): boolean {
  return Object.keys(properties).length > 0;
}

function resolveProjectedTabDeltaKind(
  preferredKind: ResolvedTabDeltaKind,
  structural: TabStructuralDelta,
  properties: TabPropertyDelta
): ResolvedTabDeltaKind {
  if (
    preferredKind === 'create' ||
    preferredKind === 'close' ||
    preferredKind === 'ambiguous'
  ) {
    return preferredKind;
  }

  const structuralChanged = hasTabStructuralDelta(structural);
  const propertiesChanged = hasTabPropertyDelta(properties);

  if (structuralChanged && propertiesChanged) {
    return 'move-and-patch';
  }
  if (structuralChanged) {
    return 'move';
  }
  if (propertiesChanged) {
    return 'patch';
  }

  return preferredKind;
}

export function createResolvedTabDelta(
  preferredKind: ResolvedTabDeltaKind,
  before: TabEntrySnapshot | null,
  after: TabEntrySnapshot | null,
  stateTransfer: StateTransferDecision,
  evidence: ResolutionEvidence = createResolutionEvidence(),
  exactKeyClueLifecycle = createExactKeyClueLifecycle(
    before?.exactKeyClue ?? null,
    after?.exactKeyClue ?? null,
    stateTransfer.disposition === 'carry'
  )
): ResolvedTabDelta {
  const structural = createTabStructuralDelta(before, after);
  const properties = createTabPropertyDelta(before, after);
  const tabKind = getSnapshotTabKind(after ?? before);

  return {
    kind: resolveProjectedTabDeltaKind(preferredKind, structural, properties),
    tabKind,
    globalRefClue: after?.globalRefClue ?? before?.globalRefClue ?? null,
    before,
    after,
    structural,
    properties,
    carryTrackedState: stateTransfer.disposition === 'carry',
    stateTransfer,
    exactKeyClueLifecycle,
    evidence
  };
}

export function projectResolvedTabDeltaToTabRewireDelta(
  delta: ResolvedTabDelta
): TabRewireDelta {
  return {
    kind: delta.kind,
    tabKind: delta.tabKind,
    rewirePriority: getRewirePriority(delta.tabKind),
    entryExactKeyClue: delta.exactKeyClueLifecycle.entryExactKeyClue,
    endExactKeyClue: delta.exactKeyClueLifecycle.endExactKeyClue,
    before: delta.before,
    after: delta.after,
    structural: delta.structural,
    properties: delta.properties,
    stateTransfer: delta.stateTransfer
  };
}

export function createResolvedBucketDeltaFromTabDeltas(
  source: ResolvedTabChangeEventSource,
  bucketId: number,
  beforeSnapshot: WindowSnapshot,
  afterSnapshot: WindowSnapshot,
  tabDeltas: ResolvedTabDelta[] = []
): ResolvedBucketDelta {
  return createResolvedBucketDelta(
    source,
    bucketId,
    beforeSnapshot,
    afterSnapshot,
    tabDeltas.map((delta) => projectResolvedTabDeltaToTabRewireDelta(delta))
  );
}

export function createResolverTrace(
  source: ResolvedTabChangeEventSource,
  bucketId: number,
  beforeSnapshot: WindowSnapshot,
  afterSnapshot: WindowSnapshot,
  tabDeltas: ResolvedTabDelta[] = [],
  groupDeltas: ResolvedGroupDelta[] = [],
  diagnostics: string[] = []
): ResolverTrace {
  return {
    source,
    bucketId,
    beforeSnapshot,
    afterSnapshot,
    tabDeltas,
    groupDeltas,
    diagnostics
  };
}

function createProjectedTabRewireDelta(
  preferredKind: ResolvedTabDeltaKind,
  before: TabEntrySnapshot | null,
  after: TabEntrySnapshot | null,
  stateTransfer: StateTransferDecision
): TabRewireDelta {
  return projectResolvedTabDeltaToTabRewireDelta(
    createResolvedTabDelta(preferredKind, before, after, stateTransfer)
  );
}

function compareSnapshotEntriesByAddress(
  left: TabEntrySnapshot,
  right: TabEntrySnapshot
): number {
  return (
    left.viewColumn - right.viewColumn ||
    left.index - right.index ||
    left.exactKeyClue.localeCompare(right.exactKeyClue)
  );
}

export function projectSnapshotBaselineToResolvedEvent(
  beforeSnapshot: WindowSnapshot,
  afterSnapshot: WindowSnapshot
): SnapshotResolvedEventProjection {
  const createdEntries = new Map<Tab, TabEntrySnapshot>();
  const closedEntries = new Map<Tab, TabEntrySnapshot>();
  const updated: TabUpdated[] = [];
  const tabRewireDeltas: TabRewireDelta[] = [];
  const beforeEntriesByExactKey = new Map<string, TabEntrySnapshot>(
    [...beforeSnapshot.tabs.values()].map((entry) => [
      entry.exactKeyClue,
      entry
    ])
  );
  const afterEntriesByExactKey = new Map<string, TabEntrySnapshot>(
    [...afterSnapshot.tabs.values()].map((entry) => [entry.exactKeyClue, entry])
  );
  const closed = [...beforeSnapshot.tabs.values()]
    .filter((entry) => !afterEntriesByExactKey.has(entry.exactKeyClue))
    .sort(compareSnapshotEntriesByAddress);
  const created = [...afterSnapshot.tabs.values()]
    .filter((entry) => !beforeEntriesByExactKey.has(entry.exactKeyClue))
    .sort(compareSnapshotEntriesByAddress);
  const exactContinuityPairs = [...afterSnapshot.tabs.values()]
    .map((afterEntry) => ({
      beforeEntry: beforeEntriesByExactKey.get(afterEntry.exactKeyClue) ?? null,
      afterEntry
    }))
    .filter(
      (
        pair
      ): pair is {
        beforeEntry: TabEntrySnapshot;
        afterEntry: TabEntrySnapshot;
      } => pair.beforeEntry != null
    )
    .sort((left, right) =>
      compareSnapshotEntriesByAddress(left.afterEntry, right.afterEntry)
    );

  for (const entry of closed) {
    closedEntries.set(entry.tab, entry);
    tabRewireDeltas.push(
      createProjectedTabRewireDelta(
        'close',
        entry,
        null,
        createStateTransferDecision(
          'release',
          'Snapshot baseline no longer contains the entry exact clue.'
        )
      )
    );
  }

  for (const { beforeEntry, afterEntry } of exactContinuityPairs) {
    const changedProperties = diffProperties(afterEntry, beforeEntry);

    if (changedProperties.size === 0) {
      continue;
    }

    updated.push({
      tab: afterEntry.tab,
      oldEntry: beforeEntry,
      entry: afterEntry,
      changed: changedProperties
    });
    tabRewireDeltas.push(
      createProjectedTabRewireDelta(
        'patch',
        beforeEntry,
        afterEntry,
        createStateTransferDecision(
          'carry',
          'Snapshot baseline preserved exact one-to-one continuity.'
        )
      )
    );
  }

  for (const entry of created) {
    createdEntries.set(entry.tab, entry);
    tabRewireDeltas.push(
      createProjectedTabRewireDelta(
        'create',
        null,
        entry,
        createStateTransferDecision(
          'fresh',
          'Snapshot baseline could not prove prior exact continuity.'
        )
      )
    );
  }

  return {
    created: [...createdEntries.keys()],
    closed: [...closedEntries.keys()],
    updated,
    createdEntries,
    closedEntries,
    tabRewireDeltas
  };
}

export function projectLegacyEventToTabRewireDeltas(
  event: LegacyResolvedEventProjection
): TabRewireDelta[] {
  const tabRewireDeltas: TabRewireDelta[] = [];

  for (const tab of event.created) {
    const after = event.createdEntries.get(tab) ?? null;

    if (!after) {
      continue;
    }

    tabRewireDeltas.push(
      createProjectedTabRewireDelta(
        'create',
        null,
        after,
        createStateTransferDecision(
          'fresh',
          'Legacy created event projected into rewiring delta.'
        )
      )
    );
  }

  for (const tab of event.closed) {
    const before = event.closedEntries.get(tab) ?? null;

    if (!before) {
      continue;
    }

    tabRewireDeltas.push(
      createProjectedTabRewireDelta(
        'close',
        before,
        null,
        createStateTransferDecision(
          'release',
          'Legacy closed event projected into rewiring delta.'
        )
      )
    );
  }

  for (const move of event.moved) {
    tabRewireDeltas.push(
      createProjectedTabRewireDelta(
        'move',
        move.oldEntry,
        move.entry,
        createStateTransferDecision(
          'carry',
          'Legacy moved event projected into rewiring delta.'
        )
      )
    );
  }

  for (const update of event.updated) {
    tabRewireDeltas.push(
      createProjectedTabRewireDelta(
        'patch',
        update.oldEntry,
        update.entry,
        createStateTransferDecision(
          'carry',
          'Legacy updated event projected into rewiring delta.'
        )
      )
    );
  }

  return tabRewireDeltas;
}

export function projectLegacyEventToResolvedBucketDelta(
  event: LegacyResolvedEventProjection,
  bucketId: number,
  beforeSnapshot: WindowSnapshot,
  afterSnapshot: WindowSnapshot
): ResolvedBucketDelta {
  const tabRewireDeltas = projectLegacyEventToTabRewireDeltas(event);

  return createResolvedBucketDelta(
    event.source,
    bucketId,
    beforeSnapshot,
    afterSnapshot,
    tabRewireDeltas
  );
}

export function createEmptyResolvedTabChangeEvent(
  source: ResolvedTabChangeEventSource = 'delta'
): ResolvedTabChangeEvent {
  const beforeSnapshot: WindowSnapshot = {
    tabs: new Map(),
    groups: new Map()
  };
  const afterSnapshot: WindowSnapshot = {
    tabs: new Map(),
    groups: new Map()
  };
  const bucketId = 0;
  const tabRewireDeltas: TabRewireDelta[] = [];
  const resolvedBucketDelta = createResolvedBucketDelta(
    source,
    bucketId,
    beforeSnapshot,
    afterSnapshot,
    tabRewireDeltas
  );

  return {
    source,
    bucketId,
    tabRewireDeltas,
    resolvedBucketDelta,
    created: [],
    closed: [],
    moved: [],
    updated: [],
    createdEntries: new Map(),
    closedEntries: new Map(),
    beforeSnapshot,
    afterSnapshot
  };
}

export interface TabBufferContext {
  observer: TabChangeBatchCoordinator;
  tabObserverService: TabObserverService;
}

export interface ObservedTabEvent {
  type: 'tab';
  event: TabChangeEventPayload;
  observedAtMs: number;
  beforeSnapshot: VersionedWindowSnapshot;
  afterSnapshot: VersionedWindowSnapshot;
}

export interface ObservedGroupEvent {
  type: 'group';
  event: GroupChangeEventPayload;
  observedAtMs: number;
  beforeSnapshot: VersionedWindowSnapshot;
  afterSnapshot: VersionedWindowSnapshot;
}

export type ObservedWindowEvent = ObservedTabEvent | ObservedGroupEvent;

export type RecordedObservedEvent = ObservedWindowEvent & {
  seq: number;
};

export interface CompressedObservedEvent {
  type: 'tab' | 'group';
  event: TabChangeEventPayload | GroupChangeEventPayload;
  beforeSnapshot: VersionedWindowSnapshot;
  afterSnapshot: VersionedWindowSnapshot;
}

export interface ObservedBucket {
  id: number;
  observedFromMs: number;
  observedToMs: number;
  beforeSnapshot: VersionedWindowSnapshot;
  afterSnapshot: VersionedWindowSnapshot;
  events: CompressedObservedEvent[];
}

export type TabBufferEvent =
  | { type: 'RAW_TAB_EVENT'; observed: ObservedTabEvent }
  | { type: 'RAW_GROUP_EVENT'; observed: ObservedGroupEvent }
  | { type: 'MUTE' }
  | { type: 'UNMUTE' };

export type TabBufferEmitted = {
  type: 'resolved';
  event: ResolvedTabChangeEvent;
};
