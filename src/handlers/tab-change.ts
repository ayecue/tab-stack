import { Tab } from 'vscode';

import { getLogger } from '../services/logger';
import {
  AddOp,
  AmbiguousCandidateGroup,
  ClueConfidence,
  ClueGate,
  createEmptyResolvedTabChangeEvent,
  createGroupFingerprintLifecycle,
  createResolutionEvidence,
  createResolvedBucketDeltaFromTabDeltas,
  createResolvedTabDelta,
  createResolverTrace,
  createStateTransferDecision,
  GeneratorContext,
  GroupChangeEventPayload,
  MoveHop,
  ObservedBucket,
  RemoveOp,
  ResolutionClue,
  ResolvedTabChangeEvent,
  ResolvedTabDelta,
  ResolvedTabDeltaKind,
  ResolveEventOptions,
  ResolverTrace,
  TabChangeEventPayload,
  TabChangeProperty,
  TabEntrySnapshot,
  TabMoved,
  TabUpdated,
  UpdateOp,
  WindowSnapshot
} from '../types/tab-change-proxy';
import { GroupEventSynthesizer } from './group-event-synthesizer';
import { MoveClassifier } from './move-classifier';
import { TabChangeSession } from './tab-change-session';
import { TabEventOperationBuilder } from './tab-event-operation-builder';

export class TabChangeResolver {
  private _log = getLogger().child('TabChangeResolver');
  private _session = new TabChangeSession(new Map());
  private _groupSynthesizer = new GroupEventSynthesizer();
  private _opBuilder = new TabEventOperationBuilder();
  private _moveClassifier = new MoveClassifier();

  get lastResolverTrace(): ResolverTrace | null {
    return this._session.lastResolverTrace;
  }

  refreshSnapshots(snapshot: WindowSnapshot): void {
    this._session.refreshFrom(snapshot);
  }

  seedSnapshot(snapshot: WindowSnapshot): void {
    this._session.seedFrom(snapshot);
  }

  processEvent(
    event: TabChangeEventPayload,
    freshSnapshot: WindowSnapshot,
    freshByRef = TabChangeSession.createSnapshotByRef(freshSnapshot)
  ): void {
    this._opBuilder.build(event, freshSnapshot, this._session, freshByRef);
  }

  resolveObservedBucket(bucket: ObservedBucket): ResolvedTabChangeEvent {
    this.seedSnapshot(bucket.beforeSnapshot);
    this._session.beginBucket(bucket);

    for (const event of bucket.events) {
      if (event.type === 'group') {
        this.processGroupChanges(
          event.event as GroupChangeEventPayload,
          event.afterSnapshot
        );
      } else {
        this.processEvent(
          event.event as TabChangeEventPayload,
          event.afterSnapshot
        );
      }
    }

    return this.resolve({
      source: 'delta',
      bucketId: bucket.id,
      beforeSnapshot: bucket.beforeSnapshot,
      afterSnapshot: bucket.afterSnapshot
    });
  }

