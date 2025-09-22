import { Disposable } from 'vscode';

import {
  BaseWebviewMessage,
  WebviewAssignQuickSlotMessage,
  WebviewDeleteGroupMessage,
  WebviewDeleteHistoryMessage,
  WebviewMessageType,
  WebviewNewGroupMessage,
  WebviewRecoverStateMessage,
  WebviewSwitchGroupMessage,
  WebviewTabCloseMessage,
  WebviewTabOpenMessage,
  WebviewTabTogglePinMessage
} from '../types/messages';
import { ITabManagerProvider } from '../types/tab-manager';

export class MessageHandlerProvider implements Disposable {
  private _tabManager: ITabManagerProvider;

  constructor(tabManager: ITabManagerProvider) {
    this._tabManager = tabManager;
  }

  async handle(data: BaseWebviewMessage) {
    const tabManager = this._tabManager;

    switch (data.type) {
      case WebviewMessageType.TabOpen: {
        const { columnView, uri } = data as WebviewTabOpenMessage;
        await tabManager.openTab(columnView, uri);
        break;
      }
      case WebviewMessageType.TabClose: {
        const { columnView, uri } = data as WebviewTabCloseMessage;
        await tabManager.closeTab(columnView, uri);
        break;
      }
      case WebviewMessageType.TabTogglePin: {
        const { columnView, uri } = data as WebviewTabTogglePinMessage;
        await tabManager.toggleTabPin(columnView, uri);
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
      case WebviewMessageType.RenameGroup:
        // await this.handleRenameGroup(data as WebviewRenameGroupMessage);
        break;
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
      case WebviewMessageType.Sync: {
        await tabManager.syncWebview();
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
