import { Disposable, EventEmitter } from 'vscode';

import { getLogger, ScopedLogger } from '../services/logger';
import {
  createTabCollectionStateStore,
  TabCollectionStateStore
} from '../stores/tab-collection-state';
import { TabCollectionStateStoreContext } from '../types/store';
import {
  QuickSlotAssignments,
  QuickSlotIndex,
  StateContainer
} from '../types/tab-manager';

export class TabCollectionStateHandler implements Disposable {
  private _tabCollectionStateStore: TabCollectionStateStore;
  private _disposables: Disposable[];
  private _stateUpdateEmitter: EventEmitter<TabCollectionStateStoreContext>;
  private _storeSubscription: { unsubscribe: () => void } | null;
  private _log: ScopedLogger;

  constructor() {
    this._tabCollectionStateStore = createTabCollectionStateStore();
    this._disposables = [];
    this._stateUpdateEmitter =
      new EventEmitter<TabCollectionStateStoreContext>();
    this._storeSubscription = null;
    this._log = getLogger().child('CollectionHandler');

    this.initializeEvents();
  }

  private initializeEvents() {
    // Store subscription to emit state updates
    this._storeSubscription = this._tabCollectionStateStore.subscribe(() => {
      this._stateUpdateEmitter.fire(
        this._tabCollectionStateStore.getSnapshot().context
      );
    });
  }

  get onDidChangeState() {
    return this._stateUpdateEmitter.event;
  }

  get groups(): Record<string, StateContainer> {
    return this._tabCollectionStateStore.getSnapshot().context.groups;
  }

  get history(): Record<string, StateContainer> {
    return this._tabCollectionStateStore.getSnapshot().context.history;
  }

  get addons(): Record<string, StateContainer> {
    return this._tabCollectionStateStore.getSnapshot().context.addons;
  }

  get quickSlots(): QuickSlotAssignments {
    return this._tabCollectionStateStore.getSnapshot().context.quickSlots;
  }

  initialize(data: TabCollectionStateStoreContext): void {
    this._tabCollectionStateStore.send({
      type: 'INITIALIZE',
      data
    });
  }

  setCollections(collections: {
    groups: Record<string, StateContainer>;
    history: Record<string, StateContainer>;
    addons: Record<string, StateContainer>;
    quickSlots: QuickSlotAssignments;
  }): void {
    this._tabCollectionStateStore.send({
      type: 'INITIALIZE',
      data: collections
    });
  }

  addGroup(stateContainer: StateContainer): void {
    this._log.debug(`addGroup: ${stateContainer.name} (${stateContainer.id})`);
    this._tabCollectionStateStore.send({
      type: 'CREATE_GROUP',
      stateContainer
    });
  }

  updateGroup(groupId: string, stateContainer: StateContainer): void {
    this._log.debug(`updateGroup: ${groupId}`);
    this._tabCollectionStateStore.send({
      type: 'UPDATE_GROUP',
      groupId,
      stateContainer
    });
  }

  renameGroup(groupId: string, newName: string): boolean {
    const snapshot = this._tabCollectionStateStore.getSnapshot();
    if (!snapshot.context.groups[groupId]) {
      return false;
    }
    this._log.debug(`renameGroup: ${groupId} -> ${newName}`);
    this._tabCollectionStateStore.send({
      type: 'RENAME_GROUP',
      groupId,
      newName
    });
    return true;
  }

  removeGroup(groupId: string): boolean {
    const snapshot = this._tabCollectionStateStore.getSnapshot();
    if (!snapshot.context.groups[groupId]) {
      return false;
    }
    this._log.debug(`removeGroup: ${groupId}`);
    this._tabCollectionStateStore.send({
      type: 'DELETE_GROUP',
      groupId
    });
    return true;
  }

  loadGroup(groupId: string): boolean {
    const snapshot = this._tabCollectionStateStore.getSnapshot();
    if (!snapshot.context.groups[groupId]) {
      return false;
    }
    this._log.debug(`loadGroup: ${groupId}`);
    this._tabCollectionStateStore.send({
      type: 'LOAD_GROUP',
      groupId,
      timestamp: Date.now()
    });
    return true;
  }

  addHistory(stateContainer: StateContainer): void {
    this._log.debug(
      `addHistory: ${stateContainer.name} (${stateContainer.id})`
    );
    this._tabCollectionStateStore.send({
      type: 'ADD_TO_HISTORY',
      stateContainer
    });
  }

  pruneHistory(maxEntries: number): void {
    this._tabCollectionStateStore.send({
      type: 'PRUNE_HISTORY',
      maxEntries
    });
  }

  removeHistory(historyId: string): boolean {
    const snapshot = this._tabCollectionStateStore.getSnapshot();
    if (!snapshot.context.history[historyId]) {
      return false;
    }
    this._tabCollectionStateStore.send({
      type: 'DELETE_HISTORY_ENTRY',
      historyId
    });
    return true;
  }

  addAddon(stateContainer: StateContainer): void {
    this._log.debug(`addAddon: ${stateContainer.name} (${stateContainer.id})`);
    this._tabCollectionStateStore.send({
      type: 'CREATE_ADDON',
      stateContainer
    });
  }

  renameAddon(addonId: string, newName: string): boolean {
    const snapshot = this._tabCollectionStateStore.getSnapshot();
    if (!snapshot.context.addons[addonId]) {
      return false;
    }
    this._tabCollectionStateStore.send({
      type: 'RENAME_ADDON',
      addonId,
      newName
    });
    return true;
  }

  removeAddon(addonId: string): boolean {
    const snapshot = this._tabCollectionStateStore.getSnapshot();
    if (!snapshot.context.addons[addonId]) {
      return false;
    }
    this._tabCollectionStateStore.send({
      type: 'DELETE_ADDON',
      addonId
    });
    return true;
  }

  setQuickSlot(slot: QuickSlotIndex, groupId: string | null): void {
    if (groupId == null) {
      this._tabCollectionStateStore.send({
        type: 'CLEAR_QUICK_SLOT',
        slot
      });
      return;
    }

    const snapshot = this._tabCollectionStateStore.getSnapshot();

    if (!snapshot.context.groups[groupId]) {
      return;
    }

    if (snapshot.context.quickSlots[slot] === groupId) {
      return;
    }

    Object.entries(snapshot.context.quickSlots).forEach(
      ([assignedSlot, assignedGroupId]) => {
        if (assignedGroupId !== groupId) return;

        this._tabCollectionStateStore.send({
          type: 'CLEAR_QUICK_SLOT',
          slot: assignedSlot as QuickSlotIndex
        });
      }
    );

    this._tabCollectionStateStore.send({
      type: 'SET_QUICK_SLOT',
      slot,
      groupId
    });
  }

  getQuickSlotAssignment(slot: QuickSlotIndex): string | null {
    const quickSlots =
      this._tabCollectionStateStore.getSnapshot().context.quickSlots;
    return quickSlots[slot] ?? null;
  }

  reset(): void {
    this._tabCollectionStateStore.send({
      type: 'RESET'
    });
  }

  dispose() {
    this._storeSubscription?.unsubscribe();
    this._disposables.forEach((d) => d.dispose());
    this._stateUpdateEmitter.dispose();
  }
}