  /**
   * Convert raw group-level events into synthetic tab-level events via a
   * 5-stage generator pipeline, then feed them into processEvent().
   *
   * Stages:
   * 1. closedGroups   — tabs from destroyed groups → closes
   * 2. openedGroups   — tabs in new groups → opens
   * 3. cascadingVCShifts — VC renumbering from structural changes → close+open (moves)
   * 4. changedGroups  — remaining diffs in changed groups
   * 5. classifyMoves  — extract close+open pairs (same Tab ref) into moved
   */
  processGroupChanges(
    event: GroupChangeEventPayload,
    freshSnapshot: WindowSnapshot
  ): void {
    const session = this._session;
    session.ensureBatchStart();

    const freshByRef = TabChangeSession.createSnapshotByRef(freshSnapshot);

    // VS Code may create new Tab object refs when groups move.
    // Reconcile stale refs before running the pipeline so all
    // Tab-ref-keyed lookups work correctly.
    this._reconcileSnapshotRefs(freshByRef);

    // Build per-VC indexes so pipeline stages iterate only affected groups
    const snapshotByVC = session.computationCache.indexByViewColumn(
      session.snapshot
    );
    const freshByVC = session.computationCache.indexByViewColumn(freshByRef);

    const ctx: GeneratorContext = {
      snapshot: session.snapshot,
      freshByRef,
      computationCache: session.computationCache,
      snapshotByVC,
      freshByVC,
      groupEvent: event,
      opened: [],
      closed: [],
      changed: [],
      moved: [],
      processed: new Set(),
      closedViewColumns: new Set(),
      openedViewColumns: new Set()
    };

    this._log.info(
      `processGroupChanges: snapshot=${session.snapshot.size} tabs, freshByRef=${freshByRef.size} tabs, event: opened=${event.opened.length} closed=${event.closed.length} changed=${event.changed.length}`
    );

    // Run pipeline stages in order
    this._groupSynthesizer.run(ctx);

    // ── Synthesize events for group active-state changes ──────────────
    //
    // When the active editor group changes (VC focus shift), VS Code may
    // fire only a group-changed event with no tab-level property diffs.
    // Detect this by comparing group isActive against our tracked state
    // and inject a synthetic isActive update op for the active tab in
    // each group whose active state flipped. The tab's own isActive
    // didn't change (it was already active within its group), so we
    // force 'isActive' to signal the focus shift to consumers.
    const alreadyHandled = new Set([
      ...ctx.opened,
      ...ctx.closed,
      ...ctx.changed,
      ...ctx.moved
    ]);
    const groupActiveChangedTabs: Tab[] = [];
    for (const [vc, groupEntry] of freshSnapshot.groups) {
      const wasActive = session.groupActiveState.get(vc);
      if (wasActive === groupEntry.isActive) continue;

      // Find the active tab in this group from the fresh snapshot
      const freshGroupTabs = freshByVC.get(vc);
      if (!freshGroupTabs) continue;

      for (const [tab, entry] of freshGroupTabs) {
        if (
          entry.isActive &&
          !alreadyHandled.has(tab) &&
          !ctx.processed.has(tab)
        ) {
          this._log.info(
            `  VC ${vc} active state changed (${wasActive} → ${groupEntry.isActive}) — injecting isActive update for "${tab.label}"`
          );
          const oldEntry = session.snapshot.get(tab) ?? entry;
          const changed = new Set<TabChangeProperty | 'viewColumn' | 'index'>([
            'isActive'
          ] as const);
          session.ops.push({ type: 'update', entry, oldEntry, changed });
          ctx.processed.add(tab);
          groupActiveChangedTabs.push(tab);
          break;
        }
      }
    }
    // Update tracked group active state
    session.updateGroupActiveState(freshSnapshot);

    this._log.info(
      `after stages: opened=${ctx.opened.length} closed=${ctx.closed.length} changed=${ctx.changed.length} moved=${ctx.moved.length}`
    );

    // Feed accumulated events into processEvent.
    // Tab-level index cascades (neighbor shifts) are NOT derived here —
    // processEvent()'s own pipeline handles those uniformly.
    if (
      ctx.opened.length ||
      ctx.closed.length ||
      ctx.changed.length ||
      ctx.moved.length
    ) {
      this.processEvent(
        {
          opened: ctx.opened,
          closed: ctx.closed,
          changed: ctx.changed,
          moved: ctx.moved
        },
        freshSnapshot,
        freshByRef
      );
    } else if (groupActiveChangedTabs.length > 0) {
      // Only group active-state changed — ops already pushed directly.
      // Still need to advance the tab snapshot so subsequent events diff correctly.
      for (const [tab, newEntry] of freshByRef) {
        if (session.snapshot.has(tab)) {
          session.snapshot.set(tab, newEntry);
        }
      }
    } else {
      this._log.info('no synthetic events — advancing snapshot in-place');
      // No synthetic events — still advance snapshot entries in-place
      // so duplicate group events produce no diff on the next call.
      for (const [tab, newEntry] of freshByRef) {
        if (session.snapshot.has(tab)) {
          session.snapshot.set(tab, newEntry);
        }
      }
    }
  }

