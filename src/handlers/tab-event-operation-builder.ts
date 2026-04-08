import { Tab } from 'vscode';

import {
  AddOp,
  RemoveOp,
  TabChangeEventPayload,
  TabEntrySnapshot,
  TabOp,
  WindowSnapshot
} from '../types/tab-change-proxy';
import { TabChangeSession } from './tab-change-session';

/**
 * Converts tab-level events from VS Code into internal add, remove,
 * and update operations against the current session state. Also
 * derives cascading index shifts and implicit reconciliation.
 */
export class TabEventOperationBuilder {
  /**
   * Process a single tab-change event payload into session ops.
   * Advances the session snapshot to the fresh state on completion.
   */
  build(
    event: TabChangeEventPayload,
    freshSnapshot: WindowSnapshot,
    session: TabChangeSession,
    freshByRef = TabChangeSession.createSnapshotByRef(freshSnapshot)
  ): void {
    session.ensureBatchStart();

    const processed = new Set<Tab>();
    const opsStartIndex = session.ops.length;

    // Moved tabs: record paired add/remove ops and chain them
    for (const tab of event.moved ?? []) {
      const oldEntry = session.snapshot.get(tab);
      const newEntry = freshByRef.get(tab);
      if (oldEntry && newEntry) {
        const addOp: AddOp = { type: 'add', entry: newEntry };
        const removeOp: RemoveOp = { type: 'remove', entry: oldEntry };
        session.ops.push(addOp, removeOp);
        session.appendMoveChainHop(tab, addOp, removeOp);
      }
      processed.add(tab);
    }

    // Closed tabs: look up position in OLD snapshot (before VS Code removed them)
    for (const tab of event.closed) {
      const oldEntry = session.snapshot.get(tab);
      if (oldEntry) {
        session.ops.push({ type: 'remove', entry: oldEntry });
      }
      processed.add(tab);
    }

    // Opened tabs: look up position in FRESH capture (where VS Code placed them)
    for (const tab of event.opened) {
      const newEntry = freshByRef.get(tab);
      if (newEntry) {
        session.ops.push({ type: 'add', entry: newEntry });
      }
      processed.add(tab);
    }

    // Changed tabs: diff old snapshot vs fresh capture
    for (const tab of event.changed) {
      const oldEntry = session.snapshot.get(tab);
      const newEntry = freshByRef.get(tab);
      if (oldEntry && newEntry) {
        const changed = session.computationCache.diffFull(newEntry, oldEntry);
        if (changed.size > 0) {
          session.ops.push({ type: 'update', entry: newEntry, oldEntry, changed });
        }
        processed.add(tab);
      }
    }

    // ── Derive cascading index shifts ───────────────────────────────

    const structurallyAffectedVCs = new Set<number>();
    for (let i = opsStartIndex; i < session.ops.length; i++) {
      const op = session.ops[i];
      if (op.type === 'add' || op.type === 'remove') {
        structurallyAffectedVCs.add(op.entry.viewColumn);
      }
    }

    if (structurallyAffectedVCs.size > 0) {
      for (const [tab, oldEntry] of session.snapshot) {
        if (processed.has(tab)) continue;
        if (!structurallyAffectedVCs.has(oldEntry.viewColumn)) continue;
        const newEntry = freshByRef.get(tab);
        if (!newEntry) continue;
        const changed = session.computationCache.diffFull(newEntry, oldEntry);
        if (changed.size > 0) {
          const op: TabOp = { type: 'update', entry: newEntry, oldEntry, changed };
          session.pushDerivedShiftOp(op);
          processed.add(tab);
        }
      }
    }

    // ── Implicit reconciliation ─────────────────────────────────────

    for (const [tab, oldEntry] of session.snapshot) {
      if (processed.has(tab)) continue;
      if (!freshByRef.has(tab)) {
        session.pushOp({ type: 'remove', entry: oldEntry }, true);
      }
    }
    for (const [tab, newEntry] of freshByRef) {
      if (processed.has(tab)) continue;
      const oldEntry = session.snapshot.get(tab);
      if (!oldEntry) {
        session.pushOp({ type: 'add', entry: newEntry }, true);
        continue;
      }
      const changed = session.computationCache.diffFull(newEntry, oldEntry);
      if (changed.size > 0) {
        const op: TabOp = { type: 'update', entry: newEntry, oldEntry, changed };
        session.pushOp(op, true);
      }
    }

    // Advance snapshot to current window state
    session.snapshot = freshByRef;
  }
}
