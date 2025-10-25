import debounce from 'debounce';
import { nanoid } from 'nanoid';
import { Disposable, Uri, window, workspace } from 'vscode';

import { transform } from '../transformers/state-migration';
import { transformTabToTabInfo } from '../transformers/tab';
import { StorageFile } from '../types/storage';
import {
  createDefaultTabStateFileContent,
  createEmptyStateContainer,
  CURRENT_STATE_FILE_VERSION,
  QuickSlotAssignments,
  QuickSlotIndex,
  StateContainer,
  TabManagerState,
  TabStateFileContent
} from '../types/tab-manager';
import { TabGroupInfo, TabInfo, TabState } from '../types/tabs';
import { getEditorLayout } from '../utils/commands';
import { InMemoryJsonFile } from '../utils/in-memory-json-file';
import { PersistentJsonFile } from '../utils/persistent-json-file';
import { ConfigService } from './config';

export class TabStateService implements Disposable {
  static readonly MAX_HISTORY: number = 10 as const;
  static readonly DEBOUNCE_DELAY = 200 as const;

  save: () => Promise<void>;

  private _pendingFile: Promise<StorageFile<TabStateFileContent>> | null;
  private _file: StorageFile<TabStateFileContent> | null;

  private _history: Record<string, StateContainer> | null;
  private _groups: Record<string, StateContainer> | null;
  // undefined = no selected group, null = not loaded
  private _quickSlots: QuickSlotAssignments | null;
  private _stateContainer: StateContainer | null;
  private _previousStateContainer: StateContainer | null;
  private _configService: ConfigService;

  constructor(configService: ConfigService) {
    this._configService = configService;
    this._history = null;
    this._groups = null;
    this._quickSlots = null;
    this._stateContainer = null;
    this._pendingFile = null;
    this._file = null;
    this.save = debounce(this._save.bind(this), TabStateService.DEBOUNCE_DELAY);
  }

  async initialize() {
    await Promise.all([
      this.getGroups(),
      this.getHistory(),
      this.getQuickSlots()
    ]);

    if (this._stateContainer == null) {
      await this.updateState();
    }
  }

  get groups() {
    return this._groups ?? {};
  }

  get history() {
    return this._history ?? {};
  }

  get stateContainer() {
    return this._stateContainer;
  }

  get previousStateContainer() {
    return this._previousStateContainer;
  }

  async addToHistory(state: TabManagerState): Promise<string> {
    const history = await this.getHistory();
    const stateContainer: StateContainer = {
      id: nanoid(),
      name: new Date().toISOString(),
      state,
      createdAt: Date.now(),
      lastSelectedAt: Date.now()
    };

    history[stateContainer.id] = stateContainer;

    const keys = Object.keys(history);

    if (keys.length > TabStateService.MAX_HISTORY) {
      const keysToRemove = keys.slice(
        0,
        keys.length - TabStateService.MAX_HISTORY
      );
      keysToRemove.forEach((key) => delete history[key]);
    }

    return stateContainer.id;
  }

  async refreshState() {
    await this.updateState();

    if (this._stateContainer.id in this._groups) {
      await this.save();
    }

    return this._stateContainer;
  }

  private initializeStateFromFileState(fileState: TabStateFileContent) {
    if (fileState.selectedGroup in fileState.groups) {
      this._stateContainer = fileState.groups[fileState.selectedGroup];
    }

    if (fileState.previousSelectedGroup in fileState.groups) {
      this._previousStateContainer =
        fileState.groups[fileState.previousSelectedGroup];
    }
  }

  async updateState(): Promise<void> {
    const tabState: TabState = {
      tabGroups: {},
      activeGroup: window.tabGroups.activeTabGroup.viewColumn ?? null
    };

    window.tabGroups.all.forEach((group) => {
      const viewColumn = group.viewColumn || 0;
      const tabGroupInfo: TabGroupInfo = {
        tabs: [],
        activeTab: undefined,
        viewColumn: viewColumn || 0
      };

      group.tabs.forEach((tab) => {
        const tabInfo: TabInfo = transformTabToTabInfo(tab, group.viewColumn);

        if (tab.isActive) {
          tabGroupInfo.activeTab = tabInfo;
        }

        tabGroupInfo.tabs.push(tabInfo);
      });

      tabState.tabGroups[viewColumn] = tabGroupInfo;
    });

    const newState =
      this._stateContainer != null
        ? this._stateContainer
        : createEmptyStateContainer();

    newState.state = {
      tabState,
      layout: await getEditorLayout()
    };

    console.log('Update state:', this._stateContainer);

    this._stateContainer = newState;
  }

  async forkState(): Promise<void> {
    this.setState(null);
    await this.updateState();
  }

  setState(stateContainer: StateContainer): void {
    this._previousStateContainer = this._stateContainer;
    this._stateContainer = stateContainer;
  }

  async loadState(groupId: string | null): Promise<boolean> {
    if (!groupId) {
      return false;
    }

    const groups = await this.getGroups();

    if (groups && groups[groupId]) {
      this.setState(groups[groupId]);
      this._stateContainer.lastSelectedAt = Date.now();
      return true;
    }

    return false;
  }

  async loadHistoryState(historyId: string): Promise<boolean> {
    const history = await this.getHistory();

    if (history && history[historyId]) {
      this.setState(history[historyId]);
      return true;
    }

    return false;
  }