  resolve(resolveOptions: ResolveEventOptions = {}): ResolvedTabChangeEvent {
    const session = this._session;
    const source = resolveOptions.source ?? 'delta';
    const baseEvent = createEmptyResolvedTabChangeEvent(source);
    const bucketId = resolveOptions.bucketId ?? session.currentBucket?.id ?? 0;
    const beforeSnapshot =
      resolveOptions.beforeSnapshot ?? baseEvent.beforeSnapshot;
    const afterSnapshot =
      resolveOptions.afterSnapshot ?? baseEvent.afterSnapshot;
    const created: Tab[] = [];
    const closed: Tab[] = [];
    const moved: TabMoved[] = [];
    const updated: TabUpdated[] = [];
    const createdEntries = new Map<Tab, TabEntrySnapshot>();
    const closedEntries = new Map<Tab, TabEntrySnapshot>();

    if (session.ops.length === 0) {
      const resolvedBucketDelta = createResolvedBucketDeltaFromTabDeltas(
        source,
        bucketId,
        beforeSnapshot,
        afterSnapshot
      );

      return {
        ...baseEvent,
        bucketId,
        tabRewireDeltas: resolvedBucketDelta.tabRewireDeltas,
        resolvedBucketDelta,
        beforeSnapshot,
        afterSnapshot
      };
    }

    // ── Separate ops by type ─────────────────────────────────────────

    const addOps: AddOp[] = [];
    const removeOps: RemoveOp[] = [];
    const updateOps: UpdateOp[] = [];

    for (const op of session.ops) {
      switch (op.type) {
        case 'add':
          addOps.push(op);
          break;
        case 'remove':
          removeOps.push(op);
          break;
        case 'update':
          updateOps.push(op);
          break;
      }
    }

    // ── Move classification ─────────────────────────────────────────

    const mc = this._moveClassifier.classify(
      addOps,
      removeOps,
      updateOps,
      session
    );

    moved.push(...mc.moved);
    for (const entry of mc.chainClosed) {
      closed.push(entry.tab);
      closedEntries.set(entry.tab, entry);
    }
    updated.push(...mc.bouncedUpdates);

    // ── Identify groups with within-group moves for cascade filtering

    const groupsWithMoves = new Set<number>();
    for (const m of moved) {
      if (m.fromViewColumn === m.toViewColumn) {
        groupsWithMoves.add(m.fromViewColumn);
      }
    }

    // ── Remaining unmatched adds → CREATED ──────────────────────────

    for (const op of mc.unmatchedAdds) {
      created.push(op.entry.tab);
      createdEntries.set(op.entry.tab, op.entry);
    }

    // ── Remaining unmatched removes → CLOSED ────────────────────────

    for (const op of mc.unmatchedRemoves) {
      closed.push(op.entry.tab);
      closedEntries.set(op.entry.tab, op.entry);
    }

    // ── Remaining update ops → UPDATED or filtered ──────────────────

    const handledTabs = new Set<Tab>([
      ...mc.movedTabRefs,
      ...mc.movedSourceTabRefs,
      ...mc.bouncedTabs,
      ...created,
      ...closed
    ]);

    const updatesByTab = new Map<Tab, TabUpdated>();
    const promotedMoveCandidates = new Map<
      Tab,
      { oldEntry: TabEntrySnapshot; entry: TabEntrySnapshot }
    >();
    for (const op of updateOps) {
      if (mc.implicitMoveUpdates.has(op)) continue;
      if (mc.withinGroupMoveUpdates.has(op)) continue;
      if (handledTabs.has(op.entry.tab)) continue;

      const isDerivedStructuralShift =
        session.derivedShiftOps.has(op) &&
        (op.changed.has('index') || op.changed.has('viewColumn'));

      // Promote index-shifted neighbors in reorder-affected groups to moves
      if (
        isDerivedStructuralShift ||
        (op.changed.has('index') &&
          !op.changed.has('viewColumn') &&
          groupsWithMoves.has(op.entry.viewColumn))
      ) {
        const originalEntry =
          session.batchStartSnapshot?.get(op.entry.tab) ?? op.oldEntry;
        const existingCandidate = promotedMoveCandidates.get(op.entry.tab);

        promotedMoveCandidates.set(op.entry.tab, {
          oldEntry: existingCandidate?.oldEntry ?? originalEntry,
          entry: op.entry
        });
        continue;
      }

      const update = updatesByTab.get(op.entry.tab) ?? {
        tab: op.entry.tab,
        oldEntry: session.batchStartSnapshot?.get(op.entry.tab) ?? op.oldEntry,
        entry: op.entry,
        changed: new Set<TabChangeProperty | 'index'>()
      };
      for (const change of op.changed) {
        if (change === 'viewColumn') continue;
        if (change === 'index') continue;
        update.changed.add(change);
      }
      if (update.changed.size > 0) {
        update.entry = op.entry;
        updatesByTab.set(op.entry.tab, update);
      }
    }

    for (const [tab, candidate] of promotedMoveCandidates) {
      if (handledTabs.has(tab)) continue;

      const structuralChanged =
        candidate.oldEntry.viewColumn !== candidate.entry.viewColumn ||
        candidate.oldEntry.index !== candidate.entry.index;
      const propertyChanges = session.computationCache.diffProperties(
        candidate.entry,
        candidate.oldEntry
      );

      if (structuralChanged) {
        moved.push({
          tab,
          oldEntry: candidate.oldEntry,
          entry: candidate.entry,
          fromViewColumn: candidate.oldEntry.viewColumn,
          toViewColumn: candidate.entry.viewColumn,
          fromIndex: candidate.oldEntry.index,
          toIndex: candidate.entry.index,
          changed: propertyChanges
        });
        handledTabs.add(tab);
        continue;
      }

      if (propertyChanges.size > 0) {
        updatesByTab.set(tab, {
          tab,
          oldEntry: candidate.oldEntry,
          entry: candidate.entry,
          changed: propertyChanges
        });
      }
    }

    for (const [tab, update] of updatesByTab) {
      if (handledTabs.has(tab)) continue;
      updated.push(update);
    }

    const tabDeltas = this._buildResolvedTabDeltas(
      created,
      closed,
      moved,
      updated,
      createdEntries,
      closedEntries,
      mc.ambiguousCandidateGroups
    );
    const resolvedBucketDelta = createResolvedBucketDeltaFromTabDeltas(
      source,
      bucketId,
      beforeSnapshot,
      afterSnapshot,
      tabDeltas
    );

    session.setLastResolverTrace(
      createResolverTrace(
        source,
        bucketId,
        beforeSnapshot,
        afterSnapshot,
        tabDeltas,
        [],
        this._buildResolverDiagnostics()
      )
    );

    return {
      ...baseEvent,
      bucketId,
      source,
      created,
      closed,
      moved,
      updated,
      createdEntries,
      closedEntries,
      beforeSnapshot,
      afterSnapshot,
      tabRewireDeltas: resolvedBucketDelta.tabRewireDeltas,
      resolvedBucketDelta
    };
  }

