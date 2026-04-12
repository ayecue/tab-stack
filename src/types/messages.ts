import { Layout } from './commands';
import {
  GitIntegrationConfig,
  GitIntegrationMode,
  StorageType,
  TabKindColors
} from './config';
import { QuickSlotAssignments, QuickSlotIndex } from './tab-manager';
import { TabKind, TabState } from './tabs';

export enum ExtensionMessageType {
  TabStateSync = 'tab-state-sync',
  CollectionsSync = 'collections-sync',
  ConfigSync = 'config-sync',
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

export interface CollectionTabSummary {
  label: string;
  kind: TabKind;
  uri?: string;
}

export interface CollectionSummaryBase {
  name: string;
  tabCount: number;
  columnCount: number;
  layout: Layout;
  tabsByColumn: CollectionTabSummary[][];
}

export interface GroupSummary extends CollectionSummaryBase {
  groupId: string;
}

export interface HistorySummary extends CollectionSummaryBase {
  historyId: string;
}

export interface AddonSummary extends CollectionSummaryBase {
  addonId: string;
}

export interface ExtensionTabStateSyncMessage extends BaseExtensionMessage {
  type: ExtensionMessageType.TabStateSync;
  tabState: TabState;
  selectedGroup: string | null;
  rendering: boolean;
}

export interface ExtensionCollectionsSyncMessage extends BaseExtensionMessage {
  type: ExtensionMessageType.CollectionsSync;
  groups: GroupSummary[];
  histories: HistorySummary[];
  addons: AddonSummary[];
  selectedGroup: string | null;
  quickSlots: QuickSlotAssignments;
}

export interface ExtensionConfigSyncMessage extends BaseExtensionMessage {
  type: ExtensionMessageType.ConfigSync;
  masterWorkspaceFolder: string | null;
  availableWorkspaceFolders: Array<{ name: string; path: string }>;
  gitIntegration: GitIntegrationConfig;
  historyMaxEntries: number;
  storageType: StorageType;
  tabKindColors: TabKindColors;
}

export enum WebviewMessageType {
  TabOpen = 'tab-open',
  TabClose = 'tab-close',
  ClearAllTabs = 'clear-all-tabs',
  TabTogglePin = 'tab-toggle-pin',
  TabMove = 'tab-move',
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
  ClearWorkspaceFolder = 'clear-workspace-folder',
  UpdateGitIntegration = 'update-git-integration',
  UpdateHistoryMaxEntries = 'update-history-max-entries',
  UpdateStorageType = 'update-storage-type',
  NewAddon = 'new-addon',
  RenameAddon = 'rename-addon',
  DeleteAddon = 'delete-addon',
  ApplyAddon = 'apply-addon',
  ExportStateFile = 'export-state-file',
  ImportStateFile = 'import-state-file',
  ExportGroup = 'export-group',
  ImportGroup = 'import-group',
  CloseOtherEditors = 'close-other-editors',
  CloseOtherEditorsInGroup = 'close-other-editors-in-group',
  CloseColumn = 'close-column',
  CloseColumnFilteredTabs = 'close-column-filtered-tabs',
  CloseColumnNonFilteredTabs = 'close-column-non-filtered-tabs',
  MoveColumn = 'move-column',
  MergeColumns = 'merge-columns',
  MoveTabsToNewColumn = 'move-tabs-to-new-column'
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

export interface WebviewTabMoveMessage extends BaseWebviewMessage {
  type: WebviewMessageType.TabMove;
  fromIndex: number;
  toIndex: number;
  fromColumnView: number;
  toColumnView: number;
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

export interface WebviewUpdateGitIntegrationMessage extends BaseWebviewMessage {
  type: WebviewMessageType.UpdateGitIntegration;
  enabled?: boolean;
  mode?: GitIntegrationMode;
  groupPrefix?: string;
}

export interface WebviewUpdateHistoryMaxEntriesMessage
  extends BaseWebviewMessage {
  type: WebviewMessageType.UpdateHistoryMaxEntries;
  maxEntries: number;
}

export interface WebviewUpdateStorageTypeMessage extends BaseWebviewMessage {
  type: WebviewMessageType.UpdateStorageType;
  storageType: StorageType;
}

export interface WebviewCreateAddonMessage extends BaseWebviewMessage {
  type: WebviewMessageType.NewAddon;
  name: string;
}

export interface WebviewDeleteAddonMessage extends BaseWebviewMessage {
  type: WebviewMessageType.DeleteAddon;
  addonId: string;
}

export interface WebviewApplyAddonMessage extends BaseWebviewMessage {
  type: WebviewMessageType.ApplyAddon;
  addonId: string;
}

export interface WebviewRenameAddonMessage extends BaseWebviewMessage {
  type: WebviewMessageType.RenameAddon;
  addonId: string;
  name: string;
}

export interface WebviewExportStateFileMessage extends BaseWebviewMessage {
  type: WebviewMessageType.ExportStateFile;
}

export interface WebviewImportStateFileMessage extends BaseWebviewMessage {
  type: WebviewMessageType.ImportStateFile;
}

export interface WebviewExportGroupMessage extends BaseWebviewMessage {
  type: WebviewMessageType.ExportGroup;
  groupId: string;
}

export interface WebviewImportGroupMessage extends BaseWebviewMessage {
  type: WebviewMessageType.ImportGroup;
}

export interface WebviewCloseOtherEditorsMessage extends BaseWebviewMessage {
  type: WebviewMessageType.CloseOtherEditors;
  index: number;
  columnView: number;
}

export interface WebviewCloseOtherEditorsInGroupMessage
  extends BaseWebviewMessage {
  type: WebviewMessageType.CloseOtherEditorsInGroup;
  index: number;
  columnView: number;
}

export interface WebviewCloseColumnMessage extends BaseWebviewMessage {
  type: WebviewMessageType.CloseColumn;
  viewColumn: number;
}

export interface WebviewCloseColumnFilteredTabsMessage
  extends BaseWebviewMessage {
  type: WebviewMessageType.CloseColumnFilteredTabs;
  viewColumn: number;
  indices: number[];
}

export interface WebviewCloseColumnNonFilteredTabsMessage
  extends BaseWebviewMessage {
  type: WebviewMessageType.CloseColumnNonFilteredTabs;
  viewColumn: number;
  indices: number[];
}

export interface WebviewMoveColumnMessage extends BaseWebviewMessage {
  type: WebviewMessageType.MoveColumn;
  fromViewColumn: number;
  toViewColumn: number;
}

export interface WebviewMergeColumnsMessage extends BaseWebviewMessage {
  type: WebviewMessageType.MergeColumns;
  fromViewColumn: number;
  toViewColumn: number;
}

export interface WebviewMoveTabsToNewColumnMessage extends BaseWebviewMessage {
  type: WebviewMessageType.MoveTabsToNewColumn;
  viewColumn: number;
  indices: number[];
}
