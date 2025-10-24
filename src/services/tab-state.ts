import debounce from 'debounce';
import { nanoid } from 'nanoid';
import { Disposable, Uri, window, workspace } from 'vscode';

import { transform } from '../transformers/state-migration';
import { transformTabToTabInfo } from '../transformers/tab';
import { StorageFile } from '../types/storage';
import {
  createDefaultTabStateFileContent,
  CURRENT_STATE_FILE_VERSION,
  EMPTY_GROUP_SELECTION,
  GroupSelectionValue,
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
  private _selectedGroup: GroupSelectionValue | null;
  private _previousSelectedGroup: GroupSelectionValue | null;
  private _quickSlots: QuickSlotAssignments | null;
  private _state: StateContainer | null;
  private _configService: ConfigService;

  constructor(configService: ConfigService) {
    this._configService = configService;
    this._history = null;
    this._groups = null;
    this._selectedGroup = null;
    this._previousSelectedGroup = null;
    this._quickSlots = null;
    this._state = null;
    this._pendingFile = null;
    this._file = null;
    this.save = debounce(this._save.bind(this), TabStateService.DEBOUNCE_DELAY);
  }

  async initialize() {
    await Promise.all([
      this.getSelectedGroup(),
      this.getPreviousSelectedGroup(),
      this.getGroups(),
      this.getHistory(),
      this.getQuickSlots()
    ]);
  }

  get selectedGroup() {
    return this._selectedGroup;
  }

  async setSelectedGroup(groupId: GroupSelectionValue) {
    if (groupId === this._selectedGroup) {
      return;
    }

    this._previousSelectedGroup = this._selectedGroup;
    this._selectedGroup = groupId;

    await this.save();
  }

  get groups() {
    return this._groups ?? {};
  }

  get history() {
    return this._history ?? {};
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
    this._state = null;

    await this.getState();

    if (this._selectedGroup && this._groups) {
      this._groups[this._selectedGroup].state = this._state!.state;
      await this.save();
    }

    return this._state;
  }

  setState(state: StateContainer) {
    this._state = state;
  }

  private initializeStateFromFileState(fileState: TabStateFileContent) {
    if (fileState.selectedGroup != null) {
      const state: StateContainer = {
        id: nanoid(),
        name: 'untitled',
        state: fileState.groups[fileState.selectedGroup]!.state,
        lastSelectedAt: 0,
        createdAt: Date.now()
      };

      this._state = state;
    }
  }

  async getState(): Promise<StateContainer> {
    if (this._state) {
      return this._state;
    }

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

    await this.getGroups();

    const state: StateContainer = {
      id: nanoid(),
      name: 'untitled',
      state: {
        tabState,
        layout: await getEditorLayout()
      },
      lastSelectedAt: 0,
      createdAt: Date.now()
    };

    this._state = state;
    return state;
  }

  async loadState(groupId: string | null): Promise<boolean> {
    if (!groupId) {
      return false;
    }

    const groups = await this.getGroups();

    if (groups && groups[groupId]) {
      this._state = groups[groupId];
      this._state.lastSelectedAt = Date.now();
      await this.setSelectedGroup(groupId);
      return true;
    }

    return false;
  }

  async loadHistoryState(historyId: string): Promise<boolean> {
    const history = await this.getHistory();

    if (history && history[historyId]) {
      this._state = history[historyId];
      await this.setSelectedGroup(EMPTY_GROUP_SELECTION);
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
    this._state = stateContainer;

    await this.setSelectedGroup(stateContainer.id);

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

    if (this._selectedGroup === groupId) {
      this._selectedGroup = EMPTY_GROUP_SELECTION;
    }

    if (this._previousSelectedGroup === groupId) {
      this._previousSelectedGroup = EMPTY_GROUP_SELECTION;
    }

    const quickSlots = await this.getQuickSlots();
    const currentQuickSlotIndex = Object.keys(quickSlots).find(
      (index) => quickSlots[index] === groupId
    );

    if (currentQuickSlotIndex != null) {
      delete quickSlots[currentQuickSlotIndex];
    }

    this._groups = groups;
    this._state = null;

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
    this._state = null;

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

  async getSelectedGroup(): Promise<GroupSelectionValue> {
    if (this._selectedGroup !== null) {
      return this._selectedGroup;
    }

    const stateFile = await this.getStateFile();
    const selectedGroup =
      stateFile?.data?.selectedGroup || EMPTY_GROUP_SELECTION;

    this._selectedGroup = selectedGroup;

    return this._selectedGroup;
  }

  async getPreviousSelectedGroup(): Promise<GroupSelectionValue> {
    if (this._previousSelectedGroup !== null) {
      return this._previousSelectedGroup;
    }

    const stateFile = await this.getStateFile();
    const previousSelectedGroup =
      stateFile?.data?.previousSelectedGroup || EMPTY_GROUP_SELECTION;

    this._previousSelectedGroup = previousSelectedGroup;

    return this._previousSelectedGroup;
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
    this._state = null;
    this._selectedGroup = null;
    this._previousSelectedGroup = null;
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

    const [groups, history, selectedGroup, previousSelectedGroup, quickSlots] =
      await Promise.all([
        this.getGroups(),
        this.getHistory(),
        this.getSelectedGroup(),
        this.getPreviousSelectedGroup(),
        this.getQuickSlots()
      ]);

    await stateFile.save({
      version: CURRENT_STATE_FILE_VERSION,
      groups,
      history,
      selectedGroup: selectedGroup ?? EMPTY_GROUP_SELECTION,
      previousSelectedGroup: previousSelectedGroup ?? EMPTY_GROUP_SELECTION,
      quickSlots
    });
  }

  dispose() {
    this._file = null;
    this._pendingFile = null;
    this._groups = null;
    this._history = null;
    this._state = null;
    this._selectedGroup = null;
    this._previousSelectedGroup = null;
    this._quickSlots = null;
  }
}
