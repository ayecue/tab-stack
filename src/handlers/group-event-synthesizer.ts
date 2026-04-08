import { Tab } from 'vscode';

import {
  GeneratorContext,
  TabEntrySnapshot
} from '../types/tab-change-proxy';
import { getLogger } from '../services/logger';

/**
 * Translates group-level VS Code events into synthetic tab-level events
 * via a 5-stage pipeline:
 *
 * 1. closedGroups   — tabs from destroyed groups → closes
 * 2. openedGroups   — tabs in new groups → opens
 * 3. cascadingVCShifts — VC renumbering from structural changes → close+open (moves)
 * 4. changedGroups  — remaining diffs in changed groups
 * 5. classifyMoves  — extract close+open pairs (same Tab ref) into moved
 */
export class GroupEventSynthesizer {
  private _log = getLogger().child('GroupEventSynthesizer');

  /**
   * Run all pipeline stages in order against the given context.
   */
  run(ctx: GeneratorContext): void {
    this._stageClosedGroups(ctx);
    this._stageOpenedGroups(ctx);
    this._stageCascadingVCShifts(ctx);
    this._stageChangedGroups(ctx);
    this._stageClassifyMoves(ctx);
  }

  /**
   * Stage 1: Closed groups — direct tab closes.
   *
   * Iterate destroyed groups' tabs. If a tab is still tracked in our
   * snapshot and absent from the fresh capture, emit a close.
   */
  private _stageClosedGroups(ctx: GeneratorContext): void {
    for (const group of ctx.groupEvent.closed) {
      ctx.closedViewColumns.add(group.viewColumn);
      const groupTabs = ctx.snapshotByVC.get(group.viewColumn);
      if (!groupTabs) continue;

      for (const [tab] of groupTabs) {
        if (ctx.processed.has(tab)) continue;
        if (ctx.snapshot.has(tab) && !ctx.freshByRef.has(tab)) {
          ctx.closed.push(tab);
          ctx.processed.add(tab);
        }
      }
    }
  }

  /**
   * Stage 2: Opened groups — direct tab opens.
   *
   * Iterate new groups' tabs. If a tab isn't already tracked, emit an open.
   */
  private _stageOpenedGroups(ctx: GeneratorContext): void {
    for (const group of ctx.groupEvent.opened) {
      ctx.openedViewColumns.add(group.viewColumn);
      const freshGroupTabs = ctx.freshByVC.get(group.viewColumn);
      if (!freshGroupTabs) continue;

      for (const [tab] of freshGroupTabs) {
        if (ctx.processed.has(tab)) continue;
        if (!ctx.snapshot.has(tab) && ctx.freshByRef.has(tab)) {
          ctx.opened.push(tab);
          ctx.processed.add(tab);
        }
      }
    }
  }

  /**
   * Stage 3: Cascading VC shifts from structural changes.
   *
   * Closing a group shifts groups to its right LEFT; opening shifts RIGHT.
   * For opens, the group currently occupying the opened column also shifts
   * right when VS Code inserts the new group before it.
   */
  private _stageCascadingVCShifts(ctx: GeneratorContext): void {
    if (ctx.closedViewColumns.size === 0 && ctx.openedViewColumns.size === 0) return;

    const openedViewColumns = [...ctx.openedViewColumns];
    const closedViewColumns = [...ctx.closedViewColumns];

    for (const [vc, groupTabs] of ctx.snapshotByVC) {
      const affectedByOpen = openedViewColumns.some((openedVC) => vc >= openedVC);
      const affectedByClose = closedViewColumns.some((closedVC) => vc > closedVC);

      if (!affectedByOpen && !affectedByClose) {
        continue;
      }

      for (const [tab, oldEntry] of groupTabs) {
        if (ctx.processed.has(tab)) continue;
        const newEntry = ctx.freshByRef.get(tab);
        if (!newEntry) continue;
        if (newEntry.viewColumn !== oldEntry.viewColumn) {
          ctx.closed.push(tab);
          ctx.opened.push(tab);
          ctx.processed.add(tab);
        }
      }
    }
  }

  /**
   * Stage 4: Changed groups — remaining diffs.
   *
   * After cascade handling, compare snapshot vs freshByRef entries to
   * detect cross-group moves, property changes, and new tabs.
   *
   * NOTE: We iterate snapshot/freshByRef Tab refs — NOT the event's
   * group.tabs — because VS Code's onDidChangeTabGroups provides
   * different Tab object instances than window.tabGroups.all snapshots.
   */
  private _stageChangedGroups(ctx: GeneratorContext): void {
    const changedViewColumns = new Set(
      ctx.groupEvent.changed.map((g) => g.viewColumn),
    );

    this._log.info(
      `stageChangedGroups: changedVCs=[${[...changedViewColumns].join(',')}] snapshot=${ctx.snapshot.size} freshByRef=${ctx.freshByRef.size}`,
    );

    // Pass 1: Tabs in changed VCs — detect viewColumn changes and property diffs.
    // Only iterate groups that VS Code reported as changed instead of the full snapshot.
    for (const vc of changedViewColumns) {
      const groupTabs = ctx.snapshotByVC.get(vc);
      if (!groupTabs) continue;
      for (const [tab, oldEntry] of groupTabs) {
        if (ctx.processed.has(tab)) continue;

        const newEntry = ctx.freshByRef.get(tab);
        if (!newEntry) continue;

        if (oldEntry.viewColumn !== newEntry.viewColumn) {
          this._log.info(`  tab "${tab.label}": vc ${oldEntry.viewColumn} → ${newEntry.viewColumn} — cross-group move`);
          ctx.closed.push(tab);
          ctx.opened.push(tab);
          ctx.processed.add(tab);
          continue;
        }

        const diff = ctx.computationCache.diffFull(newEntry, oldEntry);
        if (diff.size > 0) {
          this._log.info(`  tab "${tab.label}": vc=${oldEntry.viewColumn} property changes: ${[...diff].join(',')}`);
          ctx.changed.push(tab);
          ctx.processed.add(tab);
        }
      }
    }

    // Pass 2: Tabs in freshByRef but not in snapshot — new tabs in changed groups.
    // Only iterate fresh entries in changed VCs.
    for (const vc of changedViewColumns) {
      const freshGroupTabs = ctx.freshByVC.get(vc);
      if (!freshGroupTabs) continue;
      for (const [tab, newEntry] of freshGroupTabs) {
        if (ctx.processed.has(tab)) continue;
        if (ctx.snapshot.has(tab)) continue;

        this._log.info(`  tab "${tab.label}": NOT in snapshot — classifying as opened (newVC=${newEntry.viewColumn})`);
        ctx.opened.push(tab);
        ctx.processed.add(tab);
      }
    }
  }

  /**
   * Stage 5: Classify moves from close+open pairs.
   *
   * A Tab ref present in both closed and opened = known move.
   * Extract those pairs into the `moved` array so processEvent()
   * can record them as pre-matched move ops.
   */
  private _stageClassifyMoves(ctx: GeneratorContext): void {
    const closedSet = new Set(ctx.closed);
    const openedSet = new Set(ctx.opened);

    const movedTabs = new Set<Tab>();
    for (const tab of closedSet) {
      if (openedSet.has(tab)) {
        movedTabs.add(tab);
      }
    }

    if (movedTabs.size === 0) return;

    ctx.closed = ctx.closed.filter((t) => !movedTabs.has(t));
    ctx.opened = ctx.opened.filter((t) => !movedTabs.has(t));
    ctx.moved.push(...movedTabs);
  }
}
