import { window } from "vscode";
import { OpenTabResult, TabInfo, TabInfoCustom, TabInfoNotebook, TabInfoNotebookDiff, TabInfoTerminal, TabInfoText, TabInfoTextDiff, TabKind } from "../types/tabs";
import { getLogger, ScopedLogger } from "../services/logger";
import { TabCreationTask, TabCreationTaskCustomCommand, TabCreationTaskTabInputCustom, TabCreationTaskTabInputNotebook, TabCreationTaskTabInputNotebookDiff, TabCreationTaskTabInputTerminal, TabCreationTaskTabInputText, TabCreationTaskTabInputTextDiff } from "./tab-creation-task";
import { TabCreationOperation } from "../operations/tab-creation";
import { MoveTabToEndOperation } from "../operations/move-tab-to-end";
import { TabOperation } from "../operations/tab-operation";
import { TabRecoveryService } from "../services/tab-recovery-resolver";

export class TabFactory {
  private _recoveryResolver: TabRecoveryService;
  private _log: ScopedLogger;
  private _queue: TabOperation[] = [];
  private _processing: boolean = false;

  constructor(recoveryResolver: TabRecoveryService) {
    this._log = getLogger().child('TabFactory');
    this._recoveryResolver = recoveryResolver;
  }

  private async _processQueue(): Promise<void> {
    if (this._processing) return;
    this._processing = true;

    while (this._queue.length > 0) {
      const task = this._queue.shift()!;
      try {
        await task.execute();
      } catch (err) {
        this._log.error(`unexpected error processing task: ${task.getDescription()}`, err);
      }
    }

    this._processing = false;
  }

  private _buildRawTask(tabInfo: TabInfo): TabCreationTask | null {
    switch (tabInfo.kind) {
      case TabKind.TabInputText:
        return new TabCreationTaskTabInputText(tabInfo as TabInfoText);
      case TabKind.TabInputTextDiff:
        return new TabCreationTaskTabInputTextDiff(tabInfo as TabInfoTextDiff);
      case TabKind.TabInputCustom:
        return new TabCreationTaskTabInputCustom(tabInfo as TabInfoCustom);
      case TabKind.TabInputNotebook:
        return new TabCreationTaskTabInputNotebook(tabInfo as TabInfoNotebook);
      case TabKind.TabInputNotebookDiff:
        return new TabCreationTaskTabInputNotebookDiff(tabInfo as TabInfoNotebookDiff);
      case TabKind.TabInputTerminal:
        return new TabCreationTaskTabInputTerminal(tabInfo as TabInfoTerminal);
      case TabKind.TabInputWebview:
      case TabKind.Unknown:
      default:
        const recovery = this._recoveryResolver.findMatch(tabInfo);
        if (recovery == null) {
          this._log.warn(`no recovery command found for tab "${tabInfo.label}" of kind "${tabInfo.kind}"`);
          return null;
        }
        return new TabCreationTaskCustomCommand(tabInfo, recovery.command, recovery.args, recovery.nextTickDelay);
    }
  }

  openTab(tabInfo: TabInfo): Promise<OpenTabResult> {
    if (tabInfo.kind == null) {
      return Promise.resolve({ success: false, handle: null, tab: null });
    }

    const rawTask = this._buildRawTask(tabInfo);

    if (rawTask == null) {
      return Promise.resolve({ success: false, handle: null, tab: null });
    }

    const allRelevantTabs = window.tabGroups.all[tabInfo.viewColumn - 1].tabs;
    const existingTab = rawTask.findExistingTab(allRelevantTabs);

    if (existingTab) {
      this._log.info(`tab already exists: "${existingTab.label}" in column ${existingTab.group.viewColumn}, moving to end`);
      const moveOp = new MoveTabToEndOperation(existingTab, this._log);
      this._queue.push(moveOp);
      void this._processQueue();
      return moveOp.getRelevantPromise();
    }

    const creationOp = new TabCreationOperation(rawTask);
    this._queue.push(creationOp);
    void this._processQueue();

    return creationOp.getRelevantPromise();
  }
}