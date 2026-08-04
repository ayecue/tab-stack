import { window } from 'vscode';
import {
  OpenTabResult,
  TabInfo,
  TabInfoCustom,
  TabInfoNotebook,
  TabInfoNotebookDiff,
  TabInfoTerminal,
  TabInfoText,
  TabInfoTextDiff,
  TabKind
} from '../types/tabs';
import { getLogger, ScopedLogger } from '../services/logger';
import {
  TabCreationTask,
  TabCreationTaskCursorEditorOpenWith,
  TabCreationTaskCustomCommand,
  TabCreationTaskTabInputCustom,
  TabCreationTaskTabInputNotebook,
  TabCreationTaskTabInputNotebookDiff,
  TabCreationTaskTabInputTerminal,
  TabCreationTaskTabInputText,
  TabCreationTaskTabInputTextDiff
} from './tab-creation-task';
import { TabCreationOperation } from '../operations/tab-creation';
import { TabOperation } from '../operations/tab-operation';
import { TabRecoveryService } from '../services/tab-recovery-resolver';
import {
  CURSOR_PLAN_EDITOR_ID,
  CURSOR_PLAN_SCHEME,
  inferCursorEditorViewType
} from '../utils/cursor-editors';

function getTabUri(tabInfo: TabInfo): string | undefined {
  return 'uri' in tabInfo && typeof tabInfo.uri === 'string'
    ? tabInfo.uri
    : undefined;
}

function getTabViewType(tabInfo: TabInfo): string | undefined {
  return 'viewType' in tabInfo && typeof tabInfo.viewType === 'string'
    ? tabInfo.viewType
    : undefined;
}

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
        this._log.error(
          `unexpected error processing task: ${task.getDescription()}`,
          err
        );
      }
    }

    this._processing = false;
  }

  /** Cursor plan/canvas restore when we have a URI and can infer the editor id. */
  private _buildCursorEditorTask(tabInfo: TabInfo): TabCreationTask | null {
    const uri = getTabUri(tabInfo);
    if (!uri) {
      return null;
    }

    const editorId = inferCursorEditorViewType({
      uri,
      viewType: getTabViewType(tabInfo),
      label: tabInfo.label
    });

    if (!editorId) {
      return null;
    }

    return new TabCreationTaskCursorEditorOpenWith({
      label: tabInfo.label,
      uri,
      viewType: editorId,
      viewColumn: tabInfo.viewColumn,
      resolvePlanUri:
        editorId === CURSOR_PLAN_EDITOR_ID &&
        uri.startsWith(`${CURSOR_PLAN_SCHEME}:`)
    });
  }

  private _buildRawTask(tabInfo: TabInfo): TabCreationTask | null {
    const cursorTask = this._buildCursorEditorTask(tabInfo);
    if (cursorTask) {
      return cursorTask;
    }

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
        return new TabCreationTaskTabInputNotebookDiff(
          tabInfo as TabInfoNotebookDiff
        );
      case TabKind.TabInputTerminal:
        return new TabCreationTaskTabInputTerminal(tabInfo as TabInfoTerminal);
      case TabKind.TabInputWebview:
      case TabKind.Unknown:
      default: {
        const recovery = this._recoveryResolver.findMatch(tabInfo);
        if (recovery == null) {
          this._log.warn(
            `no recovery command found for tab "${tabInfo.label}" of kind "${tabInfo.kind}"`
          );
          return null;
        }
        return new TabCreationTaskCustomCommand(
          tabInfo,
          recovery.command,
          recovery.args,
          recovery.nextTickDelay,
          recovery.unique
        );
      }
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

    const tabGroup = window.tabGroups.all[tabInfo.viewColumn - 1];
    const existingTab = tabGroup
      ? rawTask.findExistingTab(tabGroup.tabs)
      : undefined;

    if (existingTab) {
      this._log.info(
        `tab already exists: "${existingTab.label}" in column ${existingTab.group.viewColumn}, skipping creation`
      );
      return Promise.resolve({
        success: true,
        handle: null,
        tab: existingTab
      });
    }

    const creationOp = new TabCreationOperation(rawTask);
    this._queue.push(creationOp);
    void this._processQueue();

    return creationOp.getRelevantPromise();
  }
}
