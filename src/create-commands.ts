import { commands, Disposable, window } from 'vscode';

import { TabManagerService } from './services/tab-manager';
import { EXTENSION_NAME } from './types/extension';
import { EMPTY_GROUP_SELECTION } from './types/tab-manager';

async function requestGroupId(
  tabManagerService: TabManagerService
): Promise<string | null> {
  const groups = await tabManagerService.state.getGroups();
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

async function requestSnapshotId(
  tabManagerService: TabManagerService
): Promise<string | null> {
  const snapshots = await tabManagerService.state.getHistory();
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
      await tabManagerService.quickSwitch();
    }
  );

  const clearSelectionCommand = commands.registerCommand(
    `${EXTENSION_NAME}.clearSelection`,
    async () => {
      await tabManagerService.switchToGroup(EMPTY_GROUP_SELECTION);
    }
  );

  const switchGroupCommand = commands.registerCommand(
    `${EXTENSION_NAME}.switchGroup`,
    async (groupNameParam?: string) => {
      const groups = await tabManagerService.state.getGroups();
      const groupIdParam = Object.values(groups).find(
        (group) => group.name === groupNameParam
      )?.id;
      const groupId = groupIdParam || (await requestGroupId(tabManagerService));
      await tabManagerService.switchToGroup(groupId);
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

      await tabManagerService.createGroup(groupName);
    }
  );

  const deleteGroupCommand = commands.registerCommand(
    `${EXTENSION_NAME}.deleteGroup`,
    async (groupNameParam?: string) => {
      const groups = await tabManagerService.state.getGroups();
      const groupIdParam = Object.values(groups).find(
        (group) => group.name === groupNameParam
      )?.id;
      const groupId = groupIdParam || (await requestGroupId(tabManagerService));
      await tabManagerService.deleteGroup(groupId);
    }
  );

  const snapshotCommand = commands.registerCommand(
    `${EXTENSION_NAME}.snapshot`,
    async () => {
      await tabManagerService.takeSnapshot();
    }
  );

  const restoreSnapshotCommand = commands.registerCommand(
    `${EXTENSION_NAME}.restoreSnapshot`,
    async (historyNameParam?: string) => {
      const histories = await tabManagerService.state.getHistory();
      const historyIdParam = Object.values(histories).find(
        (group) => group.name === historyNameParam
      )?.id;
      const historyId =
        historyIdParam || (await requestSnapshotId(tabManagerService));
      await tabManagerService.recoverSnapshot(historyId);
    }
  );

  const deleteSnapshotCommand = commands.registerCommand(
    `${EXTENSION_NAME}.deleteSnapshot`,
    async (historyNameParam?: string) => {
      const histories = await tabManagerService.state.getHistory();
      const historyIdParam = Object.values(histories).find(
        (group) => group.name === historyNameParam
      )?.id;
      const historyId =
        historyIdParam || (await requestSnapshotId(tabManagerService));
      await tabManagerService.deleteSnapshot(historyId);
    }
  );

  const assignQuickSlotCommand = commands.registerCommand(
    `${EXTENSION_NAME}.assignQuickSlot`,
    async (groupNameParam?: string, slotIndexParam?: string) => {
      const groups = await tabManagerService.state.getGroups();
      const groupIdParam = Object.values(groups).find(
        (group) => group.name === groupNameParam
      )?.id;
      const groupId = groupIdParam || (await requestGroupId(tabManagerService));
      if (!groupId) {
        return;
      }
      const slotIndex =
        slotIndexParam == null
          ? Number(slotIndexParam)
          : await requestSlotIndex();
      if (slotIndex === null && slotIndex > 0 && slotIndex < 10) {
        return;
      }
      await tabManagerService.assignQuickSlot(slotIndex, groupId);
    }
  );

  const quickSlotCommands = [];

  for (let slot = 1; slot <= 9; slot++) {
    const quickSlotCommand = commands.registerCommand(
      `${EXTENSION_NAME}.quickSlot${slot}`,
      async () => {
        await tabManagerService.applyQuickSlot(slot);
      }
    );

    quickSlotCommands.push(quickSlotCommand);
  }

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
    assignQuickSlotCommand,
    ...quickSlotCommands
  ];
}