  reset(): void {
    this._session.resetBatch();
  }

  /**
   * When VS Code moves groups, it may replace Tab objects with new
   * instances.  Detect stale refs in `_snapshot` and re-key them to
   * the fresh refs while preserving old position data, so downstream
   * Tab-ref-keyed lookups work correctly.
   *
   * Matching strategy:
   * 1. Build group fingerprints from captured snapshot metadata for old and
   *    new snapshots.
   * 2. Match old VCs to new VCs by identical fingerprint.
   * 3. Reconcile entries by globalRefClue. Unique clues pair directly.
   *    Duplicate clues are paired as ordered groups so same-label terminals
   *    or split duplicates do not collapse onto a single old entry.
   * 4. Old entries with no fresh match (e.g. from closed groups) are kept
   *    with their original Tab refs.
   */
  private _reconcileSnapshotRefs(freshByRef: Map<Tab, TabEntrySnapshot>): void {
    const session = this._session;

    // Quick check: are any snapshot Tab refs missing from freshByRef?
    let staleCount = 0;
    for (const tab of session.snapshot.keys()) {
      if (!freshByRef.has(tab)) staleCount++;
    }
    if (staleCount === 0) return;

    this._log.info(`reconciling ${staleCount} stale Tab ref(s)`);

    const { newVCtoOldVC, reconciled, oldTabToFreshTab } =
      this._reconcileEntriesByGlobalRef(session.snapshot, freshByRef, true);

    this._log.info(
      `VC mapping: ${[...newVCtoOldVC].map(([n, o]) => `new${n}←old${o}`).join(', ')}`
    );

    session.snapshot = reconciled;

    // Reconcile batch-start snapshot with the same duplicate-aware mapping so
    // lifecycle donors stay aligned when identical global clues repeat.
    if (session.batchStartSnapshot) {
      const { reconciled: reconciledBatch } = this._reconcileEntriesByGlobalRef(
        session.batchStartSnapshot,
        reconciled
      );

      session.batchStartSnapshot = reconciledBatch;
    }

    const reconcileEntryTabRef = (
      entry: TabEntrySnapshot
    ): TabEntrySnapshot => {
      const freshTab = oldTabToFreshTab.get(entry.tab);

      return freshTab ? { ...entry, tab: freshTab } : entry;
    };

    if (session.ops.length > 0) {
      for (const op of session.ops) {
        if (op.type === 'update') {
          op.entry = reconcileEntryTabRef(op.entry);
          op.oldEntry = reconcileEntryTabRef(op.oldEntry);
          continue;
        }

        op.entry = reconcileEntryTabRef(op.entry);
      }
    }

    if (session.preMatchedMoveChains.size > 0) {
      const reconciledChains = new Map<Tab, MoveHop[]>();

      for (const [chainTab, hops] of session.preMatchedMoveChains) {
        const reconciledChainTab = oldTabToFreshTab.get(chainTab) ?? chainTab;
        const existingHops = reconciledChains.get(reconciledChainTab) ?? [];

        for (const hop of hops) {
          const reconciledAddTab = oldTabToFreshTab.get(hop.addOp.entry.tab);
          const reconciledRemoveTab = oldTabToFreshTab.get(
            hop.removeOp.entry.tab
          );

          if (reconciledAddTab) {
            hop.addOp.entry = { ...hop.addOp.entry, tab: reconciledAddTab };
          }

          if (reconciledRemoveTab) {
            hop.removeOp.entry = {
              ...hop.removeOp.entry,
              tab: reconciledRemoveTab
            };
          }

          existingHops.push(hop);
        }

        reconciledChains.set(reconciledChainTab, existingHops);
      }

      session.preMatchedMoveChains = reconciledChains;
    }
  }

