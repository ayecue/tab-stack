import { commands, ExtensionContext, window } from 'vscode';

import { ViewManagerProvider } from './providers/view-manager';
import { EditorLayoutService } from './services/editor-layout';
import { TabManagerService } from './services/tab-manager';
import { TabStateService } from './services/tab-state';
import { EXTENSION_NAME } from './types/extension';
import { EMPTY_GROUP_SELECTION } from './types/tab-manager';
import { getEditorLayout } from './utils/commands';

export async function activate(context: ExtensionContext) {
  const layoutService = new EditorLayoutService();
  const stateService = new TabStateService();

  await stateService.initialize();
  layoutService.setLayout(await getEditorLayout());
  layoutService.start();

  const tabManagerService = new TabManagerService(stateService, layoutService);
  const viewManagerProvider = new ViewManagerProvider(
    context,
    tabManagerService
  );

  context.subscriptions.push(
    window.registerWebviewViewProvider(
      ViewManagerProvider.VIEW_TYPE,
      viewManagerProvider
    )
  );

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
    async () => {
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
        return;
      }

      await tabManagerService.switchToGroup(groupId);
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

      await tabManagerService.createGroup(groupId);
    }
  );

  const deleteGroupCommand = commands.registerCommand(
    `${EXTENSION_NAME}.deleteGroup`,
    async () => {
      const groups = await tabManagerService.state.getGroups();
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
    async () => {
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
        return;
      }

      await tabManagerService.recoverSnapshot(historyId);
    }
  );

  const deleteSnapshotCommand = commands.registerCommand(
    `${EXTENSION_NAME}.deleteSnapshot`,
    async () => {
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
        return;
      }

      await tabManagerService.deleteSnapshot(historyId);
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

  context.subscriptions.push(
    stateService,
    layoutService,
    tabManagerService,
    viewManagerProvider,
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
