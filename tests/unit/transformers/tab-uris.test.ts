import { describe, expect, it, vi } from 'vitest';
import { Uri, workspace } from 'vscode';

import {
  toAbsoluteTabStateFile,
  toRelativeTabStateFile
} from '../../../src/transformers/tab-uris';
import {
  createEmptyStateContainer
} from '../../../src/types/tab-manager';
import { TabKind } from '../../../src/types/tabs';
import { tabFactory, tabStateFactory, stateContainerFactory, tabStateFileContentFactory } from '../../factories';

describe('tab-uris transformer', () => {
  describe('toRelativeTabStateFile', () => {
    it('converts absolute file URIs to relative paths', () => {
      vi.spyOn(workspace, 'asRelativePath').mockImplementation((uri: any) => {
        const uriString = typeof uri === 'string' ? uri : uri.toString();
        if (uriString === 'file:///workspace/src/file.ts') return 'src/file.ts';
        return uriString;
      });

      const tab = tabFactory.build({ uri: 'file:///workspace/src/file.ts' });
      const tabState = tabStateFactory.build({}, { transient: { tabs: [tab] } });
      const container = stateContainerFactory.build({ state: { ...createEmptyStateContainer().state, tabState } });

      const fileContent = tabStateFileContentFactory.build({
        groups: { group1: container },
        history: {},
        addons: {},
        selectedGroup: 'group1',
        previousSelectedGroup: null as unknown as string,
        quickSlots: {}
      });

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

      const tab = tabFactory.build({}, { transient: { kind: TabKind.TabInputTextDiff, originalUri: 'file:///workspace/old.ts', modifiedUri: 'file:///workspace/new.ts' } });
      const tabState = tabStateFactory.build({}, { transient: { tabs: [tab] } });
      const container = stateContainerFactory.build({}, { transient: { tabState } });

      const fileContent = tabStateFileContentFactory.build({
        groups: { group1: container },
        history: {},
        addons: {},
        selectedGroup: 'group1',
        previousSelectedGroup: null as unknown as string,
        quickSlots: {}
      });

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

      const tab = tabFactory.build({ uri: 'file:///workspace/history.ts' });
      const tabState = tabStateFactory.build({}, { transient: { tabs: [tab] } });
      const container = stateContainerFactory.build({}, { transient: { tabState } });

      const fileContent = tabStateFileContentFactory.build({
        groups: {},
        history: { hist1: container },
        addons: {},
        selectedGroup: null as unknown as string,
        previousSelectedGroup: null as unknown as string,
        quickSlots: {}
      });

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

      const tab = tabFactory.build({ uri: 'file:///workspace/addon.ts' });
      const tabState = tabStateFactory.build({}, { transient: { tabs: [tab] } });
      const container = stateContainerFactory.build({}, { transient: { tabState } });

      const fileContent = tabStateFileContentFactory.build({
        groups: {},
        history: {},
        addons: { addon1: container },
        selectedGroup: null as unknown as string,
        previousSelectedGroup: null as unknown as string,
        quickSlots: {}
      });

      const result = toRelativeTabStateFile(fileContent);

      const resultTab = result.addons.addon1.state.tabState.tabGroups['1'].tabs[0] as any;
      expect(resultTab.uri).toBe('addon.ts');
    });
  });

  describe('toAbsoluteTabStateFile', () => {
    it('converts relative paths to absolute file URIs', () => {
      const workspaceUri = Uri.parse('file:///workspace');

      const tab = tabFactory.build({ uri: 'src/file.ts' });
      const tabState = tabStateFactory.build({}, { transient: { tabs: [tab] } });
      const container = stateContainerFactory.build({}, { transient: { tabState } });

      const fileContent = tabStateFileContentFactory.build({
        groups: { group1: container },
        selectedGroup: 'group1',
        previousSelectedGroup: null as unknown as string
      });

      const result = toAbsoluteTabStateFile(fileContent, workspaceUri);

      const resultTab = result.groups.group1.state.tabState.tabGroups['1'].tabs[0] as any;
      expect(resultTab.uri).toBe('file:///workspace/src/file.ts');
    });

    it('converts diff tab relative paths to absolute URIs', () => {
      const workspaceUri = Uri.parse('file:///workspace');

      const tab = tabFactory.build({}, { transient: { kind: TabKind.TabInputTextDiff, originalUri: 'old.ts', modifiedUri: 'new.ts' } });
      const tabState = tabStateFactory.build({}, { transient: { tabs: [tab] } });
      const container = stateContainerFactory.build({}, { transient: { tabState } });

      const fileContent = tabStateFileContentFactory.build({
        groups: { group1: container },
        history: {},
        addons: {},
        selectedGroup: 'group1',
        previousSelectedGroup: null as unknown as string,
        quickSlots: {}
      });

      const result = toAbsoluteTabStateFile(fileContent, workspaceUri);

      const resultTab = result.groups.group1.state.tabState.tabGroups['1'].tabs[0] as any;
      expect(resultTab.originalUri).toBe('file:///workspace/old.ts');
      expect(resultTab.modifiedUri).toBe('file:///workspace/new.ts');
    });

    it('transforms multiple tab groups', () => {
      const workspaceUri = Uri.parse('file:///workspace');

      const tab1 = tabFactory.build({ uri: 'file1.ts' });
      const tab2 = tabFactory.build({ uri: 'file2.ts' });

      const tabState = tabStateFactory.build({
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
      });

      const container = stateContainerFactory.build({}, { transient: { tabState } });

      const fileContent = tabStateFileContentFactory.build({
        groups: { group1: container },
        history: {},
        addons: {},
        selectedGroup: 'group1',
        previousSelectedGroup: null as unknown as string,
        quickSlots: {}
      });

      const result = toAbsoluteTabStateFile(fileContent, workspaceUri);

      const resultTab1 = result.groups.group1.state.tabState.tabGroups['1'].tabs[0] as any;
      const resultTab2 = result.groups.group1.state.tabState.tabGroups['2'].tabs[0] as any;
      
      expect(resultTab1.uri).toBe('file:///workspace/file1.ts');
      expect(resultTab2.uri).toBe('file:///workspace/file2.ts');
    });

    it('preserves quick slots and selected group information', () => {
      const workspaceUri = Uri.parse('file:///workspace');

      const fileContent = tabStateFileContentFactory.build({
        groups: {},
        history: {},
        addons: {},
        selectedGroup: 'selected',
        previousSelectedGroup: 'previous',
        quickSlots: { '1': 'group1', '2': 'group2' }
      });

      const result = toAbsoluteTabStateFile(fileContent, workspaceUri);

      expect(result.selectedGroup).toBe('selected');
      expect(result.previousSelectedGroup).toBe('previous');
      expect(result.quickSlots).toEqual({ '1': 'group1', '2': 'group2' });
    });
  });
});