  private _reconcileEntriesByGlobalRef(
    previousByRef: Map<Tab, TabEntrySnapshot>,
    nextByRef: Map<Tab, TabEntrySnapshot>,
    logUnmatchedFresh = false
  ): {
    newVCtoOldVC: Map<number, number>;
    reconciled: Map<Tab, TabEntrySnapshot>;
    oldTabToFreshTab: Map<Tab, Tab>;
  } {
    const { newVCtoOldVC, oldVCtoNewVC } =
      this._buildViewColumnFingerprintMapping(previousByRef, nextByRef);
    const previousByGlobalRef = this._groupEntriesByGlobalRef(previousByRef);
    const nextByGlobalRef = this._groupEntriesByGlobalRef(nextByRef);
    const reconciled = new Map<Tab, TabEntrySnapshot>();
    const oldTabToFreshTab = new Map<Tab, Tab>();
    const matchedPreviousTabs = new Set<Tab>();
    const matchedNextTabs = new Set<Tab>();

    for (const [globalRefClue, nextEntries] of nextByGlobalRef) {
      const previousEntries = previousByGlobalRef.get(globalRefClue);

      if (!previousEntries || previousEntries.length === 0) {
        continue;
      }

      const sortedPreviousEntries = [...previousEntries].sort((left, right) =>
        this._compareEntriesByReconciledAddress(oldVCtoNewVC, left, right)
      );
      const sortedNextEntries = [...nextEntries].sort(
        TabChangeResolver._compareEntriesByAddress
      );
      const pairCount = Math.min(
        sortedPreviousEntries.length,
        sortedNextEntries.length
      );

      for (let index = 0; index < pairCount; index++) {
        const previousEntry = sortedPreviousEntries[index];
        const nextEntry = sortedNextEntries[index];

        matchedPreviousTabs.add(previousEntry.tab);
        matchedNextTabs.add(nextEntry.tab);
        oldTabToFreshTab.set(previousEntry.tab, nextEntry.tab);
        reconciled.set(nextEntry.tab, { ...previousEntry, tab: nextEntry.tab });
      }
    }

    if (logUnmatchedFresh) {
      for (const [freshTab, freshEntry] of nextByRef) {
        if (!matchedNextTabs.has(freshTab)) {
          this._log.info(
            `  no old match for "${freshTab.label}" @ vc${freshEntry.viewColumn}`
          );
        }
      }
    }

    for (const [previousTab, previousEntry] of previousByRef) {
      if (!matchedPreviousTabs.has(previousTab)) {
        reconciled.set(previousTab, previousEntry);
      }
    }

    return {
      newVCtoOldVC,
      reconciled,
      oldTabToFreshTab
    };
  }

  private _buildViewColumnFingerprintMapping(
    previousByRef: Map<Tab, TabEntrySnapshot>,
    nextByRef: Map<Tab, TabEntrySnapshot>
  ): {
    newVCtoOldVC: Map<number, number>;
    oldVCtoNewVC: Map<number, number>;
  } {
    const nextFingerprints =
      this._session.computationCache.groupFingerprintCluesByViewColumn(nextByRef);

    const oldVCsByFingerprint = new Map(
      [
        ...this._session.computationCache.viewColumnsByGroupFingerprintClue(
          previousByRef
        )
      ].map(([fingerprint, viewColumns]) => [fingerprint, [...viewColumns]])
    );
    const newVCtoOldVC = new Map<number, number>();
    const oldVCtoNewVC = new Map<number, number>();

    for (const [newVC, fingerprint] of nextFingerprints) {
      const oldVCs = oldVCsByFingerprint.get(fingerprint);
      const oldVC = oldVCs?.shift();

      if (oldVC !== undefined) {
        newVCtoOldVC.set(newVC, oldVC);
        oldVCtoNewVC.set(oldVC, newVC);
      }
    }

    return {
      newVCtoOldVC,
      oldVCtoNewVC
    };
  }

  private _groupEntriesByGlobalRef(
    byRef: Map<Tab, TabEntrySnapshot>
  ): Map<string, TabEntrySnapshot[]> {
    const grouped = new Map<string, TabEntrySnapshot[]>();

    for (const [, entry] of byRef) {
      const entries = grouped.get(entry.globalRefClue) ?? [];

      entries.push(entry);
      grouped.set(entry.globalRefClue, entries);
    }

    return grouped;
  }

  private _compareEntriesByReconciledAddress(
    oldVCtoNewVC: Map<number, number>,
    left: TabEntrySnapshot,
    right: TabEntrySnapshot
  ): number {
    const leftViewColumn = oldVCtoNewVC.get(left.viewColumn) ?? left.viewColumn;
    const rightViewColumn =
      oldVCtoNewVC.get(right.viewColumn) ?? right.viewColumn;

    return (
      leftViewColumn - rightViewColumn ||
      left.index - right.index ||
      left.exactKeyClue.localeCompare(right.exactKeyClue)
    );
  }

  private static _compareEntriesByAddress(
    left: TabEntrySnapshot,
    right: TabEntrySnapshot
  ): number {
    return (
      left.viewColumn - right.viewColumn ||
      left.index - right.index ||
      left.exactKeyClue.localeCompare(right.exactKeyClue)
    );
  }

