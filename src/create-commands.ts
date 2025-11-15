import { commands, Disposable, window } from 'vscode';

import { ViewManagerProvider } from './providers/view-manager';
import { TabManagerService } from './services/tab-manager';
import { EXTENSION_NAME } from './types/extension';
import {
  ExtensionNotificationMessage,
  ExtensionTabsSyncMessage
} from './types/messages';

async function requestGroupId(
  tabManagerService: TabManagerService
): Promise<string | null> {
  const groups = tabManagerService.state.getGroups();
  const groupNames = Object.values(groups).map((group) => group.name);

  if (groupNames.length === 0) {
    window.showWarningMessage('No groups available.');
    return;
  }

  const groupName = await window.showQuickPick(groupNames, {
    title: 'Select the group to apply'
  });

  if (!groupName) {
    window.showWarningMessage('Invalid group.');
    return null;
  }

  const groupId = Object.values(groups).find(
    (group) => group.name === groupName
  )?.id;

  return groupId;
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
  const addons = tabManagerService.state.getAddons();
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
  const snapshots = tabManagerService.state.getHistory();
  const snapshotNames = Object.values(snapshots).map(
    (snapshot) => snapshot.name
  );

  if (snapshotNames.length === 0) {
    window.showWarningMessage('No snapshots available.');
    return;
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

  return Number(slotSelection);
}

export function createCommands(
  tabManagerService: TabManagerService
): Disposable[] {
  const refreshCommand = commands.registerCommand(
    `${EXTENSION_NAME}.refresh`,
    async () => {
      await tabManagerService.refresh();
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
      const groups = tabManagerService.state.getGroups();
      const groupIdParam = Object.values(groups).find(
        (group) => group.name === groupNameParam
      )?.id;
      const groupId = groupIdParam || (await requestGroupId(tabManagerService));
      tabManagerService.switchToGroup(groupId);
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
      const groups = tabManagerService.state.getGroups();
      const groupIdParam = Object.values(groups).find(
        (group) => group.name === groupNameParam
      )?.id;
      const groupId = groupIdParam || (await requestGroupId(tabManagerService));
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
      const histories = tabManagerService.state.getHistory();
      const historyIdParam = Object.values(histories).find(
        (group) => group.name === historyNameParam
      )?.id;
      const historyId =
        historyIdParam || (await requestSnapshotId(tabManagerService));
      tabManagerService.recoverSnapshot(historyId);
    }
  );

  const deleteSnapshotCommand = commands.registerCommand(
    `${EXTENSION_NAME}.deleteSnapshot`,
    async (historyNameParam?: string) => {
      const histories = tabManagerService.state.getHistory();
      const historyIdParam = Object.values(histories).find(
        (group) => group.name === historyNameParam
      )?.id;
      const historyId =
        historyIdParam || (await requestSnapshotId(tabManagerService));
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
      const addons = tabManagerService.state.getAddons();
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
      const addons = tabManagerService.state.getAddons();
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
      const groups = tabManagerService.state.getGroups();
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

      // Validate slot index (must be 1-9)
      if (slotIndex < 1 || slotIndex > 9) {
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

      if (slotIndex < 1 || slotIndex > 9) {
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

  // Test-only helper commands (not contributed to menus):
  const testOpenView = commands.registerCommand(
    `${EXTENSION_NAME}.__test__openView`,
    async () => {
      // Ensure the view container is revealed; this resolves the view provider
      await commands.executeCommand('workbench.view.extension.tabStack');
    }
  );

  const testDispatch = commands.registerCommand(
    `${EXTENSION_NAME}.__test__webviewDispatch`,
    async (data: any) => {
      await ViewManagerProvider.__test__dispatchFromWebview(data);
      return true;
    }
  );

  const testWebviewReady = commands.registerCommand(
    `${EXTENSION_NAME}.__test__webviewReady`,
    async () => {
      return ViewManagerProvider.__test__messageHandler != null;
    }
  );

  const testGetState = commands.registerCommand(
    `${EXTENSION_NAME}.__test__getState`,
    async () => {
      const groups = tabManagerService.state?.getGroups?.() ?? {};
      const addons = tabManagerService.state?.getAddons?.() ?? {};
      const history = tabManagerService.state?.getHistory?.() ?? {};
      const quickSlots = tabManagerService.state?.getQuickSlots?.() ?? {};
      const selectedGroupId =
        tabManagerService.state?.stateContainer?.id ?? null;
      return {
        groups: Object.fromEntries(
          Object.values(groups).map((g) => [g.id, { id: g.id, name: g.name }])
        ),
        addons: Object.fromEntries(
          Object.values(addons).map((a) => [a.id, { id: a.id, name: a.name }])
        ),
        historyIds: Object.keys(history),
        quickSlots,
        selectedGroupId
      };
    }
  );

  // Test-only: capture Sync/Notification payloads emitted by the service (no webview changes)
  type CapturedSync = Omit<ExtensionTabsSyncMessage, 'type'>;
  type CapturedNotify = Omit<ExtensionNotificationMessage, 'type'>;

  let __test__syncMessages: CapturedSync[] = [];
  let __test__notifications: CapturedNotify[] = [];
  let __test__subscriptions: Disposable[] = [];

  const testStartCapture = commands.registerCommand(
    `${EXTENSION_NAME}.__test__startCapture`,
    async () => {
      __test__syncMessages = [];
      __test__notifications = [];
      __test__subscriptions.forEach((d) => d.dispose());
      __test__subscriptions = [];
      __test__subscriptions.push(
        tabManagerService.onDidSyncTabs((p) => __test__syncMessages.push(p))
      );
      __test__subscriptions.push(
        tabManagerService.onDidNotify((p) => __test__notifications.push(p))
      );
      return true;
    }
  );

  const testGetCaptured = commands.registerCommand(
    `${EXTENSION_NAME}.__test__getCapturedMessages`,
    async (clear = false) => {
      const result = {
        sync: [...__test__syncMessages],
        notify: [...__test__notifications]
      };
      if (clear) {
        __test__syncMessages = [];
        __test__notifications = [];
      }
      return result;
    }
  );

  const testStopCapture = commands.registerCommand(
    `${EXTENSION_NAME}.__test__stopCapture`,
    async () => {
      __test__subscriptions.forEach((d) => d.dispose());
      __test__subscriptions = [];
      __test__syncMessages = [];
      __test__notifications = [];
      return true;
    }
  );

  return [
    refreshCommand,
    quickSwitchCommand,
    clearSelectionCommand,
    switchGroupCommand,
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
    ...quickSlotCommands,
    testOpenView,
    testDispatch,
    testGetState,
    testWebviewReady,
    testStartCapture,
    testGetCaptured,
    testStopCapture
  ];
}
