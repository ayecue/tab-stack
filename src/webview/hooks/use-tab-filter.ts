import { useMemo } from 'react';

import { TabInfo, TabKind } from '../../types/tabs';

interface TabWithIndex {
  tab: TabInfo;
  originalIndex: number;
}

interface Column {
  viewColumn: number;
  label: string | null;
  tabs: TabWithIndex[];
  isActive: boolean;
  totalTabCount: number;
  nonFilteredIndices: number[];
}

interface FlatItem {
  label: string;
  isActive: boolean;
  tabGroupIndex: number;
  viewColumn: number;
  tab: TabInfo;
}

type FilterType =
  | 'all'
  | 'text'
  | 'diff'
  | 'notebook'
  | 'webview'
  | 'custom'
  | 'terminal';

interface Filters {
  pinnedOnly: boolean;
  dirtyOnly: boolean;
  type: FilterType;
}

interface TabGroups {
  [key: string]: {
    viewColumn: number;
    tabs: TabInfo[];
    activeTab: TabInfo | null;
  };
}

interface UseTabFilterOptions {
  tabGroups: TabGroups;
  searchTerm: string;
  activeGroup?: number;
  filters?: Filters;
}

export interface UseTabFilterResult {
  columns: Column[];
  flatList: FlatItem[];
  totalVisibleTabs: number;
}

function getColumnLabel(viewColumn: number): string {
  return `Column ${viewColumn}`;
}

function matchesSearch(tab: TabInfo, term: string): boolean {
  if (!term.trim()) return true;
  const lowerTerm = term.toLowerCase();

  if (tab.label.toLowerCase().includes(lowerTerm)) {
    return true;
  }

  if ('uri' in tab && tab.uri && tab.uri.toLowerCase().includes(lowerTerm)) {
    return true;
  }

  if ('originalUri' in tab) {
    if (tab.originalUri && tab.originalUri.toLowerCase().includes(lowerTerm)) {
      return true;
    }
    if (
      'modifiedUri' in tab &&
      tab.modifiedUri &&
      tab.modifiedUri.toLowerCase().includes(lowerTerm)
    ) {
      return true;
    }
  }

  return false;
}

function matchesType(tab: TabInfo, type: FilterType): boolean {
  if (type === 'all') return true;
  switch (type) {
    case 'text':
      return tab.kind === TabKind.TabInputText;
    case 'diff':
      return (
        tab.kind === TabKind.TabInputTextDiff ||
        tab.kind === TabKind.TabInputNotebookDiff
      );
    case 'notebook':
      return tab.kind === TabKind.TabInputNotebook;
    case 'webview':
      return tab.kind === TabKind.TabInputWebview;
    case 'custom':
      return tab.kind === TabKind.TabInputCustom;
    case 'terminal':
      return tab.kind === TabKind.TabInputTerminal;
    default:
      return true;
  }
}

function passesFilters(tab: TabInfo, filters?: Filters): boolean {
  if (filters?.pinnedOnly && !tab.isPinned) return false;
  if (filters?.dirtyOnly && !(tab as any).isDirty) return false;
  if (!matchesType(tab, filters?.type ?? 'all')) return false;
  return true;
}

export function useTabFilter({
  tabGroups,
  searchTerm,
  activeGroup,
  filters
}: UseTabFilterOptions): UseTabFilterResult {
  const columns = useMemo(() => {
    return Object.values(tabGroups).map((group) => {
      const displayName = group.activeTab ? group.activeTab.label : null;

      const tabsWithIndices: TabWithIndex[] = group.tabs.map((tab, index) => ({
        tab,
        originalIndex: index
      }));

      const isFiltering =
        searchTerm.trim() !== '' ||
        (filters &&
          (filters.pinnedOnly || filters.dirtyOnly || filters.type !== 'all'));

      const filteredTabs = (
        searchTerm.trim()
          ? tabsWithIndices.filter(({ tab }) => matchesSearch(tab, searchTerm))
          : tabsWithIndices
      ).filter(({ tab }) => passesFilters(tab, filters));

      const filteredIndexSet = isFiltering
        ? new Set(filteredTabs.map(({ originalIndex }) => originalIndex))
        : new Set<number>();

      const nonFilteredIndices = isFiltering
        ? tabsWithIndices
            .filter(({ originalIndex }) => !filteredIndexSet.has(originalIndex))
            .map(({ originalIndex }) => originalIndex)
        : [];

      return {
        viewColumn: group.viewColumn,
        label: displayName,
        tabs: filteredTabs,
        isActive: activeGroup === group.viewColumn,
        totalTabCount: group.tabs.length,
        nonFilteredIndices
      };
    });
  }, [tabGroups, searchTerm, activeGroup, filters]);

  const flatList = useMemo(() => {
    return columns.flatMap((group) =>
      group.tabs.map(({ tab, originalIndex }) => ({
        label: getColumnLabel(group.viewColumn),
        isActive: group.isActive,
        tabGroupIndex: originalIndex,
        viewColumn: group.viewColumn,
        tab
      }))
    );
  }, [columns]);

  const totalVisibleTabs = flatList.length;

  return { columns, flatList, totalVisibleTabs };
}
