import { window } from 'vscode';

import { TabObserverService } from '../services/tab-observer';
import type { TabActiveStateStore } from '../stores/tab-active-state';
import { transformTabToTabInfo } from '../transformers/tab';
import type {
  AssociatedInstanceRegistry,
  TabRecoverabilityResolver
} from '../types/tab-active-state';
import {
  ResolvedTabChangeEvent,
  TabEntrySnapshot,
  TabRewireDelta,
  WindowSnapshot
} from '../types/tab-change-proxy';
import { TabInfo, TabInfoId } from '../types/tabs';
import { createTabKey } from '../utils/tab-utils';
import { isTrackedTabInfoEqual } from '../utils/tracked-tab-equality';

export class TrackedTabIdentityHandler {
  constructor(
    private readonly _tabActiveStateStore: TabActiveStateStore,
    private readonly _recoveryResolver: TabRecoverabilityResolver,
    private readonly _associatedInstanceRegistry: Pick<
      AssociatedInstanceRegistry,
      'pruneAssociatedInstances'
    >
  ) {}

  syncTabs(
    event: ResolvedTabChangeEvent,
    associatedTabs: Map<string, TabInfoId>
  ): Map<string, TabInfoId> {
    if (event.source === 'snapshot') {
      return this._syncSnapshotTabs(event.afterSnapshot, associatedTabs);
    }

    return this._syncDeltaTabs(event, associatedTabs);
  }

  rehydrateTabs(
    associatedTabs: Map<string, TabInfoId>
  ): Map<string, TabInfoId> {
    const tabsInState = this._tabActiveStateStore.getSnapshot().context.tabs;
    const nextTabs: Record<TabInfoId, TabInfo> = {};
    const previousAssociatedTabs = new Map(associatedTabs);
    const nextAssociatedTabs = new Map<string, TabInfoId>();
    const claimedTabIds = new Set<TabInfoId>();

    for (const group of window.tabGroups.all) {
      for (let index = 0; index < group.tabs.length; index++) {
        const tab = group.tabs[index];
        const tabKey = createTabKey(tab, group, index);
        const entry = TabObserverService.snapshotTab(
          tab,
          group.viewColumn,
          index
        );
        const existingTabId = previousAssociatedTabs.get(tabKey);

        if (
          existingTabId != null &&
          tabsInState[existingTabId] != null &&
          !claimedTabIds.has(existingTabId)
        ) {
          claimedTabIds.add(existingTabId);
          nextTabs[existingTabId] = this._mergeTabInfoFromEntry(
            tabsInState[existingTabId],
            entry
          );
          nextAssociatedTabs.set(tabKey, existingTabId);
          continue;
        }

        const newTabInfo = this._createTabInfoFromEntry(entry);
        claimedTabIds.add(newTabInfo.id);
        nextTabs[newTabInfo.id] = newTabInfo;
        nextAssociatedTabs.set(tabKey, newTabInfo.id);
      }
    }

    const liveTabIds = new Set(Object.keys(nextTabs) as TabInfoId[]);
    if (
      !this._hasTrackedTabsChanged(
        tabsInState,
        nextTabs,
        associatedTabs,
        nextAssociatedTabs
      )
    ) {
      this._associatedInstanceRegistry.pruneAssociatedInstances(liveTabIds);
      return associatedTabs;
    }

    this._associatedInstanceRegistry.pruneAssociatedInstances(liveTabIds);
    this._tabActiveStateStore.send({ type: 'SET_TABS', tabs: nextTabs });

    return nextAssociatedTabs;
  }

  private _createTabInfoFromEntry(entry: TabEntrySnapshot): TabInfo {
    const tabInfo = transformTabToTabInfo(
      entry.tab,
      { viewColumn: entry.viewColumn } as typeof entry.tab.group,
      entry.index
    );
    const resolvedTabInfo: TabInfo = {
      ...tabInfo,
      label: entry.tab.label,
      isActive: entry.isActive,
      isPinned: entry.isPinned,
      isDirty: entry.isDirty,
      index: entry.index,
      viewColumn: entry.viewColumn
    };

    return {
      ...resolvedTabInfo,
      isRecoverable: this._recoveryResolver.isRecoverable(resolvedTabInfo)
    };
  }