  private _buildResolvedTabDeltas(
    created: readonly Tab[],
    closed: readonly Tab[],
    moved: readonly TabMoved[],
    updated: readonly TabUpdated[],
    createdEntries: ReadonlyMap<Tab, TabEntrySnapshot>,
    closedEntries: ReadonlyMap<Tab, TabEntrySnapshot>,
    ambiguousCandidateGroups: readonly AmbiguousCandidateGroup[]
  ): ResolvedTabDelta[] {
    const tabDeltas: ResolvedTabDelta[] = [];
    const ambiguousCreated = new Set<Tab>();
    const ambiguousClosed = new Set<Tab>();

    for (const group of ambiguousCandidateGroups) {
      const pairCount = Math.min(
        group.beforeEntries.length,
        group.afterEntries.length
      );

      for (let index = 0; index < pairCount; index++) {
        const before = group.beforeEntries[index];
        const after = group.afterEntries[index];

        ambiguousClosed.add(before.tab);
        ambiguousCreated.add(after.tab);
        tabDeltas.push(
          this._createResolvedTabDelta(
            'ambiguous',
            before,
            after,
            createStateTransferDecision(
              'blocked',
              `Resolver could not prove a unique lifecycle for global clue "${group.globalRefClue}" (${group.beforeEntries.length} before, ${group.afterEntries.length} after).`
            ),
            createResolutionEvidence(
              this._buildAmbiguousClues(
                group.globalRefClue,
                before,
                after,
                group.beforeEntries.length,
                group.afterEntries.length
              )
            )
          )
        );
      }
    }

    for (const tab of created) {
      const after = createdEntries.get(tab) ?? null;

      if (!after || ambiguousCreated.has(tab)) {
        continue;
      }

      tabDeltas.push(
        this._createResolvedTabDelta(
          'create',
          null,
          after,
          createStateTransferDecision(
            'fresh',
            'Resolver classified tab as a fresh create.'
          )
        )
      );
    }

    for (const tab of closed) {
      const before = closedEntries.get(tab) ?? null;

      if (!before || ambiguousClosed.has(tab)) {
        continue;
      }

      tabDeltas.push(
        this._createResolvedTabDelta(
          'close',
          before,
          null,
          createStateTransferDecision(
            'release',
            'Resolver classified tab as a terminal close.'
          )
        )
      );
    }

    for (const move of moved) {
      const moveBaseline =
        this._session.batchStartSnapshot?.get(move.entry.tab) ?? move.oldEntry;

      tabDeltas.push(
        this._createResolvedTabDelta(
          'move',
          moveBaseline,
          move.entry,
          createStateTransferDecision(
            'carry',
            'Resolver preserved tab continuity across a structural change.'
          )
        )
      );
    }

    for (const update of updated) {
      const structuralChanged =
        update.oldEntry.viewColumn !== update.entry.viewColumn ||
        update.oldEntry.index !== update.entry.index;
      const propertyChanges = this._session.computationCache.diffProperties(
        update.entry,
        update.oldEntry
      );

      if (!structuralChanged && propertyChanges.size === 0) {
        continue;
      }

      tabDeltas.push(
        this._createResolvedTabDelta(
          'patch',
          update.oldEntry,
          update.entry,
          createStateTransferDecision(
            'carry',
            'Resolver preserved tab continuity across a property-only change.'
          )
        )
      );
    }

    return tabDeltas;
  }

  private _createResolvedTabDelta(
    kind: ResolvedTabDeltaKind,
    before: TabEntrySnapshot | null,
    after: TabEntrySnapshot | null,
    stateTransfer: ReturnType<typeof createStateTransferDecision>,
    evidence = createResolutionEvidence(
      this._buildAcceptedClues(kind, before, after)
    )
  ): ResolvedTabDelta {
    const delta = this._applyExclusivityGuards(
      createResolvedTabDelta(kind, before, after, stateTransfer, evidence)
    );

    this._recordResolvedTabDelta(delta);

    return delta;
  }

