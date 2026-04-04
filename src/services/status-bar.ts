import {
  Disposable,
  StatusBarAlignment,
  StatusBarItem,
  window
} from 'vscode';

import { TabManagerService } from './tab-manager';
import { EXTENSION_NAME } from '../types/extension';
import { QuickSlotAssignments } from '../types/tab-manager';
import { SyncGroup, UpdatePayload } from '../types/status-bar';

function getQuickSlotByGroupId(
  quickSlots: QuickSlotAssignments,
  groupId: string
): string | null {
  const entry = Object.entries(quickSlots).find(
    ([_, assignedGroupId]) => assignedGroupId === groupId
  );

  return entry?.[0] ?? null;
}

export class StatusBarService implements Disposable {
  private _tabManager: TabManagerService;
  private _statusBarItem: StatusBarItem;
  private _disposables: Disposable[];
  private _lastPayload: UpdatePayload | null;

  constructor(tabManager: TabManagerService) {
    this._tabManager = tabManager;
    this._statusBarItem = window.createStatusBarItem(
      StatusBarAlignment.Left,
      100
    );
    this._statusBarItem.name = 'Tab Stack';
    this._lastPayload = null;

    this._disposables = [
      this._statusBarItem,
      this._tabManager.onDidSyncCollections(() => {
        this.updateFromState();
      }),
      this._tabManager.config.onDidChangeConfig((changes) => {
        if (changes.statusBarVisible !== undefined) {
          this.update();
        }
      })
    ];

    this.updateFromState();
  }

  private updateFromState(): void {
    const groups = Object.values(this._tabManager.state.groups).map<SyncGroup>((group) => {
      const tabGroups = Object.values(group.state.tabState.tabGroups);
      const tabCount = tabGroups.reduce(
        (count, tabGroup) => count + tabGroup.tabs.length,
        0
      );

      return {
        groupId: group.id,
        name: group.name,
        tabCount,
        columnCount: tabGroups.length
      };
    });

    this.setLastPayload({
      selectedGroup: this._tabManager.state.stateContainer?.id ?? null,
      groups,
      quickSlots: this._tabManager.state.quickSlots ?? {}
    });
  }

  private setLastPayload(payload: UpdatePayload): void {
    this._lastPayload = payload;
    this.update();
  }

  private getStatusBarPayload(): Pick<StatusBarItem, 'text' | 'tooltip' | 'command'> {
    if (this._lastPayload.groups.length === 0) {
      return {
        text: 'Tab Stack: Save Group',
        tooltip: 'No saved Tab Stack groups yet. Click to save the current layout.',
        command: `${EXTENSION_NAME}.createGroup`
      };
    }

    const selectedGroup = this._lastPayload.groups.find(
      (group) => group.groupId ===this._lastPayload.selectedGroup
    );

    if (!selectedGroup) {
      return {
        text: 'Tab Stack: Unsaved Layout',
        tooltip: 'Current tabs do not match a saved group. Click to choose a saved group.',
        command: `${EXTENSION_NAME}.recentGroups`
      };
    }

    const assignedSlot = getQuickSlotByGroupId(
      this._lastPayload.quickSlots ?? {},
      selectedGroup.groupId
    );
    const slotSuffix = assignedSlot ? ` [${assignedSlot}]` : '';

    return {
      text: `Tab Stack: ${selectedGroup.name}${slotSuffix}`,
      tooltip:
        `${selectedGroup.tabCount} tab${selectedGroup.tabCount === 1 ? '' : 's'} ` +
        `across ${selectedGroup.columnCount} column${selectedGroup.columnCount === 1 ? '' : 's'}. ` +
        'Click to switch to a recent group.',
      command: `${EXTENSION_NAME}.recentGroups`
    };
  }

  private update(): void {
    if (!this._tabManager.config.getStatusBarVisible()) {
      this._statusBarItem.hide();
      return;
    }

    const statusBarPayload = this.getStatusBarPayload();

    this._statusBarItem.text = statusBarPayload.text;
    this._statusBarItem.tooltip = statusBarPayload.tooltip;
    this._statusBarItem.command = statusBarPayload.command;
    this._statusBarItem.show();
  }

  dispose(): void {
    this._disposables.forEach((disposable) => disposable.dispose());
    this._disposables = [];
  }
}