  private _mergeTabInfoFromEntry(
    tabInfo: TabInfo,
    entry: TabEntrySnapshot
  ): TabInfo {
    const resolvedTabInfo: TabInfo = {
      ...tabInfo,
      label: entry.tab.label,
      isActive: entry.isActive,
      isPinned: entry.isPinned,
      isDirty: entry.isDirty,
      index: entry.index,
      viewColumn: entry.viewColumn
    };

    return {
      ...resolvedTabInfo,
      isRecoverable: this._recoveryResolver.isRecoverable(resolvedTabInfo)
    };
  }

  private _hasTrackedTabsChanged(
    currentTabs: Record<TabInfoId, TabInfo>,
    nextTabs: Record<TabInfoId, TabInfo>,
    currentAssociatedTabs: Map<string, TabInfoId>,
    nextAssociatedTabs: Map<string, TabInfoId>
  ): boolean {
    const currentTabIds = Object.keys(currentTabs);
    const nextTabIds = Object.keys(nextTabs);

    if (currentTabIds.length !== nextTabIds.length) {
      return true;
    }

    for (const tabId of nextTabIds) {
      if (!(tabId in currentTabs)) {
        return true;
      }

      if (!isTrackedTabInfoEqual(currentTabs[tabId], nextTabs[tabId])) {
        return true;
      }
    }

    if (currentAssociatedTabs.size !== nextAssociatedTabs.size) {
      return true;
    }

    for (const [tabKey, tabId] of nextAssociatedTabs) {
      if (currentAssociatedTabs.get(tabKey) !== tabId) {
        return true;
      }
    }

    return false;
  }

  private _resolveSnapshotTrackedTabId(
    entry: TabEntrySnapshot,
    tabsInState: Record<TabInfoId, TabInfo>,
    previousAssociatedTabs: Map<string, TabInfoId>,
    claimedTabIds: Set<TabInfoId>
  ): TabInfoId | null {
    const exactKey = entry.exactKeyClue;
    const existingTabId = previousAssociatedTabs.get(exactKey);

    if (
      existingTabId != null &&
      tabsInState[existingTabId] != null &&
      !claimedTabIds.has(existingTabId)
    ) {
      return existingTabId;
    }

    return null;
  }

  private _buildDeltaRewireLookup(
    tabRewireDeltas: readonly TabRewireDelta[],
    previousAssociatedTabs: Map<string, TabInfoId>
  ): {
    carriedTabIdsByEndKey: Map<string, TabInfoId>;
    nonCarryEndKeys: Set<string>;
  } {
    const carriedTabIdsByEndKey = new Map<string, TabInfoId>();
    const nonCarryEndKeys = new Set<string>();

    for (const delta of tabRewireDeltas) {
      const endExactKeyClue =
        delta.endExactKeyClue ?? delta.after?.exactKeyClue;

      if (delta.stateTransfer.disposition !== 'carry') {
        if (endExactKeyClue != null) {
          nonCarryEndKeys.add(endExactKeyClue);
        }
        continue;
      }

      const entryExactKeyClue =
        delta.entryExactKeyClue ?? delta.before?.exactKeyClue;

      if (entryExactKeyClue == null || endExactKeyClue == null) {
        continue;
      }

      const existingTabId = previousAssociatedTabs.get(entryExactKeyClue);

      if (
        existingTabId != null &&
        !carriedTabIdsByEndKey.has(endExactKeyClue)
      ) {
        carriedTabIdsByEndKey.set(endExactKeyClue, existingTabId);
      }
    }

    return {
      carriedTabIdsByEndKey,
      nonCarryEndKeys
    };
  }

  private _resolveDeltaTrackedTabId(
    entry: TabEntrySnapshot,
    tabsInState: Record<TabInfoId, TabInfo>,
    previousAssociatedTabs: Map<string, TabInfoId>,
    carriedTabIdsByEndKey: Map<string, TabInfoId>,
    nonCarryEndKeys: Set<string>,
    claimedTabIds: Set<TabInfoId>
  ): TabInfoId | null {
    const exactKey = entry.exactKeyClue;
    const carriedTabId = carriedTabIdsByEndKey.get(exactKey);

    if (
      carriedTabId != null &&
      tabsInState[carriedTabId] != null &&
      !claimedTabIds.has(carriedTabId)
    ) {
      return carriedTabId;
    }

    if (nonCarryEndKeys.has(exactKey)) {
      return null;
    }

    const exactContinuityTabId = previousAssociatedTabs.get(exactKey);

    if (
      exactContinuityTabId != null &&
      tabsInState[exactContinuityTabId] != null &&
      !claimedTabIds.has(exactContinuityTabId)
    ) {
      return exactContinuityTabId;
    }

    return null;
  }

