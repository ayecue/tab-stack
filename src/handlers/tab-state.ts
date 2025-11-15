import debounce, { DebouncedFunction } from 'debounce';
import { nanoid } from 'nanoid';
import { Disposable, Event, EventEmitter, Uri } from 'vscode';

import { ConfigService } from '../services/config';
import { createTabStateStore, TabStateStore } from '../stores/tab-state';
import { transform as migrate } from '../transformers/migration';
import {
  toAbsoluteTabStateFile,
  toRelativeTabStateFile
} from '../transformers/tab-uris';
import { aggregateTrackerKeysFromTabState } from '../transformers/tracker-key';
import { PersistenceHandler } from '../types/persistence';
import { EditorSelection, SelectionRange } from '../types/selection-tracker';
import { TabStateStoreContext } from '../types/store';
import {
  createEmptyStateContainer,
  CURRENT_STATE_FILE_VERSION,
  QuickSlotAssignments,
  QuickSlotIndex,
  StateContainer,
  TabManagerState,
  TabStateFileContent
} from '../types/tab-manager';
import { getEditorLayout } from '../utils/commands';
import { getTabState } from '../utils/tab-utils';

export class TabStateHandler implements Disposable {
  static readonly SAVE_DEBOUNCE_DELAY = 500 as const;

  save: DebouncedFunction<() => Promise<void>>;

  private _tabStore: TabStateStore;
  private _persistenceHandler: PersistenceHandler;
  private _configService: ConfigService;
  private _storeSubscription: { unsubscribe: () => void } | null;
  private _stateUpdateEmitter: EventEmitter<TabStateStoreContext>;
  private _importStateEmitter: EventEmitter<TabStateStoreContext>;

  constructor(
    configService: ConfigService,
    persistenceHandler: PersistenceHandler
  ) {
    this.save = debounce(
      this._save.bind(this),
      TabStateHandler.SAVE_DEBOUNCE_DELAY
    );
    this._stateUpdateEmitter = new EventEmitter<TabStateStoreContext>();
    this._importStateEmitter = new EventEmitter<TabStateStoreContext>();
    this._configService = configService;
    this._tabStore = createTabStateStore();
    this._persistenceHandler = persistenceHandler;
    this._storeSubscription = null;
  }

  async initialize() {
    await this._persistenceHandler.load();

    const fileState = this._persistenceHandler.get();

    if (!fileState) {
      return;
    }

    // Initialize the store with the loaded data
    this._tabStore.send({
      type: 'INITIALIZE',
      data: fileState
    });

    // Update current state if needed
    if (this._tabStore.getSnapshot().context.currentStateContainer == null) {
      await this.syncStateWithVSCode();
    }

    // Subscribe to store changes to trigger saves
    this._storeSubscription = this._tabStore.subscribe(async () => {
      const snapshot = this._tabStore.getSnapshot();

      if (snapshot.context.currentStateContainer == null) {
        void this.syncStateWithVSCode();
        return;
      }

      void this.save();

      this._stateUpdateEmitter.fire(snapshot.context);
    });
  }

  get onDidChangeState(): Event<TabStateStoreContext> {
    return this._stateUpdateEmitter.event;
  }

  get onDidImportState(): Event<TabStateStoreContext> {
    return this._importStateEmitter.event;
  }

  get groups() {
    return this._tabStore.getSnapshot().context.groups;
  }

  get history() {
    return this._tabStore.getSnapshot().context.history;
  }

  get addons() {
    return this._tabStore.getSnapshot().context.addons;
  }

  get stateContainer() {
    return this._tabStore.getSnapshot().context.currentStateContainer;
  }

  get previousStateContainer() {
    return this._tabStore.getSnapshot().context.previousStateContainer;
  }

  addToHistory(state: TabManagerState): StateContainer | null {
    const stateContainer: StateContainer = {
      id: nanoid(),
      name: new Date().toISOString(),
      state,
      createdAt: Date.now(),
      lastSelectedAt: Date.now()
    };

    this._tabStore.send({ type: 'ADD_TO_HISTORY', stateContainer });

    const maxEntries = this._configService.getHistoryMaxEntries();
    this._tabStore.send({ type: 'PRUNE_HISTORY', maxEntries });

    return stateContainer;
  }

