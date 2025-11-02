import {
  WebviewAddToHistoryMessage,
  WebviewApplyAddonMessage,
  WebviewAssignQuickSlotMessage,
  WebviewClearAllTabsMessage,
  WebviewClearWorkspaceFolderMessage,
  WebviewCreateAddonMessage,
  WebviewDeleteAddonMessage,
  WebviewDeleteGroupMessage,
  WebviewDeleteHistoryMessage,
  WebviewExportStateFileMessage,
  WebviewImportStateFileMessage,
  WebviewMessageType,
  WebviewNewGroupMessage,
  WebviewRecoverStateMessage,
  WebviewRenameAddonMessage,
  WebviewRenameGroupMessage,
  WebviewSelectWorkspaceFolderMessage,
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

  async clearAllTabs(): Promise<void> {
    const message: WebviewClearAllTabsMessage = {
      type: WebviewMessageType.ClearAllTabs
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

  async renameGroup(groupId: string, newName: string): Promise<void> {
    const message: WebviewRenameGroupMessage = {
      type: WebviewMessageType.RenameGroup,
      groupId,
      name: newName
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

  async selectWorkspaceFolder(folderPath: string | null): Promise<void> {
    const message: WebviewSelectWorkspaceFolderMessage = {
      type: WebviewMessageType.SelectWorkspaceFolder,
      folderPath
    };
    this.messenger.sendMessage(message);
  }

  async clearWorkspaceFolder(): Promise<void> {
    const message: WebviewClearWorkspaceFolderMessage = {
      type: WebviewMessageType.ClearWorkspaceFolder
    };
    this.messenger.sendMessage(message);
  }

  async updateGitIntegration(config: {
    enabled?: boolean;
    mode?: string;
    groupPrefix?: string;
  }): Promise<void> {
    this.messenger.sendMessage({
      type: WebviewMessageType.UpdateGitIntegration,
      ...config
    });
  }

  async createAddon(name: string): Promise<void> {
    const message: WebviewCreateAddonMessage = {
      type: WebviewMessageType.NewAddon,
      name
    };
    this.messenger.sendMessage(message);
  }

  async deleteAddon(addonId: string): Promise<void> {
    const message: WebviewDeleteAddonMessage = {
      type: WebviewMessageType.DeleteAddon,
      addonId
    };
    this.messenger.sendMessage(message);
  }

  async applyAddon(addonId: string): Promise<void> {
    const message: WebviewApplyAddonMessage = {
      type: WebviewMessageType.ApplyAddon,
      addonId
    };
    this.messenger.sendMessage(message);
  }

  async renameAddon(addonId: string, newName: string): Promise<void> {
    const message: WebviewRenameAddonMessage = {
      type: WebviewMessageType.RenameAddon,
      addonId,
      name: newName
    };
    this.messenger.sendMessage(message);
  }

  async exportStateFile(): Promise<void> {
    const message: WebviewExportStateFileMessage = {
      type: WebviewMessageType.ExportStateFile
    };
    this.messenger.sendMessage(message);
  }

  async importStateFile(): Promise<void> {
    const message: WebviewImportStateFileMessage = {
      type: WebviewMessageType.ImportStateFile
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
