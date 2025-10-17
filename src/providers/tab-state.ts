import debounce from 'debounce';
import { Disposable, Uri, window, workspace } from 'vscode';

import { transformTabToTabInfo } from '../transformer';
import { StorageFile } from '../types/storage';
import {
  createDefaultTabStateFileContent,
  EMPTY_GROUP_SELECTION,
  GroupSelectionValue,
  QuickSlotAssignments,
  QuickSlotIndex,
  TabManagerState,
  TabStateFileContent
} from '../types/tab-manager';
import { TabGroupInfo, TabInfo, TabState } from '../types/tabs';
import { getEditorLayout } from '../utils/commands';
import { getWorkspaceFolder } from '../utils/get-workspace-folder';
import { InMemoryJsonFile } from '../utils/in-memory-json-file';
import { PersistentJsonFile } from '../utils/persistent-json-file';

export class TabStateProvider implements Disposable {
  static readonly MAX_HISTORY: number = 10 as const;
  static readonly DEBOUNCE_DELAY = 200 as const;

  save: () => Promise<void>;

  private _pendingFile: Promise<StorageFile<TabStateFileContent>> | null;
  private _file: StorageFile<TabStateFileContent> | null;

  private _history: Record<string, TabManagerState> | null;
  private _groups: Record<string, TabManagerState> | null;
  // undefined = no selected group, null = not loaded
  private _selectedGroup: GroupSelectionValue | null;
  private _previousSelectedGroup: GroupSelectionValue | null;
  private _quickSlots: QuickSlotAssignments | null;
  private _state: TabManagerState | null;

  constructor() {
    this._history = null;
    this._groups = null;
    this._selectedGroup = null;
    this._previousSelectedGroup = null;
    this._quickSlots = null;
    this._state = null;
    this._pendingFile = null;
    this._file = null;
    this.save = debounce(
      this._save.bind(this),
      TabStateProvider.DEBOUNCE_DELAY
    );
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
    const timestamp = new Date().toISOString();

    history[timestamp] = state;

    const keys = Object.keys(history);

    if (keys.length > TabStateProvider.MAX_HISTORY) {
      const keysToRemove = keys.slice(
        0,
        keys.length - TabStateProvider.MAX_HISTORY
      );
      keysToRemove.forEach((key) => delete history[key]);
    }

    return timestamp;
  }

  async refreshState() {
    this._state = null;

    await this.getState();

    if (this._selectedGroup && this._groups) {
      this._groups[this._selectedGroup] = this._state;
      await this.save();
    }

    return this._state;
  }

  setState(state: TabManagerState) {
    this._state = state;
  }

  async getState(): Promise<TabManagerState> {
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

    const state: TabManagerState = {
      tabState,
      layout: await getEditorLayout()
    };

    this._state = state;
    return state;
  }

  async loadState(name: string | null): Promise<boolean> {
    if (!name) {
      return false;
    }

    const groups = await this.getGroups();

    if (groups && groups[name]) {
      this._state = groups[name];
      await this.setSelectedGroup(name);
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

    if (groups[name]) {
      return false;
    }

    const snapshot = await this.refreshState();

    groups[name] = snapshot;
    await this.setSelectedGroup(name);
    this._state = snapshot;

    return true;
  }

  async renameGroup(currentId: string, nextId: string): Promise<boolean> {
    const groups = await this.getGroups();

    if (currentId === nextId) {
      return true;
    }

    if (groups[currentId] == null || groups[nextId] != null) {
      return false;
    }

    const snapshot = groups[currentId];

    if (this._selectedGroup === currentId) {
      this._selectedGroup = nextId;
    }

    if (this._previousSelectedGroup === currentId) {
      this._previousSelectedGroup = nextId;
    }

    const quickSlots = await this.getQuickSlots();
    const currentQuickSlotIndex = Object.keys(quickSlots).find(
      (index) => quickSlots[index] === currentId
    );

    if (currentQuickSlotIndex != null) {
      quickSlots[currentQuickSlotIndex] = nextId;
    }

    this._groups[nextId] = snapshot;
    delete this._groups[currentId];
    this._quickSlots = quickSlots;

    await this.save();

    return true;
  }

  async addCurrentStateToHistory(): Promise<string> {
    const snapshot = await this.refreshState();
    const id = await this.addToHistory(snapshot);

    await this.save();

    return id;
  }

  async deleteGroup(name: string): Promise<boolean> {
    const groups = await this.getGroups();

    if (!groups[name]) {
      return false;
    }

    delete groups[name];

    if (this._selectedGroup === name) {
      this._selectedGroup = EMPTY_GROUP_SELECTION;
    }

    if (this._previousSelectedGroup === name) {
      this._previousSelectedGroup = EMPTY_GROUP_SELECTION;
    }

    const quickSlots = await this.getQuickSlots();

    Object.entries(quickSlots).forEach(([slot, groupId]) => {
      const slotIndex = Number(slot);
      if (groupId === name && Number.isInteger(slotIndex)) {
        delete quickSlots[slotIndex as QuickSlotIndex];
      }
    });

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
    const workspaceUri: Uri | null = await getWorkspaceFolder();

    if (!workspaceUri) {
      this._file = new InMemoryJsonFile<TabStateFileContent>(
        createDefaultTabStateFileContent
      );
      await this._file.load();
      console.warn('No workspace folder found, cannot load or save state.');
      return this._file;
    }

    const vscodeDir = Uri.joinPath(workspaceUri, '.vscode');
    await workspace.fs.createDirectory(vscodeDir);

    const filePath = Uri.joinPath(vscodeDir, 'tmstate.json');

    this._file = new PersistentJsonFile<TabStateFileContent>(
      filePath,
      createDefaultTabStateFileContent
    );

    await this._file.load();

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

  async getGroups(): Promise<Record<string, TabManagerState>> {
    if (this._groups) {
      return this._groups;
    }

    const stateFile = await this.getStateFile();
    const storedGroups = stateFile?.data?.groups || {};

    this._groups = storedGroups;

    return this._groups;
  }

  async getHistory(): Promise<Record<string, TabManagerState>> {
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
    const storedQuickSlots = stateFile?.data?.quickSlots ?? {};

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

    quickSlots[slot] = groupId;

    if (existingSlot != null) {
      quickSlots[existingSlot] = null;
    }

    await this.save();
  }

  async getQuickSlotAssignment(slot: QuickSlotIndex): Promise<string | null> {
    const quickSlots = await this.getQuickSlots();
    return quickSlots[slot] ?? null;
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