  addToAddons(state: TabManagerState, name: string): StateContainer | null {
    const snapshot = this._tabStore.getSnapshot();
    const isNameAlreadyExisting = Object.values(snapshot.context.addons).some(
      (it) => it.name == name
    );

    if (isNameAlreadyExisting) {
      return null;
    }

    const stateContainer: StateContainer = {
      id: nanoid(),
      name,
      state,
      createdAt: Date.now(),
      lastSelectedAt: 0
    };

    this._tabStore.send({
      type: 'CREATE_ADDON',
      stateContainer
    });

    return stateContainer;
  }

  async syncStateWithVSCode(): Promise<StateContainer> {
    const tabState = getTabState();
    const layout = await getEditorLayout();
    const snapshot = this._tabStore.getSnapshot();
    const availableSelectionIds = aggregateTrackerKeysFromTabState(tabState);
    const baseStateContainer =
      snapshot.context.currentStateContainer ?? createEmptyStateContainer();
    const selectionMap = baseStateContainer.state.selectionMap ?? {};
    const newStateContainer = {
      ...baseStateContainer,
      state: {
        selectionMap: availableSelectionIds.reduce<
          Record<string, SelectionRange>
        >((result, id) => {
          if (id in selectionMap) {
            result[id] = selectionMap[id];
          }
          return result;
        }, {}),
        tabState,
        layout
      }
    };

    console.log(
      '>>',
      availableSelectionIds,
      newStateContainer.state.selectionMap
    );

    this._tabStore.send({
      type: 'SYNC_STATE',
      stateContainer: newStateContainer
    });

    return newStateContainer;
  }

  syncSelection(editorSelection: EditorSelection) {
    const snapshot = this._tabStore.getSnapshot();
    const baseStateContainer =
      snapshot.context.currentStateContainer ?? createEmptyStateContainer();
    const selectionMap = baseStateContainer.state.selectionMap ?? {};
    const newStateContainer = {
      ...baseStateContainer,
      state: {
        ...baseStateContainer.state,
        selectionMap: {
          ...selectionMap,
          [editorSelection.id]: editorSelection.selection
        }
      }
    };

    console.log('>>', newStateContainer.state.selectionMap);

    this._tabStore.send({
      type: 'SYNC_STATE',
      stateContainer: newStateContainer
    });

    return newStateContainer;
  }

  forkState() {
    this._tabStore.send({ type: 'FORK_STATE' });
  }

  setState(stateContainer: StateContainer): void {
    this._tabStore.send({ type: 'SET_STATE', stateContainer });
  }

  loadState(groupId: string | null) {
    if (!groupId) {
      return false;
    }

    const snapshot = this._tabStore.getSnapshot();

    if (!snapshot.context.groups[groupId]) {
      return false;
    }

    this._tabStore.send({ type: 'LOAD_GROUP', groupId, timestamp: Date.now() });
    return true;
  }

  loadHistoryState(historyId: string) {
    const snapshot = this._tabStore.getSnapshot();
    if (!snapshot.context.history[historyId]) {
      return false;
    }
    this._tabStore.send({ type: 'LOAD_HISTORY_STATE', historyId });
    return true;
  }

  async createGroup(name: string): Promise<StateContainer | null> {
    const snapshot = this._tabStore.getSnapshot();
    const isNameAlreadyExisting = Object.values(snapshot.context.groups).some(
      (it) => it.name == name
    );

    if (isNameAlreadyExisting) {
      return null;
    }

    const newStateContainer = await this.syncStateWithVSCode();

    const stateContainer: StateContainer = {
      id: nanoid(),
      name,
      state: newStateContainer.state,
      createdAt: Date.now(),
      lastSelectedAt: Date.now()
    };

    this._tabStore.send({
      type: 'CREATE_GROUP',
      stateContainer
    });

    return this._tabStore.getSnapshot().context.currentStateContainer!;
  }

  renameGroup(groupId: string, newName: string): boolean {
    const snapshot = this._tabStore.getSnapshot();
    if (!snapshot.context.groups[groupId]) {
      return false;
    }
    this._tabStore.send({ type: 'RENAME_GROUP', groupId, newName });
    return true;
  }

