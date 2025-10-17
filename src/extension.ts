import { commands, ExtensionContext, window } from 'vscode';

import { TabManagerProvider } from './providers/tab-manager';
import { EXTENSION_NAME } from './types/extension';
import { EMPTY_GROUP_SELECTION } from './types/tab-manager';
import { focusTab } from './utils/commands';

export async function activate(context: ExtensionContext) {
  const provider = new TabManagerProvider(context);

  await provider.initializeState();

  context.subscriptions.push(
    window.registerWebviewViewProvider(TabManagerProvider.VIEW_TYPE, provider)
  );

  const refreshCommand = commands.registerCommand(
    `${EXTENSION_NAME}.refresh`,
    async () => {
      await provider.refresh();
    }
  );

  const quickSwitchCommand = commands.registerCommand(
    `${EXTENSION_NAME}.quickSwitch`,
    async () => {
      await provider.quickSwitch();
    }
  );

  const clearSelectionCommand = commands.registerCommand(
    `${EXTENSION_NAME}.clearSelection`,
    async () => {
      await provider.switchToGroup(EMPTY_GROUP_SELECTION);
    }
  );

  const switchGroupCommand = commands.registerCommand(
    `${EXTENSION_NAME}.switchGroup`,
    async () => {
      const groups = await provider.state.getGroups();
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
        return;
      }

      await provider.switchToGroup(groupId);
    }
  );

  const createGroupCommand = commands.registerCommand(
    `${EXTENSION_NAME}.createGroup`,
    async () => {
      const input = await window.showInputBox({
        prompt: 'Name the new tab group',
        placeHolder: 'e.g. Sprint Planning'
      });
      const groupId = input?.trim();

      if (!groupId) {
        return;
      }

      await provider.createGroup(groupId);
    }
  );

  const deleteGroupCommand = commands.registerCommand(
    `${EXTENSION_NAME}.deleteGroup`,
    async () => {
      const groups = await provider.state.getGroups();
      const groupKeys = Object.keys(groups);

      if (groupKeys.length === 0) {
        window.showWarningMessage('No groups available.');
        return;
      }

      const groupId = await window.showQuickPick(groupKeys, {
        title: 'Select the group to delete'
      });

      if (!groupId) {
        window.showWarningMessage('Invalid group.');
        return;
      }

      await provider.deleteGroup(groupId);
    }
  );

  const snapshotCommand = commands.registerCommand(
    `${EXTENSION_NAME}.snapshot`,
    async () => {
      await provider.takeSnapshot();
    }
  );

  const restoreSnapshotCommand = commands.registerCommand(
    `${EXTENSION_NAME}.restoreSnapshot`,
    async () => {
      const snapshots = await provider.state.getHistory();
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
        return;
      }

      await provider.recoverSnapshot(historyId);
    }
  );

  const deleteSnapshotCommand = commands.registerCommand(
    `${EXTENSION_NAME}.deleteSnapshot`,
    async () => {
      const snapshots = await provider.state.getHistory();
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
        return;
      }

      await provider.deleteSnapshot(historyId);
    }
  );

  const quickSlotCommands = [];

  for (let slot = 1; slot <= 9; slot++) {
    const quickSlotCommand = commands.registerCommand(
      `${EXTENSION_NAME}.quickSlot${slot}`,
      async () => {
        await provider.applyQuickSlot(slot);
      }
    );

    quickSlotCommands.push(quickSlotCommand);
  }

  context.subscriptions.push(
    provider,
    refreshCommand,
    quickSwitchCommand,
    clearSelectionCommand,
    switchGroupCommand,
    createGroupCommand,
    deleteGroupCommand,
    snapshotCommand,
    restoreSnapshotCommand,
    deleteSnapshotCommand,
    ...quickSlotCommands
  );
}

export function deactivate() {}
