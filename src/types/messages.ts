import { QuickSlotAssignments, QuickSlotIndex } from './tab-manager';
import { TabState } from './tabs';

export enum ExtensionMessageType {
  Sync = 'sync',
  Notification = 'notification'
}

export enum ExtensionNotificationKind {
  Error = 'error',
  Info = 'info',
  Warning = 'warning'
}

export interface BaseExtensionMessage {
  type: ExtensionMessageType;
}

export interface ExtensionNotificationMessage extends BaseExtensionMessage {
  type: ExtensionMessageType.Notification;
  kind: ExtensionNotificationKind;
  message: string;
}

export interface ExtensionTabsSyncMessage extends BaseExtensionMessage {
  type: ExtensionMessageType.Sync;
  tabState: TabState;
  histories: Array<{ historyId: string; name: string }>;
  groups: Array<{ groupId: string; name: string }>;
  selectedGroup: string | null;
  quickSlots: QuickSlotAssignments;
  masterWorkspaceFolder: string | null;
  availableWorkspaceFolders: Array<{ name: string; path: string }>;
}

export enum WebviewMessageType {
  TabOpen = 'tab-open',
  TabClose = 'tab-close',
  ClearAllTabs = 'clear-all-tabs',
  TabTogglePin = 'tab-toggle-pin',
  SwitchGroup = 'switch-group',
  NewGroup = 'new-group',
  RenameGroup = 'rename-group',
  DeleteGroup = 'delete-group',
  AddToHistory = 'add-to-history',
  DeleteHistory = 'delete-history',
  RecoverState = 'recover-state',
  AssignQuickSlot = 'assign-quick-slot',
  Sync = 'sync',
  SelectWorkspaceFolder = 'select-workspace-folder',
  ClearWorkspaceFolder = 'clear-workspace-folder'
}

export interface BaseWebviewMessage {
  type: WebviewMessageType;
}

export interface WebviewTabOpenMessage extends BaseWebviewMessage {
  type: WebviewMessageType.TabOpen;
  index: number;
  columnView: number;
}

export interface WebviewTabCloseMessage extends BaseWebviewMessage {
  type: WebviewMessageType.TabClose;
  index: number;
  columnView: number;
}

export interface WebviewClearAllTabsMessage extends BaseWebviewMessage {
  type: WebviewMessageType.ClearAllTabs;
}

export interface WebviewTabTogglePinMessage extends BaseWebviewMessage {
  type: WebviewMessageType.TabTogglePin;
  index: number;
  columnView: number;
}

export interface WebviewSwitchGroupMessage extends BaseWebviewMessage {
  type: WebviewMessageType.SwitchGroup;
  groupId: string | null;
}

export interface WebviewNewGroupMessage extends BaseWebviewMessage {
  type: WebviewMessageType.NewGroup;
  groupId: string;
}

export interface WebviewRenameGroupMessage extends BaseWebviewMessage {
  type: WebviewMessageType.RenameGroup;
  groupId: string;
  name: string;
}

export interface WebviewDeleteGroupMessage extends BaseWebviewMessage {
  type: WebviewMessageType.DeleteGroup;
  groupId: string;
}

export interface WebviewAddToHistoryMessage extends BaseWebviewMessage {
  type: WebviewMessageType.AddToHistory;
  label?: string;
}

export interface WebviewDeleteHistoryMessage extends BaseWebviewMessage {
  type: WebviewMessageType.DeleteHistory;
  historyId: string;
}

export interface WebviewRecoverStateMessage extends BaseWebviewMessage {
  type: WebviewMessageType.RecoverState;
  historyId: string;
}

export interface WebviewAssignQuickSlotMessage extends BaseWebviewMessage {
  type: WebviewMessageType.AssignQuickSlot;
  slot: QuickSlotIndex;
  groupId: string | null;
}

export interface WebviewSyncMessage extends BaseWebviewMessage {
  type: WebviewMessageType.Sync;
}

export interface WebviewSelectWorkspaceFolderMessage
  extends BaseWebviewMessage {
  type: WebviewMessageType.SelectWorkspaceFolder;
  folderPath: string | null;
}

export interface WebviewClearWorkspaceFolderMessage extends BaseWebviewMessage {
  type: WebviewMessageType.ClearWorkspaceFolder;
}