  async addCurrentStateToHistory(): Promise<StateContainer | null> {
    const lastStateContainer = await this.syncStateWithVSCode();
    const newStateContainer = this.addToHistory(lastStateContainer.state);
    return newStateContainer;
  }

  deleteGroup(groupId: string): boolean {
    const snapshot = this._tabStore.getSnapshot();
    if (!snapshot.context.groups[groupId]) {
      return false;
    }
    this._tabStore.send({ type: 'DELETE_GROUP', groupId });
    return true;
  }

  deleteHistoryEntry(historyId: string): boolean {
    const snapshot = this._tabStore.getSnapshot();
    if (!snapshot.context.history[historyId]) {
      return false;
    }
    this._tabStore.send({ type: 'DELETE_HISTORY_ENTRY', historyId });
    return true;
  }

  deleteAddon(addonId: string): boolean {
    const snapshot = this._tabStore.getSnapshot();
    if (!snapshot.context.addons[addonId]) {
      return false;
    }
    this._tabStore.send({ type: 'DELETE_ADDON', addonId });
    return true;
  }

  renameAddon(addonId: string, newName: string): boolean {
    const snapshot = this._tabStore.getSnapshot();
    if (!snapshot.context.addons[addonId]) {
      return false;
    }
    this._tabStore.send({ type: 'RENAME_ADDON', addonId, newName });
    return true;
  }

  private _save() {
    const snapshot = this._tabStore.getSnapshot();
    const context = snapshot.context;

    this._persistenceHandler.save({
      version: CURRENT_STATE_FILE_VERSION,
      groups: context.groups,
      history: context.history,
      addons: context.addons,
      selectedGroup: context.currentStateContainer?.id || null,
      previousSelectedGroup: context.previousStateContainer?.id || null,
      quickSlots: context.quickSlots
    });
  }

  dispose() {
    this._storeSubscription?.unsubscribe();
    this._persistenceHandler.reset();
    this._stateUpdateEmitter.dispose();
    this._importStateEmitter.dispose();
  }

  getGroups(): Record<string, StateContainer> {
    return this._tabStore.getSnapshot().context.groups;
  }

  getHistory(): Record<string, StateContainer> {
    return this._tabStore.getSnapshot().context.history;
  }

  getAddons(): Record<string, StateContainer> {
    return this._tabStore.getSnapshot().context.addons;
  }

  getQuickSlots(): QuickSlotAssignments {
    return this._tabStore.getSnapshot().context.quickSlots;
  }

  setQuickSlot(slot: QuickSlotIndex, groupId: string | null): void {
    const snapshot = this._tabStore.getSnapshot();

    if (groupId == null) {
      this._tabStore.send({ type: 'CLEAR_QUICK_SLOT', slot });
      return;
    }

    if (!snapshot.context.groups[groupId]) {
      return;
    }

    this._tabStore.send({ type: 'SET_QUICK_SLOT', slot, groupId });
  }

  getQuickSlotAssignment(slot: QuickSlotIndex): string | null {
    const quickSlots = this._tabStore.getSnapshot().context.quickSlots;
    return quickSlots[slot] ?? null;
  }

  async reloadStateFile(): Promise<void> {
    this._persistenceHandler.reset();
    this._tabStore.send({ type: 'RESET_STATE' });
    await this.initialize();
  }

  exportStateFile(): TabStateFileContent {
    const fileData = this._persistenceHandler.get();

    if (!fileData) {
      return null;
    }

    return toRelativeTabStateFile(fileData);
  }

  importStateFile(fileContent: any): boolean {
    const workspaceFolder = this._configService.getMasterWorkspaceFolder();

    if (!workspaceFolder) {
      return false;
    }

    const newContent = toAbsoluteTabStateFile(
      migrate(fileContent),
      Uri.parse(workspaceFolder)
    );

    this._tabStore.send({
      type: 'IMPORT_STATE',
      data: {
        version: newContent.version,
        groups: newContent.groups,
        history: newContent.history,
        addons: newContent.addons,
        quickSlots: newContent.quickSlots,
        selectedGroup: newContent.selectedGroup,
        previousSelectedGroup: newContent.previousSelectedGroup
      }
    });

    this._importStateEmitter.fire(this._tabStore.getSnapshot().context);

    return true;
  }
}
