import { Tab } from 'vscode';

import {
  AddOp,
  createEmptyResolverLedgerState,
  ExactKeyClueLifecycle,
  GroupFingerprintLifecycle,
  MoveHop,
  ObservedBucket,
  RemoveOp,
  ResolutionClue,
  ResolverAmbiguityRecord,
  ResolverGatekeepingState,
  ResolverLedgerState,
  ResolverTrace,
  StateTransferDecision,
  TabEntrySnapshot,
  TabOp,
  WindowSnapshot
} from '../types/tab-change-proxy';
import { TabChangeComputationCache } from './tab-change-computation-cache';

/**
 * Owns mutable batch state for the tab change pipeline.
 *
 * Holds the current snapshot, batch-start snapshot, group active-state map,
 * staged ops, and pre-matched move chains. Created fresh per resolve cycle
 * and shared among the pipeline collaborators.
 */
export class TabChangeSession {
  readonly computationCache = new TabChangeComputationCache();

  /** Current window state, keyed by Tab reference for O(1) lookup. */
  snapshot: Map<Tab, TabEntrySnapshot>;
  /** Bucket currently being resolved, if the resolver is processing one. */
  currentBucket: ObservedBucket | null = null;
  /** Snapshot captured at the start of the current batch (first processEvent). */
  batchStartSnapshot: Map<Tab, TabEntrySnapshot> | null = null;
  /** Accumulated raw ops within the current batch (between reset() calls). */
  ops: TabOp[] = [];
  /** Tracks which update ops came from implicit reconciliation (not from event hints). */
  implicitOps = new WeakSet<TabOp>();
  /** Tracks update ops derived from passive neighbor index shifts (Stage 2). */
  derivedShiftOps = new WeakSet<TabOp>();
  /** Pre-matched move chains from generator Stage 5, keyed by Tab ref. */
  preMatchedMoveChains = new Map<Tab, MoveHop[]>();
  /** Group active state, keyed by viewColumn, for detecting VC focus changes. */
  groupActiveState = new Map<number, boolean>();
  /** Internal resolver bookkeeping for clue, lifecycle, ambiguity, and transfer state. */
  ledger: ResolverLedgerState = createEmptyResolverLedgerState();
  /** Most recent internal resolver trace for diagnostics. */
  lastResolverTrace: ResolverTrace | null = null;

  constructor(snapshot: Map<Tab, TabEntrySnapshot>) {
    this.snapshot = snapshot;
  }

  /**
   * Full refresh — reset everything including snapshot and group active state.
   * Used when the observer service replays from a fresh baseline.
   */
  refreshFrom(windowSnapshot: WindowSnapshot): void {
    this.snapshot = TabChangeSession.createSnapshotByRef(windowSnapshot);
    this.currentBucket = null;
    this.ops = [];
    this.batchStartSnapshot = null;
    this.implicitOps = new WeakSet();
    this.derivedShiftOps = new WeakSet();
    this.preMatchedMoveChains = new Map();
    this.ledger = createEmptyResolverLedgerState();
    this.groupActiveState = new Map(
      [...windowSnapshot.groups.entries()].map(([vc, g]) => [vc, g.isActive])
    );
    this.computationCache.reset();
  }

  /**
   * Seed for a new batch — resets batch-local state but keeps the snapshot
   * as the new baseline and records a batch-start copy.
   */
  seedFrom(windowSnapshot: WindowSnapshot): void {
    this.snapshot = TabChangeSession.createSnapshotByRef(windowSnapshot);
    this.currentBucket = null;
    this.ops = [];
    this.batchStartSnapshot = new Map(this.snapshot);
    this.implicitOps = new WeakSet();
    this.derivedShiftOps = new WeakSet();
    this.preMatchedMoveChains = new Map();
    this.ledger = createEmptyResolverLedgerState();
    this.groupActiveState = new Map(
      [...windowSnapshot.groups.entries()].map(([vc, g]) => [vc, g.isActive])
    );
    this.computationCache.reset();
  }

  /**
   * Reset batch-local state between resolve cycles.
   * Note: snapshot and groupActiveState carry forward across batches.
   */
  resetBatch(): void {
    this.currentBucket = null;
    this.ops = [];
    this.batchStartSnapshot = null;
    this.implicitOps = new WeakSet();
    this.derivedShiftOps = new WeakSet();
    this.preMatchedMoveChains = new Map();
    this.ledger = createEmptyResolverLedgerState();
    this.computationCache.reset();
  }

