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

  refreshTabs(): void {
    const message: WebviewSyncMessage = {
      type: WebviewMessageType.Sync
    };
    this.messenger.sendMessage(message);
  }

  openTab(index: number, columnView: number): void {
    const message: WebviewTabOpenMessage = {
      type: WebviewMessageType.TabOpen,
      index,
      columnView
    };
    this.messenger.sendMessage(message);
  }

  closeTab(index: number, columnView: number): void {
    const message: WebviewTabCloseMessage = {
      type: WebviewMessageType.TabClose,
      index,
      columnView
    };
    this.messenger.sendMessage(message);
  }

  clearAllTabs(): void {
    const message: WebviewClearAllTabsMessage = {
      type: WebviewMessageType.ClearAllTabs
    };
    this.messenger.sendMessage(message);
  }

  toggleTabPin(index: number, columnView: number): void {
    const message: WebviewTabTogglePinMessage = {
      type: WebviewMessageType.TabTogglePin,
      index,
      columnView
    };
    this.messenger.sendMessage(message);
  }

  switchToGroup(groupId: string | null): void {
    const message: WebviewSwitchGroupMessage = {
      type: WebviewMessageType.SwitchGroup,
      groupId
    };
    this.messenger.sendMessage(message);
  }

  createGroup(groupId: string): void {
    const message: WebviewNewGroupMessage = {
      type: WebviewMessageType.NewGroup,
      groupId
    };
    this.messenger.sendMessage(message);
  }

  renameGroup(groupId: string, newName: string): void {
    const message: WebviewRenameGroupMessage = {
      type: WebviewMessageType.RenameGroup,
      groupId,
      name: newName
    };
    this.messenger.sendMessage(message);
  }

  deleteGroup(groupId: string): void {
    const message: WebviewDeleteGroupMessage = {
      type: WebviewMessageType.DeleteGroup,
      groupId
    };
    this.messenger.sendMessage(message);
  }

  addToHistory(label?: string): void {
    const message: WebviewAddToHistoryMessage = {
      type: WebviewMessageType.AddToHistory,
      label
    };
    this.messenger.sendMessage(message);
  }

  deleteHistory(historyId: string): void {
    const message: WebviewDeleteHistoryMessage = {
      type: WebviewMessageType.DeleteHistory,
      historyId
    };
    this.messenger.sendMessage(message);
  }

  recoverState(historyId: string): void {
    const message: WebviewRecoverStateMessage = {
      type: WebviewMessageType.RecoverState,
      historyId
    };
    this.messenger.sendMessage(message);
  }

  assignQuickSlot(slot: QuickSlotIndex, groupId: string | null): void {
    const message: WebviewAssignQuickSlotMessage = {
      type: WebviewMessageType.AssignQuickSlot,
      slot,
      groupId
    };
    this.messenger.sendMessage(message);
  }

  selectWorkspaceFolder(folderPath: string | null): void {
    const message: WebviewSelectWorkspaceFolderMessage = {
      type: WebviewMessageType.SelectWorkspaceFolder,
      folderPath
    };
    this.messenger.sendMessage(message);
  }

  clearWorkspaceFolder(): void {
    const message: WebviewClearWorkspaceFolderMessage = {
      type: WebviewMessageType.ClearWorkspaceFolder
    };
    this.messenger.sendMessage(message);
  }

  updateGitIntegration(config: {
    enabled?: boolean;
    mode?: string;
    groupPrefix?: string;
  }): void {
    this.messenger.sendMessage({
      type: WebviewMessageType.UpdateGitIntegration,
      ...config
    });
  }

  createAddon(name: string): void {
    const message: WebviewCreateAddonMessage = {
      type: WebviewMessageType.NewAddon,
      name
    };
    this.messenger.sendMessage(message);
  }

  deleteAddon(addonId: string): void {
    const message: WebviewDeleteAddonMessage = {
      type: WebviewMessageType.DeleteAddon,
      addonId
    };
    this.messenger.sendMessage(message);
  }

  applyAddon(addonId: string): void {
    const message: WebviewApplyAddonMessage = {
      type: WebviewMessageType.ApplyAddon,
      addonId
    };
    this.messenger.sendMessage(message);
  }

  renameAddon(addonId: string, newName: string): void {
    const message: WebviewRenameAddonMessage = {
      type: WebviewMessageType.RenameAddon,
      addonId,
      name: newName
    };
    this.messenger.sendMessage(message);
  }

  exportStateFile(): void {
    const message: WebviewExportStateFileMessage = {
      type: WebviewMessageType.ExportStateFile
    };
    this.messenger.sendMessage(message);
  }

  importStateFile(): void {
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