  private _applyExclusivityGuards(delta: ResolvedTabDelta): ResolvedTabDelta {
    if (delta.stateTransfer.disposition !== 'carry') {
      return delta;
    }

    const rejectedClues: ResolutionClue[] = [];
    const reasons: string[] = [];
    const claims = this._session.ledger.exclusivityClaims;
    const entryExactKeyClue = delta.exactKeyClueLifecycle.entryExactKeyClue;
    const endExactKeyClue = delta.exactKeyClueLifecycle.endExactKeyClue;

    if (
      entryExactKeyClue != null &&
      claims.entryExactKeyClues.has(entryExactKeyClue)
    ) {
      this._pushRejectedClue(
        rejectedClues,
        'exact-key',
        'exact-continuity',
        entryExactKeyClue,
        false,
        ['Entry exact clue was already claimed by another lifecycle.']
      );
      reasons.push('entry exact continuity was already claimed');
    }

    if (
      endExactKeyClue != null &&
      claims.endExactKeyClues.has(endExactKeyClue)
    ) {
      this._pushRejectedClue(
        rejectedClues,
        'exact-key',
        'exact-continuity',
        endExactKeyClue,
        false,
        ['End exact clue was already claimed by another lifecycle.']
      );
      reasons.push('end exact continuity was already claimed');
    }

    if (
      entryExactKeyClue != null &&
      claims.stateDonors.has(entryExactKeyClue)
    ) {
      this._pushRejectedClue(
        rejectedClues,
        'exact-key',
        'exact-continuity',
        entryExactKeyClue,
        false,
        ['Tracked-state donor was already consumed by another lifecycle.']
      );
      reasons.push('tracked-state donor was already consumed');
    }

    if (rejectedClues.length === 0) {
      return delta;
    }

    return createResolvedTabDelta(
      'ambiguous',
      delta.before,
      delta.after,
      createStateTransferDecision(
        'blocked',
        `Resolver rejected carry because ${reasons.join(', ')}.`
      ),
      createResolutionEvidence(rejectedClues)
    );
  }

  private _buildAcceptedClues(
    kind: ResolvedTabDeltaKind,
    before: TabEntrySnapshot | null,
    after: TabEntrySnapshot | null
  ): ResolutionClue[] {
    const clues: ResolutionClue[] = [];
    const primaryGate = this._getPrimaryGate(kind, before, after);
    const exactGate: ClueGate =
      kind === 'patch' ? 'property-patch' : 'exact-continuity';

    this._pushAcceptedClue(
      clues,
      'exact-key',
      exactGate,
      before?.exactKeyClue ?? null,
      ['Entry exact clue captured from the resolved before snapshot.']
    );
    this._pushAcceptedClue(
      clues,
      'exact-key',
      exactGate,
      after?.exactKeyClue ?? null,
      ['End exact clue captured from the resolved after snapshot.']
    );

    if (before && after && before.viewColumn === after.viewColumn) {
      this._pushAcceptedClue(
        clues,
        'local-ref',
        primaryGate,
        after.localRefClue,
        [
          'Resolved tab remained in the same group while exact addressing shifted.'
        ]
      );
    }

    if (
      (before && after && before.viewColumn !== after.viewColumn) ||
      !before ||
      !after
    ) {
      this._pushAcceptedClue(
        clues,
        'global-ref',
        primaryGate,
        after?.globalRefClue ?? before?.globalRefClue ?? null,
        ['Resolved tab used global clue identity at the bucket boundary.']
      );
    }

    if (before?.groupFingerprintClue || after?.groupFingerprintClue) {
      this._pushAcceptedClue(
        clues,
        'group-fingerprint',
        'group-structure',
        before?.groupFingerprintClue ?? null,
        ['Entry group fingerprint captured for structural context.']
      );
      this._pushAcceptedClue(
        clues,
        'group-fingerprint',
        'group-structure',
        after?.groupFingerprintClue ?? null,
        ['End group fingerprint captured for structural context.']
      );
    }

    return clues;
  }

  private _buildAmbiguousClues(
    globalRefClue: string,
    before: TabEntrySnapshot | null,
    after: TabEntrySnapshot | null,
    beforeCount: number,
    afterCount: number
  ): ResolutionClue[] {
    const clues: ResolutionClue[] = [];
    const primaryGate = this._getPrimaryGate('ambiguous', before, after);
    const duplicationNote =
      beforeCount === afterCount
        ? `Global clue "${globalRefClue}" appeared ${beforeCount} time(s) on both sides of the bucket.`
        : `Global clue "${globalRefClue}" appeared ${beforeCount} time(s) before and ${afterCount} time(s) after the bucket.`;

    this._pushRejectedClue(
      clues,
      'exact-key',
      'exact-continuity',
      before?.exactKeyClue ?? null,
      true,
      ['Entry exact clue identifies one competing lifecycle boundary.']
    );
    this._pushRejectedClue(
      clues,
      'exact-key',
      'exact-continuity',
      after?.exactKeyClue ?? null,
      true,
      ['End exact clue identifies one competing lifecycle boundary.']
    );
    this._pushRejectedClue(
      clues,
      'global-ref',
      primaryGate,
      globalRefClue,
      false,
      [
        duplicationNote,
        'No stronger gated clue isolated a one-to-one lifecycle.'
      ]
    );

    return clues;
  }

  private _pushAcceptedClue(
    clues: ResolutionClue[],
    kind: ResolutionClue['kind'],
    gate: ClueGate,
    value: string | null,
    notes: string[]
  ): void {
    this._pushClue(clues, kind, gate, value, true, true, notes);
  }

