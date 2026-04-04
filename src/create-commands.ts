import {
  commands,
  Disposable,
  Uri,
  window
} from 'vscode';

import { TabManagerService } from './services/tab-manager';
import { EXTENSION_NAME } from './types/extension';
import { QuickSlotAssignments, StateContainer } from './types/tab-manager';
import {
  TabInfo,
  TabKind,
  TabState
} from './types/tabs';
import { GroupQuickPickItem, SavedTabQuickPickItem } from './types/commands';

function getQuickSlotByGroupId(
  quickSlots: QuickSlotAssignments,
  groupId: string
): string | null {
  const entry = Object.entries(quickSlots).find(
    ([_, assignedGroupId]) => assignedGroupId === groupId
  );

  return entry?.[0] ?? null;
}

function getGroupStats(group: StateContainer | { state?: TabManagerService['state']['stateContainer']['state'] | undefined }): {
  tabCount: number;
  columnCount: number;
} {
  const tabGroups = Object.values(group.state?.tabState.tabGroups ?? {});

  return {
    tabCount: tabGroups.reduce((count, tabGroup) => count + tabGroup.tabs.length, 0),
    columnCount: tabGroups.length
  };
}

function formatTabKind(kind: TabKind): string {
  switch (kind) {
    case TabKind.TabInputText:
      return 'Text';
    case TabKind.TabInputTextDiff:
      return 'Diff';
    case TabKind.TabInputCustom:
      return 'Custom';
    case TabKind.TabInputWebview:
      return 'Webview';
    case TabKind.TabInputNotebook:
      return 'Notebook';
    case TabKind.TabInputNotebookDiff:
      return 'Notebook Diff';
    case TabKind.TabInputTerminal:
      return 'Terminal';
    case TabKind.Unknown:
    default:
      return 'Unknown';
  }
}

function getTabDetail(tab: TabInfo): string {
  if ('uri' in tab) {
    return tab.uri;
  }

  if ('modifiedUri' in tab && 'originalUri' in tab) {
    return `${tab.modifiedUri} <- ${tab.originalUri}`;
  }

  if ('viewType' in tab) {
    return tab.viewType;
  }

  if (tab.kind === TabKind.TabInputTerminal && tab.meta.type === 'terminal') {
    return tab.meta.cwd ?? tab.meta.terminalName ?? tab.label;
  }

  return tab.label;
}

function getSavedTabs(tabState: TabState): TabInfo[] {
  return Object.values(tabState.tabGroups)
    .sort((left, right) => left.viewColumn - right.viewColumn)
    .flatMap((tabGroup) => tabGroup.tabs);
}

async function requestGroupId(
  tabManagerService: TabManagerService
): Promise<string | null> {
  const groups = tabManagerService.state.groups;
  const currentGroupId = tabManagerService.state.stateContainer?.id ?? null;
  const groupItems: GroupQuickPickItem[] = Object.values(groups)
    .sort((left, right) => (right.lastSelectedAt ?? 0) - (left.lastSelectedAt ?? 0))
    .map((group) => {
      const { tabCount, columnCount } = getGroupStats(group);
      const assignedSlot = getQuickSlotByGroupId(
        tabManagerService.state.quickSlots,
        group.id
      );

      const descriptionParts = [
        `${tabCount} tab${tabCount === 1 ? '' : 's'}`,
        `${columnCount} column${columnCount === 1 ? '' : 's'}`
      ];

      if (assignedSlot) {
        descriptionParts.push(`slot ${assignedSlot}`);
      }

      return {
        label: group.name,
        description: descriptionParts.join(' • '),
        detail:
          currentGroupId === group.id ? 'Currently selected group' : undefined,
        picked: currentGroupId === group.id,
        groupId: group.id
      };
    });

  if (groupItems.length === 0) {
    window.showWarningMessage('No groups available.');
    return null;
  }

  const selection = await window.showQuickPick(groupItems, {
    title: 'Select the group to apply',
    matchOnDescription: true,
    matchOnDetail: true,
    placeHolder: 'Search saved groups'
  });

  if (!selection) {
    window.showWarningMessage('Invalid group.');
    return null;
  }

  return selection.groupId;
}

async function requestNewGroupId(): Promise<string | null> {
  return await window.showInputBox({
    prompt: 'Name the new tab group',
    placeHolder: 'e.g. Sprint Planning'
  });
}

