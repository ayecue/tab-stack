import { describe, expect, it, vi } from 'vitest';
import { Uri, workspace } from 'vscode';

import {
  toAbsoluteTabStateFile,
  toRelativeTabStateFile
} from '../../../src/transformers/tab-uris';
import {
  StateContainer,
  TabStateFileContent,
  createEmptyStateContainer
} from '../../../src/types/tab-manager';
import { TabKind, TabInfo, TabState } from '../../../src/types/tabs';

describe('tab-uris transformer', () => {
  const createTextTab = (uri: string): TabInfo => ({
    label: 'test.ts',
    isActive: false,
    isDirty: false,
    isPinned: false,
    viewColumn: 1,
    kind: TabKind.TabInputText,
    uri
  });

  const createDiffTab = (originalUri: string, modifiedUri: string): TabInfo => ({
    label: 'diff',
    isActive: false,
    isDirty: false,
    isPinned: false,
    viewColumn: 1,
    kind: TabKind.TabInputTextDiff,
    originalUri,
    modifiedUri
  });

  const createTabState = (tabs: TabInfo[]): TabState => ({
    activeGroup: 1,
    tabGroups: {
      '1': {
        viewColumn: 1,
        tabs,
        activeTab: tabs[0]
      }
    }
  });

  const createStateContainer = (tabState: TabState): StateContainer => ({
    ...createEmptyStateContainer(),
    state: {
      ...createEmptyStateContainer().state,
      tabState
    }
  });

  describe('toRelativeTabStateFile', () => {
    it('converts absolute file URIs to relative paths', () => {
      vi.spyOn(workspace, 'asRelativePath').mockImplementation((uri: any) => {
        const uriString = typeof uri === 'string' ? uri : uri.toString();
        if (uriString === 'file:///workspace/src/file.ts') return 'src/file.ts';
        return uriString;
      });

      const tab = createTextTab('file:///workspace/src/file.ts');
      const tabState = createTabState([tab]);
      const container = createStateContainer(tabState);

      const fileContent: TabStateFileContent = {
        version: 2,
        groups: { group1: container },
        history: {},
        addons: {},
        selectedGroup: 'group1',
        previousSelectedGroup: null as unknown as string,
        quickSlots: {}
      };

      const result = toRelativeTabStateFile(fileContent);

      const resultTab = result.groups.group1.state.tabState.tabGroups['1'].tabs[0] as any;
      expect(resultTab.uri).toBe('src/file.ts');
    });

    it('converts diff tab URIs to relative paths', () => {
      vi.spyOn(workspace, 'asRelativePath').mockImplementation((uri: any) => {
        const uriString = typeof uri === 'string' ? uri : uri.toString();
        if (uriString === 'file:///workspace/old.ts') return 'old.ts';
        if (uriString === 'file:///workspace/new.ts') return 'new.ts';
        return uriString;
      });

      const tab = createDiffTab('file:///workspace/old.ts', 'file:///workspace/new.ts');
      const tabState = createTabState([tab]);
      const container = createStateContainer(tabState);

      const fileContent: TabStateFileContent = {
        version: 2,
        groups: { group1: container },
        history: {},
        addons: {},
        selectedGroup: 'group1',
        previousSelectedGroup: null as unknown as string,
        quickSlots: {}
      };

      const result = toRelativeTabStateFile(fileContent);

      const resultTab = result.groups.group1.state.tabState.tabGroups['1'].tabs[0] as any;
      expect(resultTab.originalUri).toBe('old.ts');
      expect(resultTab.modifiedUri).toBe('new.ts');
    });

    it('transforms history entries', () => {
      vi.spyOn(workspace, 'asRelativePath').mockImplementation((uri: any) => {
        const uriString = typeof uri === 'string' ? uri : uri.toString();
        if (uriString === 'file:///workspace/history.ts') return 'history.ts';
        return uriString;
      });

      const tab = createTextTab('file:///workspace/history.ts');
      const tabState = createTabState([tab]);
      const container = createStateContainer(tabState);

      const fileContent: TabStateFileContent = {
        version: 2,
        groups: {},
        history: { hist1: container },
        addons: {},
        selectedGroup: null as unknown as string,
        previousSelectedGroup: null as unknown as string,
        quickSlots: {}
      };

      const result = toRelativeTabStateFile(fileContent);

      const resultTab = result.history.hist1.state.tabState.tabGroups['1'].tabs[0] as any;
      expect(resultTab.uri).toBe('history.ts');
    });

    it('transforms addon entries', () => {
      vi.spyOn(workspace, 'asRelativePath').mockImplementation((uri: any) => {
        const uriString = typeof uri === 'string' ? uri : uri.toString();
        if (uriString === 'file:///workspace/addon.ts') return 'addon.ts';
        return uriString;
      });

      const tab = createTextTab('file:///workspace/addon.ts');
      const tabState = createTabState([tab]);
      const container = createStateContainer(tabState);

      const fileContent: TabStateFileContent = {
        version: 2,
        groups: {},
        history: {},
        addons: { addon1: container },
        selectedGroup: null as unknown as string,
        previousSelectedGroup: null as unknown as string,
        quickSlots: {}
      };

      const result = toRelativeTabStateFile(fileContent);

      const resultTab = result.addons.addon1.state.tabState.tabGroups['1'].tabs[0] as any;
      expect(resultTab.uri).toBe('addon.ts');
    });
  });

  describe('toAbsoluteTabStateFile', () => {
    it('converts relative paths to absolute file URIs', () => {
      const workspaceUri = Uri.parse('file:///workspace');

      const tab = createTextTab('src/file.ts');
      const tabState = createTabState([tab]);
      const container = createStateContainer(tabState);

      const fileContent: TabStateFileContent = {
        version: 2,
        groups: { group1: container },
        history: {},
        addons: {},
        selectedGroup: 'group1',
        previousSelectedGroup: null as unknown as string,
        quickSlots: {}
      };

      const result = toAbsoluteTabStateFile(fileContent, workspaceUri);

      const resultTab = result.groups.group1.state.tabState.tabGroups['1'].tabs[0] as any;
      expect(resultTab.uri).toBe('file:///workspace/src/file.ts');
    });

    it('converts diff tab relative paths to absolute URIs', () => {
      const workspaceUri = Uri.parse('file:///workspace');

      const tab = createDiffTab('old.ts', 'new.ts');
      const tabState = createTabState([tab]);
      const container = createStateContainer(tabState);

      const fileContent: TabStateFileContent = {
        version: 2,
        groups: { group1: container },
        history: {},
        addons: {},
        selectedGroup: 'group1',
        previousSelectedGroup: null as unknown as string,
        quickSlots: {}
      };

      const result = toAbsoluteTabStateFile(fileContent, workspaceUri);

      const resultTab = result.groups.group1.state.tabState.tabGroups['1'].tabs[0] as any;
      expect(resultTab.originalUri).toBe('file:///workspace/old.ts');
      expect(resultTab.modifiedUri).toBe('file:///workspace/new.ts');
    });

    it('transforms multiple tab groups', () => {
      const workspaceUri = Uri.parse('file:///workspace');

      const tab1 = createTextTab('file1.ts');
      const tab2 = createTextTab('file2.ts');

      const tabState: TabState = {
        activeGroup: 1,
        tabGroups: {
          '1': {
            viewColumn: 1,
            tabs: [tab1],
            activeTab: tab1
          },
          '2': {
            viewColumn: 2,
            tabs: [tab2],
            activeTab: tab2
          }
        }
      };

      const container = createStateContainer(tabState);

      const fileContent: TabStateFileContent = {
        version: 2,
        groups: { group1: container },
        history: {},
        addons: {},
        selectedGroup: 'group1',
        previousSelectedGroup: null as unknown as string,
        quickSlots: {}
      };

      const result = toAbsoluteTabStateFile(fileContent, workspaceUri);

      const resultTab1 = result.groups.group1.state.tabState.tabGroups['1'].tabs[0] as any;
      const resultTab2 = result.groups.group1.state.tabState.tabGroups['2'].tabs[0] as any;
      
      expect(resultTab1.uri).toBe('file:///workspace/file1.ts');
      expect(resultTab2.uri).toBe('file:///workspace/file2.ts');
    });

    it('preserves quick slots and selected group information', () => {
      const workspaceUri = Uri.parse('file:///workspace');

      const fileContent: TabStateFileContent = {
        version: 2,
        groups: {},
        history: {},
        addons: {},
        selectedGroup: 'selected',
        previousSelectedGroup: 'previous',
        quickSlots: { '1': 'group1', '2': 'group2' }
      };

      const result = toAbsoluteTabStateFile(fileContent, workspaceUri);

      expect(result.selectedGroup).toBe('selected');
      expect(result.previousSelectedGroup).toBe('previous');
      expect(result.quickSlots).toEqual({ '1': 'group1', '2': 'group2' });
    });
  });
});