  beginBucket(bucket: ObservedBucket): void {
    this.currentBucket = bucket;
    this.ledger = createEmptyResolverLedgerState();
    this.computationCache.reset();
  }

  /** Ensure batchStartSnapshot is set on first event in a batch. */
  ensureBatchStart(): void {
    if (!this.batchStartSnapshot) {
      this.batchStartSnapshot = new Map(this.snapshot);
    }
  }

  /** Append an op and optionally track it as implicit. */
  pushOp(op: TabOp, implicit = false): void {
    this.ops.push(op);
    if (implicit) {
      this.implicitOps.add(op);
    }
  }

  /** Append an op and track it as a derived index shift. */
  pushDerivedShiftOp(op: TabOp): void {
    this.ops.push(op);
    this.derivedShiftOps.add(op);
  }

  /** Append a pre-matched move chain hop for a tab. */
  appendMoveChainHop(tab: Tab, addOp: AddOp, removeOp: RemoveOp): void {
    const chain = this.preMatchedMoveChains.get(tab) ?? [];
    chain.push({ addOp, removeOp });
    this.preMatchedMoveChains.set(tab, chain);
  }

  /** Update group active state from a fresh snapshot. */
  updateGroupActiveState(windowSnapshot: WindowSnapshot): void {
    this.groupActiveState = new Map(
      [...windowSnapshot.groups.entries()].map(([vc, g]) => [vc, g.isActive])
    );
  }

  recordAcceptedClueMatch(identityKey: string, clue: ResolutionClue): void {
    const matches = this.ledger.acceptedClueMatches.get(identityKey) ?? [];

    matches.push(clue);
    this.ledger.acceptedClueMatches.set(identityKey, matches);
  }

  recordRejectedClueCandidate(identityKey: string, clue: ResolutionClue): void {
    const candidates =
      this.ledger.rejectedClueCandidates.get(identityKey) ?? [];

    candidates.push(clue);
    this.ledger.rejectedClueCandidates.set(identityKey, candidates);
  }

  recordAmbiguity(ambiguity: ResolverAmbiguityRecord): void {
    this.ledger.ambiguities.push(ambiguity);
  }

  recordGatekeepingState(
    identityKey: string,
    gatekeepingState: ResolverGatekeepingState
  ): void {
    this.ledger.gatekeeping.set(identityKey, gatekeepingState);
  }

  recordExactKeyLifecycle(
    identityKey: string,
    lifecycle: ExactKeyClueLifecycle
  ): void {
    this.ledger.exactKeyClueLifecycles.set(identityKey, lifecycle);
  }

  recordGroupFingerprintLifecycle(
    identityKey: string,
    lifecycle: GroupFingerprintLifecycle
  ): void {
    this.ledger.groupFingerprintLifecycles.set(identityKey, lifecycle);
  }

  claimEntryExactKeyClue(exactKeyClue: string | null): void {
    if (exactKeyClue) {
      this.ledger.exclusivityClaims.entryExactKeyClues.add(exactKeyClue);
    }
  }

  claimEndExactKeyClue(exactKeyClue: string | null): void {
    if (exactKeyClue) {
      this.ledger.exclusivityClaims.endExactKeyClues.add(exactKeyClue);
    }
  }

  claimLifecycleHop(hopKey: string): void {
    this.ledger.exclusivityClaims.lifecycleHops.add(hopKey);
  }

  claimStateDonor(stateDonorKey: string | null): void {
    if (stateDonorKey) {
      this.ledger.exclusivityClaims.stateDonors.add(stateDonorKey);
    }
  }

  recordStateTransfer(
    identityKey: string,
    stateTransfer: StateTransferDecision
  ): void {
    this.ledger.stateTransfers.set(identityKey, stateTransfer);
  }

  setLastResolverTrace(trace: ResolverTrace | null): void {
    this.lastResolverTrace = trace;
  }

  /** Build a Tab-ref-keyed snapshot map from a WindowSnapshot. */
  static createSnapshotByRef(
    snapshot: WindowSnapshot
  ): Map<Tab, TabEntrySnapshot> {
    const byRef = new Map<Tab, TabEntrySnapshot>();
    for (const entry of snapshot.tabs.values()) {
      byRef.set(entry.tab, entry);
    }
    return byRef;
  }
}
