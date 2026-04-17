import { Tab } from 'vscode';

import {
  AddOp,
  AmbiguousCandidateGroup,
  MoveClassificationResult,
  MoveHop,
  RemoveOp,
  TabEntrySnapshot,
  TabMoved,
  TabUpdated,
  UpdateOp
} from '../types/tab-change-proxy';
import { TabChangeSession } from './tab-change-session';

/**
 * Resolves move semantics from staged add/remove/update operations.
 *
 * Owns: pre-matched move-chain consumption, ordered Tab-ref matching,
 * unique global-ref matching, chain collapse, net move materialization,
 * bounced-tab handling, implicit cross-group moves, and within-group reorder detection.
 */
export class MoveClassifier {
  classify(
    addOps: AddOp[],
    removeOps: RemoveOp[],
    updateOps: UpdateOp[],
    session: TabChangeSession
  ): MoveClassificationResult {
    const matchedAdds = new Set<AddOp>();
    const matchedRemoves = new Set<RemoveOp>();
    const movedTabRefs = new Set<Tab>();
    const movedSourceTabRefs = new Set<Tab>();
    const bouncedTabs = new Set<Tab>();
    const moved: TabMoved[] = [];
    const chainClosed: TabEntrySnapshot[] = [];
    const bouncedUpdates: TabUpdated[] = [];

    // ── Move chain infrastructure ───────────────────────────────────

    const moveChainsByTab = new Map<Tab, MoveHop[]>();

    const appendMoveHop = (addOp: AddOp, removeOp: RemoveOp): void => {
      matchedAdds.add(addOp);
      matchedRemoves.add(removeOp);

      // Same position → bounced (property-change only)
      if (
        addOp.entry.viewColumn === removeOp.entry.viewColumn &&
        addOp.entry.index === removeOp.entry.index
      ) {
        const originalEntry =
          session.batchStartSnapshot?.get(removeOp.entry.tab) ?? removeOp.entry;
        const propChanges = session.computationCache.diffProperties(
          addOp.entry,
          originalEntry
        );
        if (propChanges.size > 0) {
          bouncedUpdates.push({
            tab: addOp.entry.tab,
            oldEntry: originalEntry,
            entry: addOp.entry,
            changed: propChanges
          });
        }
        bouncedTabs.add(addOp.entry.tab);
        bouncedTabs.add(removeOp.entry.tab);
        return;
      }

      const chain = moveChainsByTab.get(addOp.entry.tab) ?? [];
      chain.push({ addOp, removeOp });
      moveChainsByTab.set(addOp.entry.tab, chain);

      movedTabRefs.add(addOp.entry.tab);
      movedSourceTabRefs.add(removeOp.entry.tab);
    };

    // ── Phase 1a-pre: Consume pre-matched move chains ───────────────

    for (const hops of session.preMatchedMoveChains.values()) {
      for (const { addOp, removeOp } of hops) {
        appendMoveHop(addOp, removeOp);
      }
    }

    // ── Phase 1a: Ordered Tab-ref matching ──────────────────────────

    const addQueueByTab = new Map<Tab, AddOp[]>();
    for (const op of addOps) {
      if (matchedAdds.has(op)) continue;
      const queue = addQueueByTab.get(op.entry.tab) ?? [];
      queue.push(op);
      addQueueByTab.set(op.entry.tab, queue);
    }

    for (const removeOp of removeOps) {
      if (matchedRemoves.has(removeOp)) continue;
      const queue = addQueueByTab.get(removeOp.entry.tab);
      if (!queue || queue.length === 0) continue;
      const addOp = queue.shift()!;
      appendMoveHop(addOp, removeOp);
    }

    // ── Phase 1b: Unique globalRefClue matching ────────────────────

    const addsByGlobalRefClue = new Map<string, AddOp[]>();
    for (const op of addOps) {
      if (matchedAdds.has(op)) continue;
      const list = addsByGlobalRefClue.get(op.entry.globalRefClue) ?? [];
      list.push(op);
      addsByGlobalRefClue.set(op.entry.globalRefClue, list);
    }

    const removesByGlobalRefClue = new Map<string, RemoveOp[]>();
    for (const op of removeOps) {
      if (matchedRemoves.has(op)) continue;
      const list = removesByGlobalRefClue.get(op.entry.globalRefClue) ?? [];
      list.push(op);
      removesByGlobalRefClue.set(op.entry.globalRefClue, list);
    }

    for (const [globalRefClue, adds] of addsByGlobalRefClue) {
      const removes = removesByGlobalRefClue.get(globalRefClue);

      if (adds.length === 1 && removes?.length === 1) {
        const addOp = adds[0];
        const removeOp = removes[0];

        // A close followed by a reopen at the same exact address is not
        // enough evidence to preserve lifecycle continuity. Treat it as
        // terminal close + fresh create unless stronger evidence already
        // paired the entries earlier in the pipeline.
        if (
          addOp.entry.viewColumn === removeOp.entry.viewColumn &&
          addOp.entry.index === removeOp.entry.index
        ) {
          continue;
        }

        appendMoveHop(addOp, removeOp);
      }
    }

    // ── Phase 2a: Chain + close ─────────────────────────────────────

    for (const removeOp of removeOps) {
      if (matchedRemoves.has(removeOp)) continue;
      const chain = moveChainsByTab.get(removeOp.entry.tab);
      if (!chain || chain.length === 0) continue;

      const firstHop = chain[0];
      chainClosed.push(firstHop.removeOp.entry);
      matchedRemoves.add(removeOp);

      movedTabRefs.delete(removeOp.entry.tab);
      movedSourceTabRefs.delete(firstHop.removeOp.entry.tab);
      moveChainsByTab.delete(removeOp.entry.tab);
    }

    // ── Phase 2b: Materialize remaining chains as net moves ─────────

    for (const [, chain] of moveChainsByTab) {
      if (chain.length === 0) continue;

      const firstHop = chain[0];
      const lastHop = chain[chain.length - 1];

      const originalEntry =
        session.batchStartSnapshot?.get(firstHop.removeOp.entry.tab) ??
        firstHop.removeOp.entry;

      // Skip if bounced back to origin
      if (
        firstHop.removeOp.entry.viewColumn === lastHop.addOp.entry.viewColumn &&
        firstHop.removeOp.entry.index === lastHop.addOp.entry.index
      ) {
        const propChanges = session.computationCache.diffProperties(
          lastHop.addOp.entry,
          originalEntry
        );
        if (propChanges.size > 0) {
          bouncedUpdates.push({
            tab: lastHop.addOp.entry.tab,
            oldEntry: originalEntry,
            entry: lastHop.addOp.entry,
            changed: propChanges
          });
        }
        continue;
      }

      moved.push({
        tab: lastHop.addOp.entry.tab,
        oldEntry: firstHop.removeOp.entry,
        entry: lastHop.addOp.entry,
        fromViewColumn: firstHop.removeOp.entry.viewColumn,
        toViewColumn: lastHop.addOp.entry.viewColumn,
        fromIndex: firstHop.removeOp.entry.index,
        toIndex: lastHop.addOp.entry.index,
        changed: session.computationCache.diffProperties(
          lastHop.addOp.entry,
          originalEntry
        )
      });
    }

    // Leave one-to-many duplicate churn unmatched. The resolver needs the raw
    // create/close surface so it can emit blocked ambiguity instead of
    // collapsing one successor onto an arbitrary predecessor.

    // ── Phase 3: Implicit moves (viewColumn changed via update op) ──

    const implicitMoveUpdates = new Set<UpdateOp>();
    for (const op of updateOps) {
      if (movedTabRefs.has(op.entry.tab)) continue;
      if (!op.changed.has('viewColumn')) continue;

      implicitMoveUpdates.add(op);
      movedTabRefs.add(op.entry.tab);

      const originalEntry =
        session.batchStartSnapshot?.get(op.entry.tab) ?? op.oldEntry;

      moved.push({
        tab: op.entry.tab,
        oldEntry: op.oldEntry,
        entry: op.entry,
        fromViewColumn: op.oldEntry.viewColumn,
        toViewColumn: op.entry.viewColumn,
        fromIndex: op.oldEntry.index,
        toIndex: op.entry.index,
        changed: session.computationCache.diffProperties(
          op.entry,
          originalEntry
        )
      });
    }

    // ── Phase 4: Within-group moves from non-implicit updates ───────

    const withinGroupMoveUpdates = new Set<UpdateOp>();
    for (const op of updateOps) {
      if (implicitMoveUpdates.has(op)) continue;
      if (movedTabRefs.has(op.entry.tab)) continue;
      if (session.implicitOps.has(op)) continue;
      if (session.derivedShiftOps.has(op)) continue;
      if (!op.changed.has('index')) continue;
      if (op.changed.has('viewColumn')) continue;

      withinGroupMoveUpdates.add(op);
      movedTabRefs.add(op.entry.tab);

      const originalEntry =
        session.batchStartSnapshot?.get(op.entry.tab) ?? op.oldEntry;

      moved.push({
        tab: op.entry.tab,
        oldEntry: op.oldEntry,
        entry: op.entry,
        fromViewColumn: op.oldEntry.viewColumn,
        toViewColumn: op.entry.viewColumn,
        fromIndex: op.oldEntry.index,
        toIndex: op.entry.index,
        changed: session.computationCache.diffProperties(
          op.entry,
          originalEntry
        )
      });
    }

    const unmatchedAdds = addOps.filter((op) => !matchedAdds.has(op));
    const unmatchedRemoves = removeOps.filter((op) => !matchedRemoves.has(op));

    return {
      matchedAdds,
      matchedRemoves,
      unmatchedAdds,
      unmatchedRemoves,
      movedTabRefs,
      movedSourceTabRefs,
      bouncedTabs,
      moved,
      chainClosed,
      bouncedUpdates,
      implicitMoveUpdates,
      withinGroupMoveUpdates,
      ambiguousCandidateGroups: this._buildAmbiguousCandidateGroups(
        addsByGlobalRefClue,
        removesByGlobalRefClue,
        matchedAdds,
        matchedRemoves
      )
    };
  }

  private _buildAmbiguousCandidateGroups(
    addsByGlobalRefClue: Map<string, AddOp[]>,
    removesByGlobalRefClue: Map<string, RemoveOp[]>,
    matchedAdds: Set<AddOp>,
    matchedRemoves: Set<RemoveOp>
  ): AmbiguousCandidateGroup[] {
    const groups: AmbiguousCandidateGroup[] = [];

    for (const [globalRefClue, adds] of addsByGlobalRefClue) {
      const removes = removesByGlobalRefClue.get(globalRefClue);
      if (!removes) {
        continue;
      }

      const afterEntries = adds
        .filter((op) => !matchedAdds.has(op))
        .map((op) => op.entry)
        .sort(MoveClassifier._compareEntriesByAddress);
      const beforeEntries = removes
        .filter((op) => !matchedRemoves.has(op))
        .map((op) => op.entry)
        .sort(MoveClassifier._compareEntriesByAddress);

      if (afterEntries.length === 0 || beforeEntries.length === 0) {
        continue;
      }

      if (afterEntries.length < 2 && beforeEntries.length < 2) {
        continue;
      }

      groups.push({
        globalRefClue,
        beforeEntries,
        afterEntries
      });
    }

    return groups;
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
}
