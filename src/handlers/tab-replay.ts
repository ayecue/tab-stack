import { commands, Terminal, TerminalOptions, window } from 'vscode';

import { getLogger, ScopedLogger } from '../services/logger';
import type { TabActiveStateStore } from '../stores/tab-active-state';
import { Layout, MoveStep } from '../types/commands';
import type {
  AssociatedInstanceRegistry,
  TabLayoutStateProvider,
  TabStateReplayOptions,
  TrackedTabAssociationRegistry
} from '../types/tab-active-state';
import {
  TabInfo,
  TabInfoId,
  TabInfoMetaTerminal,
  TabKind,
  TabState
} from '../types/tabs';
import { focusGroup, focusTabInGroup, pinEditor } from '../utils/commands';
import {
  countLayoutLeaves,
  resolveGroupMove,
  setEditorLayout
} from '../utils/layout';
import {
  createTabKey,
  createTabKeyByViewColumn,
  parseTabKey,
  rebuildTabKeyWithNewViewColumn
} from '../utils/tab-utils';
import { TabFactory } from './tab-factory';

export class TabReplayHandler {
  private _log: ScopedLogger;

  constructor(
    private readonly _tabActiveStateStore: TabActiveStateStore,
    private readonly _layoutProvider: TabLayoutStateProvider,
    private readonly _tabFactory: TabFactory,
    private readonly _associatedTabs: Pick<
      TrackedTabAssociationRegistry,
      'associatedTabs'
    >,
    private readonly _associatedInstances: Pick<
      AssociatedInstanceRegistry,
      'findAssociatedInstanceByTabId' | 'registerAssociatedInstance'
    >
  ) {
    this._log = getLogger().child('TabReplay');
  }

  async moveEditorGroup(
    fromViewColumn: number,
    toViewColumn: number
  ): Promise<void> {
    if (fromViewColumn === toViewColumn) return;

    const layout = this._layoutProvider.currentLayout as Layout;
    const leafCount = countLayoutLeaves(layout);
    const flatLayout: Layout = {
      orientation: 0,
      groups: Array.from({ length: leafCount }, () => ({ size: 1 }))
    };

    const moveSteps = resolveGroupMove(fromViewColumn, toViewColumn);
    if (moveSteps.length === 0) return;

    const currentTabs = this._tabActiveStateStore.getSnapshot().context.tabs;
    const newTabs: Record<TabInfoId, TabInfo> = { ...currentTabs };

    await setEditorLayout(flatLayout);

    for (const step of moveSteps) {
      await focusGroup(step.moverRange[0]);
      await commands.executeCommand(step.command);
      this._rebuildGroupViewColumnsAfterStep(step);
    }

    await setEditorLayout(layout);

    this._tabActiveStateStore.send({ type: 'SET_TABS', tabs: newTabs });
  }

  mergeTabState(tabState: TabState): void {
    const newTabs: Record<TabInfoId, TabInfo> = {};
    const incomingTabStateGroups = Object.values(tabState.tabGroups);

    for (let i = 0; i < incomingTabStateGroups.length; i++) {
      const group = incomingTabStateGroups[i];
      const currentGroup = window.tabGroups.all[i];

      if (!currentGroup) continue;

      for (let j = 0; j < group.tabs.length; j++) {
        const tabInfo = group.tabs[j];
        const tab = currentGroup.tabs[j];

        if (!tab) continue;

        const tabKey = createTabKey(tab, currentGroup, j);
        const currentTabId = this._associatedTabs.associatedTabs.get(tabKey);
        const associatedInstance = currentTabId
          ? this._associatedInstances.findAssociatedInstanceByTabId(
              currentTabId
            )
          : null;

        newTabs[tabInfo.id] = { ...tabInfo };

        this._associatedTabs.associatedTabs.set(tabKey, tabInfo.id);
        if (associatedInstance) {
          this._associatedInstances.registerAssociatedInstance(
            associatedInstance,
            tabInfo.id
          );
        }
      }
    }

    this._tabActiveStateStore.send({ type: 'SET_TABS', tabs: newTabs });
  }