  private _pushRejectedClue(
    clues: ResolutionClue[],
    kind: ResolutionClue['kind'],
    gate: ClueGate,
    value: string | null,
    uniqueWithinBucket: boolean,
    notes: string[]
  ): void {
    this._pushClue(clues, kind, gate, value, false, uniqueWithinBucket, notes);
  }

  private _pushClue(
    clues: ResolutionClue[],
    kind: ResolutionClue['kind'],
    gate: ClueGate,
    value: string | null,
    accepted: boolean,
    uniqueWithinBucket: boolean,
    notes: string[]
  ): void {
    if (!value) {
      return;
    }

    clues.push({
      kind,
      confidence: this._getClueConfidence(kind),
      gate,
      value,
      accepted,
      uniqueWithinBucket,
      notes
    });
  }

  private _getClueConfidence(kind: ResolutionClue['kind']): ClueConfidence {
    return kind === 'exact-key'
      ? 'highest'
      : kind === 'group-fingerprint'
        ? 'high'
        : kind === 'local-ref'
          ? 'medium'
          : kind === 'tab-ref'
            ? 'high'
            : 'low';
  }

  private _getPrimaryGate(
    kind: ResolvedTabDeltaKind,
    before: TabEntrySnapshot | null,
    after: TabEntrySnapshot | null
  ): ClueGate {
    if (kind === 'patch') {
      return 'property-patch';
    }

    if (before && after) {
      return before.viewColumn === after.viewColumn
        ? 'within-group-move'
        : 'cross-group-move';
    }

    return 'exact-continuity';
  }

  private _recordResolvedTabDelta(delta: ResolvedTabDelta): void {
    const identityKey = this._getResolvedIdentityKey(delta);
    const acceptedClues = delta.evidence.clues.filter((clue) => clue.accepted);
    const rejectedClues = delta.evidence.clues.filter((clue) => !clue.accepted);

    for (const clue of acceptedClues) {
      this._session.recordAcceptedClueMatch(identityKey, clue);
    }

    for (const clue of rejectedClues) {
      this._session.recordRejectedClueCandidate(identityKey, clue);
    }

    this._session.recordGatekeepingState(identityKey, {
      gate:
        acceptedClues[0]?.gate ?? rejectedClues[0]?.gate ?? 'exact-continuity',
      acceptedClues,
      rejectedClues,
      notes: delta.kind === 'ambiguous' ? [delta.stateTransfer.reason] : []
    });
    this._session.recordExactKeyLifecycle(
      identityKey,
      delta.exactKeyClueLifecycle
    );
    this._session.recordGroupFingerprintLifecycle(
      identityKey,
      createGroupFingerprintLifecycle(
        delta.before?.groupFingerprintClue ?? null,
        delta.after?.groupFingerprintClue ?? null,
        delta.before?.groupFingerprintClue != null &&
          delta.before.groupFingerprintClue ===
            delta.after?.groupFingerprintClue
      )
    );
    this._session.recordStateTransfer(identityKey, delta.stateTransfer);
    if (delta.stateTransfer.disposition !== 'blocked') {
      this._session.claimEntryExactKeyClue(
        delta.exactKeyClueLifecycle.entryExactKeyClue
      );
      this._session.claimEndExactKeyClue(
        delta.exactKeyClueLifecycle.endExactKeyClue
      );

      for (const hop of delta.exactKeyClueLifecycle.hops) {
        this._session.claimLifecycleHop(`${identityKey}:${hop.seq}`);
      }
    }

    if (delta.stateTransfer.disposition === 'carry') {
      this._session.claimStateDonor(
        delta.exactKeyClueLifecycle.entryExactKeyClue
      );
    }

    if (
      delta.kind === 'ambiguous' ||
      delta.stateTransfer.disposition === 'blocked'
    ) {
      this._session.recordAmbiguity({
        identityKey,
        reason: delta.stateTransfer.reason,
        notes: delta.evidence.clues.flatMap((clue) => clue.notes)
      });
    }
  }

  private _getResolvedIdentityKey(delta: ResolvedTabDelta): string {
    return (
      delta.exactKeyClueLifecycle.entryExactKeyClue ??
      delta.exactKeyClueLifecycle.endExactKeyClue ??
      delta.globalRefClue ??
      `${delta.kind}:${this._session.ledger.stateTransfers.size}`
    );
  }

  private _buildResolverDiagnostics(): string[] {
    const diagnostics: string[] = [];

    if (this._session.currentBucket) {
      diagnostics.push(
        `bucket ${this._session.currentBucket.id}: ${this._session.currentBucket.events.length} compressed event(s)`
      );
    }

    for (const ambiguity of this._session.ledger.ambiguities) {
      diagnostics.push(
        `ambiguous ${ambiguity.identityKey}: ${ambiguity.reason}`
      );
    }

    return diagnostics;
  }
}