  private _applyTrackedTabs(
    nextTabs: Record<TabInfoId, TabInfo>,
    currentAssociatedTabs: Map<string, TabInfoId>,
    nextAssociatedTabs: Map<string, TabInfoId>,
    source: ResolvedTabChangeEvent['source']
  ): Map<string, TabInfoId> {
    const tabsInState = this._tabActiveStateStore.getSnapshot().context.tabs;
    const liveTabIds = new Set(Object.keys(nextTabs) as TabInfoId[]);

    if (
      !this._hasTrackedTabsChanged(
        tabsInState,
        nextTabs,
        currentAssociatedTabs,
        nextAssociatedTabs
      )
    ) {
      this._associatedInstanceRegistry.pruneAssociatedInstances(liveTabIds);
      return currentAssociatedTabs;
    }

    this._associatedInstanceRegistry.pruneAssociatedInstances(liveTabIds);
    this._tabActiveStateStore.send({ type: 'SET_TABS', tabs: nextTabs });

    return nextAssociatedTabs;
  }

  private _syncSnapshotTabs(
    snapshot: WindowSnapshot,
    associatedTabs: Map<string, TabInfoId>
  ): Map<string, TabInfoId> {
    const tabsInState = this._tabActiveStateStore.getSnapshot().context.tabs;
    const nextTabs: Record<TabInfoId, TabInfo> = {};
    const previousAssociatedTabs = new Map(associatedTabs);
    const nextAssociatedTabs = new Map<string, TabInfoId>();
    const claimedTabIds = new Set<TabInfoId>();

    for (const entry of snapshot.tabs.values()) {
      const existingTabId = this._resolveSnapshotTrackedTabId(
        entry,
        tabsInState,
        previousAssociatedTabs,
        claimedTabIds
      );

      if (existingTabId != null) {
        claimedTabIds.add(existingTabId);
        nextTabs[existingTabId] = this._mergeTabInfoFromEntry(
          tabsInState[existingTabId],
          entry
        );
        nextAssociatedTabs.set(entry.exactKeyClue, existingTabId);
        continue;
      }

      const newTabInfo = this._createTabInfoFromEntry(entry);

      claimedTabIds.add(newTabInfo.id);
      nextTabs[newTabInfo.id] = newTabInfo;
      nextAssociatedTabs.set(entry.exactKeyClue, newTabInfo.id);
    }

    return this._applyTrackedTabs(
      nextTabs,
      associatedTabs,
      nextAssociatedTabs,
      'snapshot'
    );
  }

  private _syncDeltaTabs(
    event: ResolvedTabChangeEvent,
    associatedTabs: Map<string, TabInfoId>
  ): Map<string, TabInfoId> {
    const tabsInState = this._tabActiveStateStore.getSnapshot().context.tabs;
    const nextTabs: Record<TabInfoId, TabInfo> = {};
    const previousAssociatedTabs = new Map(associatedTabs);
    const nextAssociatedTabs = new Map<string, TabInfoId>();
    const claimedTabIds = new Set<TabInfoId>();
    const { carriedTabIdsByEndKey, nonCarryEndKeys } =
      this._buildDeltaRewireLookup(
        event.tabRewireDeltas,
        previousAssociatedTabs
      );

    for (const entry of event.afterSnapshot.tabs.values()) {
      const existingTabId = this._resolveDeltaTrackedTabId(
        entry,
        tabsInState,
        previousAssociatedTabs,
        carriedTabIdsByEndKey,
        nonCarryEndKeys,
        claimedTabIds
      );

      if (existingTabId != null) {
        const existingTabInfo = tabsInState[existingTabId];

        claimedTabIds.add(existingTabId);
        nextTabs[existingTabId] =
          existingTabInfo != null
            ? this._mergeTabInfoFromEntry(existingTabInfo, entry)
            : this._createTabInfoFromEntry(entry);
        nextAssociatedTabs.set(entry.exactKeyClue, existingTabId);
        continue;
      }

      const newTabInfo = this._createTabInfoFromEntry(entry);

      claimedTabIds.add(newTabInfo.id);
      nextTabs[newTabInfo.id] = newTabInfo;
      nextAssociatedTabs.set(entry.exactKeyClue, newTabInfo.id);
    }

    return this._applyTrackedTabs(
      nextTabs,
      associatedTabs,
      nextAssociatedTabs,
      event.source
    );
  }
}