  async applyTabState(
    tabState: TabState,
    options: TabStateReplayOptions
  ): Promise<void> {
    const tabCount = Object.values(tabState.tabGroups).reduce(
      (sum, group) => sum + group.tabs.length,
      0
    );
    this._log.info(
      `applyTabState: restoring ${tabCount} tab(s) across ${Object.keys(tabState.tabGroups).length} group(s)`
    );

    const currentTabs = this._tabActiveStateStore.getSnapshot().context.tabs;
    const newTabs: Record<TabInfoId, TabInfo> = { ...currentTabs };
    const pinnedTabs: { tab: TabInfo; index: number }[] = [];
    const activeTabs: { tab: TabInfo; index: number }[] = [];
    const focusedViewColumn =
      tabState.tabGroups[tabState.activeGroup]?.viewColumn ?? 1;
    const focusedIndex =
      tabState.tabGroups[tabState.activeGroup]?.tabs.findIndex(
        (tab) => tab.isActive
      ) ?? 0;

    await Promise.all(
      Object.values(tabState.tabGroups).flatMap((group) =>
        group.tabs.map(async (tab) => {
          const result = await this._tabFactory.openTab(tab);

          if (!result.success) {
            this._log.warn(`failed to open tab "${tab.label}", skipping...`);
            return;
          }

          const nativeTabViewColumn = result.tab.group.viewColumn;
          const nativeTabIndex = result.tab.group.tabs.indexOf(result.tab);
          const tabKey = createTabKeyByViewColumn(
            result.tab,
            nativeTabViewColumn,
            nativeTabIndex
          );

          newTabs[tab.id] = {
            ...tab,
            index: nativeTabIndex
          };

          this._associatedTabs.associatedTabs.set(tabKey, tab.id);

          if (tab.isPinned) pinnedTabs.push({ tab, index: nativeTabIndex });
          if (tab.isActive) activeTabs.push({ tab, index: nativeTabIndex });
          if (result.handle != null) {
            this._associatedInstances.registerAssociatedInstance(
              result.handle,
              tab.id
            );

            if (tab.kind === TabKind.TabInputTerminal) {
              const term = result.handle as Terminal;
              const terminalOptions = term.creationOptions as TerminalOptions;
              tab.meta = {
                cwd: terminalOptions.cwd?.toString(),
                shellPath: terminalOptions.shellPath,
                terminalName: term.name,
                type: 'terminal'
              } as TabInfoMetaTerminal;
            }
          }
        })
      )
    );

    if (options.preservePinnedTabs) {
      for (let i = 0; i < pinnedTabs.length; i++) {
        const { tab, index } = pinnedTabs[i];
        await pinEditor(tab.viewColumn, index, false);
      }
    }

    if (options.preserveActiveTab) {
      for (let i = 0; i < activeTabs.length; i++) {
        const { tab, index } = activeTabs[i];
        if (tab.viewColumn === focusedViewColumn && index === focusedIndex) {
          continue;
        }
        await focusTabInGroup(tab.viewColumn, index);
      }
    }

    if (options.preserveTabFocus) {
      await focusTabInGroup(focusedViewColumn, focusedIndex);
    }

    this._tabActiveStateStore.send({ type: 'SET_TABS', tabs: newTabs });
    this._log.info('applyTabState complete');
  }

  private _rebuildGroupViewColumnsAfterStep(step: MoveStep): void {
    const nextAssociatedTabs = new Map<string, TabInfoId>();

    for (const [key, tabId] of this._associatedTabs.associatedTabs) {
      const parsed = parseTabKey(key);
      const viewColumn = parsed.viewColumn;

      if (
        viewColumn >= step.moverRange[0] &&
        viewColumn <= step.moverRange[1]
      ) {
        nextAssociatedTabs.set(
          rebuildTabKeyWithNewViewColumn(parsed, viewColumn + step.moverShift),
          tabId
        );
      } else if (
        viewColumn >= step.jumpedRange[0] &&
        viewColumn <= step.jumpedRange[1]
      ) {
        nextAssociatedTabs.set(
          rebuildTabKeyWithNewViewColumn(parsed, viewColumn + step.jumpedShift),
          tabId
        );
      } else {
        nextAssociatedTabs.set(key, tabId);
      }
    }

    this._associatedTabs.associatedTabs.clear();
    for (const [tabKey, tabId] of nextAssociatedTabs) {
      this._associatedTabs.associatedTabs.set(tabKey, tabId);
    }
  }
}