async function requestAddonId(
  tabManagerService: TabManagerService
): Promise<string | null> {
  const addons = tabManagerService.state.addons;
  const addonNames = Object.values(addons).map((addon) => addon.name);

  if (addonNames.length === 0) {
    window.showWarningMessage('No add-ons available.');
    return null;
  }

  const addonName = await window.showQuickPick(addonNames, {
    title: 'Select the add-on to apply'
  });

  if (!addonName) {
    window.showWarningMessage('Invalid add-on.');
    return null;
  }

  const addonId = Object.values(addons).find(
    (addon) => addon.name === addonName
  )?.id;

  return addonId ?? null;
}

async function requestNewAddonName(): Promise<string | null> {
  return await window.showInputBox({
    prompt: 'Name the new add-on (applies without replacing)',
    placeHolder: 'e.g. Debugging Tools'
  });
}

async function requestSnapshotId(
  tabManagerService: TabManagerService
): Promise<string | null> {
  const snapshots = tabManagerService.state.history;
  const snapshotNames = Object.values(snapshots).map(
    (snapshot) => snapshot.name
  );

  if (snapshotNames.length === 0) {
    window.showWarningMessage('No snapshots available.');
    return null;
  }

  const historyName = await window.showQuickPick(snapshotNames, {
    title: 'Select snapshot to restore'
  });

  if (!historyName) {
    window.showWarningMessage('Invalid snapshot.');
    return null;
  }

  const historyId = Object.values(snapshots).find(
    (snapshot) => snapshot.name === historyName
  )?.id;

  return historyId;
}

async function requestSlotIndex(): Promise<number | null> {
  const slotOptions = new Array(9).fill(0).map((_, index) => ({
    label: `${index + 1}`,
    description: `Slot ${index + 1}`
  }));
  const slotSelection = await window.showQuickPick(slotOptions, {
    title: 'Select quick slot (1-9) to assign the current group'
  });

  if (!slotSelection) {
    window.showWarningMessage('No slot selected.');
    return null;
  }

  return Number(slotSelection.label);
}

async function requestSavedTabSelection(
  tabManagerService: TabManagerService
): Promise<SavedTabQuickPickItem | null> {
  const groups = Object.values(tabManagerService.state.groups).sort(
    (left, right) => (right.lastSelectedAt ?? 0) - (left.lastSelectedAt ?? 0)
  );
  const items: SavedTabQuickPickItem[] = groups.flatMap((group) => {
    const assignedSlot = getQuickSlotByGroupId(
      tabManagerService.state.quickSlots,
      group.id
    );
    const slotLabel = assignedSlot ? ` • slot ${assignedSlot}` : '';

    return getSavedTabs(group.state.tabState).map((tab) => ({
      label: tab.label,
      description: `${group.name}${slotLabel} • ${formatTabKind(tab.kind)}`,
      detail: getTabDetail(tab),
      groupId: group.id,
      viewColumn:
        typeof tab.viewColumn === 'number' ? tab.viewColumn : null,
      index: typeof tab.index === 'number' ? tab.index : null
    }));
  });

  if (items.length === 0) {
    void window.showWarningMessage('No saved tabs available.');
    return null;
  }

  return (await window.showQuickPick(items, {
    title: 'Find a saved tab',
    matchOnDescription: true,
    matchOnDetail: true,
    placeHolder: 'Search tab labels, groups, kinds, or paths'
  })) ?? null;
}

