import { Disposable } from 'vscode';

import {
  BaseWebviewMessage,
  WebviewAssignQuickSlotMessage,
  WebviewDeleteGroupMessage,
  WebviewDeleteHistoryMessage,
  WebviewMessageType,
  WebviewNewGroupMessage,
  WebviewRecoverStateMessage,
  WebviewRenameGroupMessage,
  WebviewSelectWorkspaceFolderMessage,
  WebviewSwitchGroupMessage,
  WebviewTabCloseMessage,
  WebviewTabOpenMessage,
  WebviewTabTogglePinMessage,
  WebviewUpdateGitIntegrationMessage
} from '../types/messages';
import { ITabManagerService } from '../types/tab-manager';

export class MessageHandler implements Disposable {
  private _tabManager: ITabManagerService;

  constructor(tabManager: ITabManagerService) {
    this._tabManager = tabManager;
  }

  async handle(data: BaseWebviewMessage) {
    const tabManager = this._tabManager;

    switch (data.type) {
      case WebviewMessageType.TabOpen: {
        const { columnView, index } = data as WebviewTabOpenMessage;
        await tabManager.openTab(columnView, index);
        break;
      }
      case WebviewMessageType.TabClose: {
        const { columnView, index } = data as WebviewTabCloseMessage;
        await tabManager.closeTab(columnView, index);
        break;
      }
      case WebviewMessageType.ClearAllTabs: {
        await tabManager.clearAllTabs();
        break;
      }
      case WebviewMessageType.TabTogglePin: {
        const { columnView, index } = data as WebviewTabTogglePinMessage;
        await tabManager.toggleTabPin(columnView, index);
        break;
      }
      case WebviewMessageType.SwitchGroup: {
        const { groupId } = data as WebviewSwitchGroupMessage;
        await tabManager.switchToGroup(groupId);
        break;
      }
      case WebviewMessageType.NewGroup: {
        const { groupId } = data as WebviewNewGroupMessage;
        await tabManager.createGroup(groupId);
        break;
      }
      case WebviewMessageType.RenameGroup: {
        const { groupId, name } = data as WebviewRenameGroupMessage;
        await tabManager.renameGroup(groupId, name);
        break;
      }
      case WebviewMessageType.DeleteGroup: {
        const { groupId } = data as WebviewDeleteGroupMessage;
        await tabManager.deleteGroup(groupId);
        break;
      }
      case WebviewMessageType.AddToHistory: {
        await tabManager.takeSnapshot();
        break;
      }
      case WebviewMessageType.RecoverState: {
        const { historyId } = data as WebviewRecoverStateMessage;
        await tabManager.recoverSnapshot(historyId);
        break;
      }
      case WebviewMessageType.DeleteHistory: {
        const { historyId } = data as WebviewDeleteHistoryMessage;
        await tabManager.deleteSnapshot(historyId);
        break;
      }
      case WebviewMessageType.AssignQuickSlot: {
        const { slot, groupId } = data as WebviewAssignQuickSlotMessage;
        await tabManager.assignQuickSlot(slot, groupId);
        break;
      }
      case WebviewMessageType.SelectWorkspaceFolder: {
        const { folderPath } = data as WebviewSelectWorkspaceFolderMessage;
        await tabManager.selectWorkspaceFolder(folderPath);
        break;
      }
      case WebviewMessageType.ClearWorkspaceFolder: {
        await tabManager.clearWorkspaceFolder();
        break;
      }
      case WebviewMessageType.UpdateGitIntegration: {
        const { enabled, mode, groupPrefix } =
          data as WebviewUpdateGitIntegrationMessage;
        if (enabled != null)
          await tabManager.config.setGitIntegrationEnabled(enabled);
        if (mode != null) await tabManager.config.setGitIntegrationMode(mode);
        if (groupPrefix != null)
          await tabManager.config.setGitIntegrationGroupPrefix(groupPrefix);
        await tabManager.triggerSync();
        break;
      }
      case WebviewMessageType.Sync: {
        await tabManager.triggerSync();
        break;
      }
      default:
        console.warn('Unknown message type received from webview:', data.type);
    }
  }

  dispose() {
    this._tabManager = null;
  }
}
