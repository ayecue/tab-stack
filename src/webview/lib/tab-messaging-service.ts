import {
  WebviewAddToHistoryMessage,
  WebviewAssignQuickSlotMessage,
  WebviewDeleteGroupMessage,
  WebviewDeleteHistoryMessage,
  WebviewMessageType,
  WebviewNewGroupMessage,
  WebviewRenameGroupMessage,
  WebviewRecoverStateMessage,
  WebviewSwitchGroupMessage,
  WebviewSyncMessage,
  WebviewTabCloseMessage,
  WebviewTabOpenMessage,
  WebviewTabTogglePinMessage
} from '../../types/messages';
import { QuickSlotIndex } from '../../types/tab-manager';
import { VSCodeMessenger } from './vscode-messenger';

export class TabMessagingService {
  private messenger: VSCodeMessenger;

  constructor(messenger: VSCodeMessenger) {
    this.messenger = messenger;
  }

  async refreshTabs(): Promise<void> {
    const message: WebviewSyncMessage = {
      type: WebviewMessageType.Sync
    };
    this.messenger.sendMessage(message);
  }

  async openTab(index: number, columnView: number): Promise<void> {
    const message: WebviewTabOpenMessage = {
      type: WebviewMessageType.TabOpen,
      index,
      columnView
    };
    this.messenger.sendMessage(message);
  }

  async closeTab(index: number, columnView: number): Promise<void> {
    const message: WebviewTabCloseMessage = {
      type: WebviewMessageType.TabClose,
      index,
      columnView
    };
    this.messenger.sendMessage(message);
  }

  async toggleTabPin(index: number, columnView: number): Promise<void> {
    const message: WebviewTabTogglePinMessage = {
      type: WebviewMessageType.TabTogglePin,
      index,
      columnView
    };
    this.messenger.sendMessage(message);
  }

  async switchToGroup(groupId: string | null): Promise<void> {
    const message: WebviewSwitchGroupMessage = {
      type: WebviewMessageType.SwitchGroup,
      groupId
    };
    this.messenger.sendMessage(message);
  }

  async createGroup(groupId: string): Promise<void> {
    const message: WebviewNewGroupMessage = {
      type: WebviewMessageType.NewGroup,
      groupId
    };
    this.messenger.sendMessage(message);
  }

  async renameGroup(groupId: string, nextGroupId: string): Promise<void> {
    const message: WebviewRenameGroupMessage = {
      type: WebviewMessageType.RenameGroup,
      groupId,
      nextGroupId
    };
    this.messenger.sendMessage(message);
  }

  async deleteGroup(groupId: string): Promise<void> {
    const message: WebviewDeleteGroupMessage = {
      type: WebviewMessageType.DeleteGroup,
      groupId
    };
    this.messenger.sendMessage(message);
  }

  async addToHistory(label?: string): Promise<void> {
    const message: WebviewAddToHistoryMessage = {
      type: WebviewMessageType.AddToHistory,
      label
    };
    this.messenger.sendMessage(message);
  }

  async deleteHistory(historyId: string): Promise<void> {
    const message: WebviewDeleteHistoryMessage = {
      type: WebviewMessageType.DeleteHistory,
      historyId
    };
    this.messenger.sendMessage(message);
  }

  async recoverState(historyId: string): Promise<void> {
    const message: WebviewRecoverStateMessage = {
      type: WebviewMessageType.RecoverState,
      historyId
    };
    this.messenger.sendMessage(message);
  }

  async assignQuickSlot(
    slot: QuickSlotIndex,
    groupId: string | null
  ): Promise<void> {
    const message: WebviewAssignQuickSlotMessage = {
      type: WebviewMessageType.AssignQuickSlot,
      slot,
      groupId
    };
    this.messenger.sendMessage(message);
  }

  getMessenger(): VSCodeMessenger {
    return this.messenger;
  }
}

/**
 * Create a new tab messaging service
 */
export function createTabMessagingService(
  messenger: VSCodeMessenger
): TabMessagingService {
  return new TabMessagingService(messenger);
}
