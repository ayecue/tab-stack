import { window } from 'vscode';

import type { TabActiveStateStore } from '../stores/tab-active-state';
import type {
  TabLayoutStateProvider,
  TrackedTabAssociationRegistry
} from '../types/tab-active-state';
import { TabManagerState } from '../types/tab-manager';
import { TabInfo, TabInfoId, TabState } from '../types/tabs';
import { transformTabToTabInfo } from '../transformers/tab';
import { createTabKey } from '../utils/tab-utils';

export class TabStateProjector {
  private _cachedTabState: TabState | null = null;

  constructor(
    private readonly _tabActiveStateStore: TabActiveStateStore,
    private readonly _associatedTabs: Pick<
      TrackedTabAssociationRegistry,
      'associatedTabs'
    >,
    private readonly _layoutProvider: TabLayoutStateProvider
  ) {}

  invalidateTabState(): void {
    this._cachedTabState = null;
  }

  getTabManagerState(): TabManagerState {
    return {
      tabState: this.getTabState(),
      layout: this._layoutProvider.currentLayout
    };
  }

  getTabState(): TabState {
    if (this._cachedTabState !== null) {
      return this._cachedTabState;
    }

    const currentTabs = this._tabActiveStateStore.getSnapshot().context.tabs;
    const tabs = window.tabGroups.all.flatMap((group) => {
      return group.tabs.map((tab, index) => {
        const key = createTabKey(tab, group, index);
        const tabId = this._associatedTabs.associatedTabs.get(key);
        if (tabId == null || currentTabs[tabId] == null) {
          return transformTabToTabInfo(tab, group, index);
        }
        return currentTabs[tabId];
      });
    });

    const tabsGroupedByColumn: Record<number, TabInfo[]> = {};
    tabs.forEach((tab) => {
      const column = tab.viewColumn ?? 0;
      tabsGroupedByColumn[column] ??= [];
      tabsGroupedByColumn[column].push(tab);
    });

    const tabState: TabState = {
      tabGroups: {},
      activeGroup: window.tabGroups?.activeTabGroup?.viewColumn ?? null
    };

    Object.entries(tabsGroupedByColumn).forEach(
      ([viewColumn, tabsInColumn]) => {
        const activeTabInColumn = tabsInColumn.find((tab) => tab.isActive);
        const sortedTabs: TabInfo[] = new Array(tabsInColumn.length);
        const viewColumnNumber = Number(viewColumn);

        tabsInColumn.forEach((tab) => {
          sortedTabs[tab.index] = tab;
        });

        tabState.tabGroups[viewColumnNumber] = {
          tabs: sortedTabs.filter((tab): tab is TabInfo => tab != null),
          viewColumn: viewColumnNumber,
          activeTab: activeTabInColumn
        };
      }
    );

    this._cachedTabState = tabState;
    return tabState;
  }
}