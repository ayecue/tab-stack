import { ConfigService } from "../services/config";
import { OpenTabResult, TabInfo, TabInfoCustom, TabInfoNotebook, TabInfoNotebookDiff, TabInfoText, TabInfoTextDiff, TabKind } from "../types/tabs";
import { getLogger, ScopedLogger } from "../services/logger";
import { TabCreationTaskCustomCommand, TabCreationTaskTabInputCustom, TabCreationTaskTabInputNotebook, TabCreationTaskTabInputNotebookDiff, TabCreationTaskTabInputText, TabCreationTaskTabInputTextDiff } from "./tab-creation-task";
import { TabCreationTaskMediator } from "../mediators/tab-creation-task";

export class TabFactory {
  private _configService: ConfigService;
  private _log: ScopedLogger;
  private _queue: TabCreationTaskMediator[] = [];
  private _processing: boolean = false;

  constructor(configService: ConfigService) {
    this._log = getLogger().child('TabFactory');
    this._configService = configService;
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

  private findRecoveryCommandForTab(tabInfo: TabInfo): string | null {
    const mappings = this._configService.getTabRecoveryMappings();

    for (const [pattern, command] of Object.entries(mappings)) {
      try {
        const regex = new RegExp(pattern);
        if (regex.test(tabInfo.label)) {
          return command;
        }
      } catch (error) {
        this._log.error(
          `invalid regex pattern "${pattern}" in tab recovery mappings - skipping`,
          error
        );
      }
    }

    return null;
  }

  private _buildTabCreationTask(tabInfo: TabInfo): TabCreationTaskMediator | null {
    switch (tabInfo.kind) {
      case TabKind.TabInputText:
        return new TabCreationTaskMediator(new TabCreationTaskTabInputText(tabInfo as TabInfoText));
      case TabKind.TabInputTextDiff:
        return new TabCreationTaskMediator(new TabCreationTaskTabInputTextDiff(tabInfo as TabInfoTextDiff));
      case TabKind.TabInputCustom:
        return new TabCreationTaskMediator(new TabCreationTaskTabInputCustom(tabInfo as TabInfoCustom));
      case TabKind.TabInputNotebook:
        return new TabCreationTaskMediator(new TabCreationTaskTabInputNotebook(tabInfo as TabInfoNotebook));
      case TabKind.TabInputNotebookDiff:
        return new TabCreationTaskMediator(new TabCreationTaskTabInputNotebookDiff(tabInfo as TabInfoNotebookDiff));
      case TabKind.TabInputTerminal:
      case TabKind.TabInputWebview:
      case TabKind.Unknown:
      default:
        const command = this.findRecoveryCommandForTab(tabInfo);
        if (command == null) {
          this._log.warn(`no recovery command found for tab "${tabInfo.label}" of kind "${tabInfo.kind}"`);
          return null;
        }
        return new TabCreationTaskMediator(new TabCreationTaskCustomCommand(tabInfo, command));
    }
  }

  openTab(tabInfo: TabInfo): Promise<OpenTabResult> {
    if (tabInfo.kind == null) {
      return Promise.resolve({ success: false, handle: null, tab: null });
    }

    const task = this._buildTabCreationTask(tabInfo);

    if (task == null) {
      return Promise.resolve({ success: false, handle: null, tab: null });
    }

    this._queue.push(task);
    void this._processQueue();

    return task.getRelevantPromise();
  }
}