export function createCommands(
  tabManagerService: TabManagerService
): Disposable[] {
  const refreshCommand = commands.registerCommand(
    `${EXTENSION_NAME}.refresh`,
    async () => {
      tabManagerService.triggerSync();
    }
  );

  const quickSwitchCommand = commands.registerCommand(
    `${EXTENSION_NAME}.quickSwitch`,
    async () => {
      tabManagerService.quickSwitch();
    }
  );

  const clearSelectionCommand = commands.registerCommand(
    `${EXTENSION_NAME}.clearSelection`,
    async () => {
      tabManagerService.switchToGroup(null);
    }
  );

  const switchGroupCommand = commands.registerCommand(
    `${EXTENSION_NAME}.switchGroup`,
    async (groupNameParam?: string) => {
      const groups = tabManagerService.state.groups;
      const groupIdParam = Object.values(groups).find(
        (group) => group.name === groupNameParam
      )?.id;
      const groupId = groupIdParam || (await requestGroupId(tabManagerService));
      if (!groupId) {
        return;
      }
      tabManagerService.switchToGroup(groupId);
    }
  );

  const findTabCommand = commands.registerCommand(
    `${EXTENSION_NAME}.findTab`,
    async () => {
      const selection = await requestSavedTabSelection(tabManagerService);

      if (!selection) {
        return;
      }

      const shouldSwitchGroup =
        tabManagerService.state.stateContainer?.id !== selection.groupId;

      if (shouldSwitchGroup) {
        tabManagerService.switchToGroup(selection.groupId);
        await tabManagerService.waitForRenderComplete();
      }

      if (selection.viewColumn == null || selection.index == null) {
        window.showWarningMessage(
          'Selected tab does not have valid view column or index.'
        );
        return;
      }

      await tabManagerService.openTab(selection.viewColumn, selection.index);
    }
  );

  const createGroupCommand = commands.registerCommand(
    `${EXTENSION_NAME}.createGroup`,
    async (groupNameParam?: string) => {
      const input = groupNameParam || (await requestNewGroupId());
      const groupName = input?.trim();

      if (!groupName) {
        return;
      }

      tabManagerService.createGroup(groupName);
    }
  );

  const deleteGroupCommand = commands.registerCommand(
    `${EXTENSION_NAME}.deleteGroup`,
    async (groupNameParam?: string) => {
      const groups = tabManagerService.state.groups;
      const groupIdParam = Object.values(groups).find(
        (group) => group.name === groupNameParam
      )?.id;
      const groupId = groupIdParam || (await requestGroupId(tabManagerService));
      if (!groupId) {
        return;
      }
      tabManagerService.deleteGroup(groupId);
    }
  );

  const snapshotCommand = commands.registerCommand(
    `${EXTENSION_NAME}.snapshot`,
    () => {
      tabManagerService.takeSnapshot();
    }
  );

  const restoreSnapshotCommand = commands.registerCommand(
    `${EXTENSION_NAME}.restoreSnapshot`,
    async (historyNameParam?: string) => {
      const histories = tabManagerService.state.history;
      const historyIdParam = Object.values(histories).find(
        (group) => group.name === historyNameParam
      )?.id;
      const historyId =
        historyIdParam || (await requestSnapshotId(tabManagerService));
      if (!historyId) {
        return;
      }
      tabManagerService.recoverSnapshot(historyId);
    }
  );

  const deleteSnapshotCommand = commands.registerCommand(
    `${EXTENSION_NAME}.deleteSnapshot`,
    async (historyNameParam?: string) => {
      const histories = tabManagerService.state.history;
      const historyIdParam = Object.values(histories).find(
        (group) => group.name === historyNameParam
      )?.id;
      const historyId =
        historyIdParam || (await requestSnapshotId(tabManagerService));
      if (!historyId) {
        return;
      }
      tabManagerService.deleteSnapshot(historyId);
    }
  );

  const createAddonCommand = commands.registerCommand(
    `${EXTENSION_NAME}.createAddon`,
    async (addonNameParam?: string) => {
      const input = addonNameParam || (await requestNewAddonName());
      const addonName = input?.trim();

      if (!addonName) {
        return;
      }

      tabManagerService.createAddon(addonName);
    }
  );

  const applyAddonCommand = commands.registerCommand(
    `${EXTENSION_NAME}.applyAddon`,
    async (addonNameParam?: string) => {
      const addons = tabManagerService.state.addons;
      const addonIdParam = Object.values(addons).find(
        (addon) => addon.name === addonNameParam
      )?.id;
      const addonId = addonIdParam || (await requestAddonId(tabManagerService));
      if (!addonId) {
        return;
      }
      await tabManagerService.applyAddon(addonId);
    }
  );

  const deleteAddonCommand = commands.registerCommand(
    `${EXTENSION_NAME}.deleteAddon`,
    async (addonNameParam?: string) => {
      const addons = tabManagerService.state.addons;
      const addonIdParam = Object.values(addons).find(
        (addon) => addon.name === addonNameParam
      )?.id;
      const addonId = addonIdParam || (await requestAddonId(tabManagerService));
      if (!addonId) {
        return;
      }
      tabManagerService.deleteAddon(addonId);
    }
  );

  const assignQuickSlotCommand = commands.registerCommand(
    `${EXTENSION_NAME}.assignQuickSlot`,
    async (groupNameParam?: string, slotIndexParam?: string) => {
      const groups = tabManagerService.state.groups;
      const groupIdParam = Object.values(groups).find(
        (group) => group.name === groupNameParam
      )?.id;
      const groupId = groupIdParam || (await requestGroupId(tabManagerService));
      if (!groupId) {
        return;
      }
      const slotIndex =
        slotIndexParam != null
          ? Number(slotIndexParam)
          : await requestSlotIndex();

      if (slotIndex == null) {
        return;
      }

      // Validate slot index (must be 1-9)
      if (!Number.isInteger(slotIndex) || slotIndex < 1 || slotIndex > 9) {
        window.showWarningMessage('Invalid quick slot index. Choose 1-9.');
        return;
      }
      tabManagerService.assignQuickSlot(slotIndex.toString(), groupId);
    }
  );

  const clearQuickSlotCommand = commands.registerCommand(
    `${EXTENSION_NAME}.clearQuickSlot`,
    async (slotIndexParam?: string) => {
      const slotIndex =
        slotIndexParam != null
          ? Number(slotIndexParam)
          : await requestSlotIndex();

      if (slotIndex == null) {
        return;
      }

      if (!Number.isInteger(slotIndex) || slotIndex < 1 || slotIndex > 9) {
        window.showWarningMessage('Invalid quick slot index. Choose 1-9.');
        return;
      }

      tabManagerService.assignQuickSlot(slotIndex.toString(), null);
    }
  );

  const clearAllTabsCommand = commands.registerCommand(
    `${EXTENSION_NAME}.clearAllTabs`,
    async () => {
      await tabManagerService.clearAllTabs();
    }
  );

  const exportGroupCommand = commands.registerCommand(
    `${EXTENSION_NAME}.exportGroup`,
    async (groupNameParam?: string) => {
      const groups = tabManagerService.state.groups;
      const groupIdParam = Object.values(groups).find(
        (group) => group.name === groupNameParam
      )?.id;
      const groupId = groupIdParam || (await requestGroupId(tabManagerService));
      if (!groupId) {
        return;
      }

      const group = groups[groupId];
      const saveUri = await window.showSaveDialog({
        filters: { 'Tab Stack Group': ['tabstack'] },
        saveLabel: 'Export Group',
        title: 'Export Tab Group',
        defaultUri: group
          ? Uri.file(`${group.name}.tabstack`)
          : undefined
      });

      if (saveUri) {
        await tabManagerService.exportGroup(groupId, saveUri.toString());
      }
    }
  );

  const importGroupCommand = commands.registerCommand(
    `${EXTENSION_NAME}.importGroup`,
    async (filePathParam?: string) => {
      if (filePathParam) {
        await tabManagerService.importGroup(filePathParam);
        return;
      }

      const openUris = await window.showOpenDialog({
        canSelectMany: false,
        filters: { 'Tab Stack Group': ['tabstack'] },
        openLabel: 'Import Group',
        title: 'Import Tab Group'
      });

      if (openUris && openUris[0]) {
        await tabManagerService.importGroup(openUris[0].fsPath);
      }
    }
  );

  const quickSlotCommands = [];

  for (let slot = 1; slot <= 9; slot++) {
    const quickSlotCommand = commands.registerCommand(
      `${EXTENSION_NAME}.quickSlot${slot}`,
      async () => {
        tabManagerService.applyQuickSlot(slot.toString());
      }
    );

    quickSlotCommands.push(quickSlotCommand);
  }

  return [
    refreshCommand,
    quickSwitchCommand,
    clearSelectionCommand,
    switchGroupCommand,
    findTabCommand,
    createGroupCommand,
    deleteGroupCommand,
    snapshotCommand,
    restoreSnapshotCommand,
    deleteSnapshotCommand,
    createAddonCommand,
    applyAddonCommand,
    deleteAddonCommand,
    assignQuickSlotCommand,
    clearQuickSlotCommand,
    clearAllTabsCommand,
    exportGroupCommand,
    importGroupCommand,
    ...quickSlotCommands
  ];
}