  async createGroup(name: string): Promise<boolean> {
    const groups = await this.getGroups();
    const isNameAlreadyExisting = Object.values(groups).some(
      (g) => g.name === name
    );

    if (isNameAlreadyExisting) {
      return false;
    }

    const snapshot = await this.refreshState();
    const stateContainer: StateContainer = {
      id: nanoid(),
      name,
      state: snapshot.state,
      createdAt: Date.now(),
      lastSelectedAt: Date.now()
    };

    groups[stateContainer.id] = stateContainer;
    this.setState(stateContainer);

    return true;
  }

  async renameGroup(groupId: string, newName: string): Promise<boolean> {
    const [groups] = await Promise.all([this.getGroups()]);

    if (groups[groupId] == null) {
      return false;
    }

    const metaData = groups[groupId];
    metaData.name = newName;

    await this.save();

    return true;
  }

  async addCurrentStateToHistory(): Promise<string> {
    const snapshot = await this.refreshState();
    const id = await this.addToHistory(snapshot.state);

    await this.save();

    return id;
  }

  async deleteGroup(groupId: string): Promise<boolean> {
    const groups = await this.getGroups();

    if (!groups[groupId]) {
      return false;
    }

    delete groups[groupId];

    const quickSlots = await this.getQuickSlots();
    const currentQuickSlotIndex = Object.keys(quickSlots).find(
      (index) => quickSlots[index] === groupId
    );

    if (currentQuickSlotIndex != null) {
      delete quickSlots[currentQuickSlotIndex];
    }

    this._groups = groups;

    if (this._stateContainer?.id === groupId) {
      this._stateContainer = null;
      await this.updateState();
    }

    await this.save();

    return true;
  }

  async deleteHistoryEntry(historyId: string): Promise<boolean> {
    const history = await this.getHistory();

    if (!history[historyId]) {
      return false;
    }

    delete history[historyId];
    this._history = history;

    await this.save();

    return true;
  }

  private async getStateFile(): Promise<StorageFile<TabStateFileContent> | null> {
    if (this._file) {
      return this._file;
    }

    this._pendingFile = this._pendingFile ?? this.fetchStateFile();
    return this._pendingFile;
  }

  private async fetchStateFile(): Promise<StorageFile<TabStateFileContent>> {
    const masterFolderPath = this._configService.getMasterWorkspaceFolder();
    const workspaceUri = Uri.parse(masterFolderPath);

    if (!workspaceUri) {
      this._file = new InMemoryJsonFile<TabStateFileContent>(
        createDefaultTabStateFileContent
      );
      await this._file.load();
      console.warn('No workspace folder found, cannot load or save state.');
      return this._file;
    }

    const vscodeDir = Uri.joinPath(workspaceUri, '.vscode');
    console.log('Loading state file from workspace:', vscodeDir?.fsPath);
    await workspace.fs.createDirectory(vscodeDir);

    const filePath = Uri.joinPath(vscodeDir, 'tmstate.json');

    this._file = new PersistentJsonFile<TabStateFileContent>(
      filePath,
      createDefaultTabStateFileContent
    );

    await this._file.load();

    const fileState = transform(this._file.data);
    this.initializeStateFromFileState(fileState);
    this._file.data = fileState;

    return this._file;
  }

  async getGroups(): Promise<Record<string, StateContainer>> {
    if (this._groups) {
      return this._groups;
    }

    const stateFile = await this.getStateFile();
    const storedGroups = stateFile?.data?.groups || {};

    this._groups = storedGroups;

    return this._groups;
  }

  async getHistory(): Promise<Record<string, StateContainer>> {
    if (this._history) {
      return this._history;
    }

    const stateFile = await this.getStateFile();
    const storedHistory = stateFile?.data?.history || {};

    this._history = storedHistory;

    return this._history;
  }

  async getQuickSlots(): Promise<QuickSlotAssignments> {
    if (this._quickSlots) {
      return this._quickSlots;
    }

    const stateFile = await this.getStateFile();
    const storedQuickSlots = stateFile?.data?.quickSlots || {};

    this._quickSlots = storedQuickSlots;

    return this._quickSlots;
  }

  async setQuickSlot(
    slot: QuickSlotIndex,
    groupId: string | null
  ): Promise<void> {
    const [quickSlots, groups] = await Promise.all([
      this.getQuickSlots(),
      this.getGroups()
    ]);

    if (!groups[groupId]) {
      return;
    }

    const existingSlot = Object.keys(quickSlots).find(
      (index) => quickSlots[index] === groupId
    );

    if (slot != null) {
      quickSlots[slot] = groupId;
    }

    if (existingSlot != null) {
      quickSlots[existingSlot] = null;
    }

    await this.save();
  }

  async getQuickSlotAssignment(slot: QuickSlotIndex): Promise<string | null> {
    const quickSlots = await this.getQuickSlots();
    return quickSlots[slot] ?? null;
  }

  async reloadStateFile(): Promise<void> {
    this._groups = null;
    this._history = null;
    this._stateContainer = null;
    this._previousStateContainer = null;
    this._quickSlots = null;
    this._file = null;
    this._pendingFile = null;
    await this.initialize();
  }

  private async _save() {
    const stateFile = await this.getStateFile();

    if (!stateFile) {
      return;
    }

    const [groups, history, quickSlots] = await Promise.all([
      this.getGroups(),
      this.getHistory(),
      this.getQuickSlots()
    ]);

    await stateFile.save({
      version: CURRENT_STATE_FILE_VERSION,
      groups,
      history,
      selectedGroup: this._stateContainer.id,
      previousSelectedGroup: this._previousStateContainer.id,
      quickSlots
    });
  }

  dispose() {
    this._file = null;
    this._pendingFile = null;
    this._groups = null;
    this._history = null;
    this._stateContainer = null;
    this._previousStateContainer = null;
    this._quickSlots = null;
  }
}
