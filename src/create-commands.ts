import { commands, Disposable, window } from 'vscode';

import { TabManagerService } from './services/tab-manager';
import { EXTENSION_NAME } from './types/extension';
import { EMPTY_GROUP_SELECTION } from './types/tab-manager';

async function requestGroupId(
  tabManagerService: TabManagerService
): Promise<string | null> {
  const groups = await tabManagerService.state.getGroups();
  const groupKeys = Object.keys(groups);

  if (groupKeys.length === 0) {
    window.showWarningMessage('No groups available.');
    return;
  }

  const groupId = await window.showQuickPick(groupKeys, {
    title: 'Select the group to apply'
  });

  if (!groupId) {
    window.showWarningMessage('Invalid group.');
    return null;
  }

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
  const snapshotKeys = Object.keys(snapshots);

  if (snapshotKeys.length === 0) {
    window.showWarningMessage('No snapshots available.');
    return;
  }

  const historyId = await window.showQuickPick(snapshotKeys, {
    title: 'Select snapshot to restore'
  });

  if (!historyId) {
    window.showWarningMessage('Invalid snapshot.');
    return null;
  }

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
    async (groupIdParam?: string) => {
      const groupId = groupIdParam || (await requestGroupId(tabManagerService));
      await tabManagerService.switchToGroup(groupId);
    }
  );

  const createGroupCommand = commands.registerCommand(
    `${EXTENSION_NAME}.createGroup`,
    async (groupIdParam?: string) => {
      const input = groupIdParam || (await requestNewGroupId());
      const groupId = input?.trim();

      if (!groupId) {
        return;
      }

      await tabManagerService.createGroup(groupId);
    }
  );

  const deleteGroupCommand = commands.registerCommand(
    `${EXTENSION_NAME}.deleteGroup`,
    async (groupIdParam?: string) => {
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
    async (historyIdParam?: string) => {
      const historyId =
        historyIdParam || (await requestSnapshotId(tabManagerService));
      await tabManagerService.recoverSnapshot(historyId);
    }
  );

  const deleteSnapshotCommand = commands.registerCommand(
    `${EXTENSION_NAME}.deleteSnapshot`,
    async (historyIdParam?: string) => {
      const historyId =
        historyIdParam || (await requestSnapshotId(tabManagerService));
      await tabManagerService.deleteSnapshot(historyId);
    }
  );

  const assignQuickSlotCommand = commands.registerCommand(
    `${EXTENSION_NAME}.assignQuickSlot`,
    async (historyIdParam?: string, slotIndexParam?: string) => {
      const groupId =
        historyIdParam || (await requestGroupId(tabManagerService));
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
