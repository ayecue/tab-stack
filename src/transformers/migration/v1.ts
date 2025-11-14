import { QuickSlotAssignments, TabStateFileContent } from '../../types/tab-manager';
import { TabState } from '../../types/tabs';
import { Layout } from '../../types/commands';

export interface TabManagerStateV1 {
  tabState: TabState;
  layout: Layout;
}

export interface StateContainerV1 {
  id: string;
  name: string;
  state: TabManagerStateV1;
  createdAt: number;
  lastSelectedAt: number;
}

export interface TabStateFileContentV1 {
  version?: number;
  groups: Record<string, StateContainerV1>;
  history: Record<string, StateContainerV1>;
  addons?: Record<string, StateContainerV1>;
  selectedGroup: string;
  previousSelectedGroup: string;
  quickSlots: QuickSlotAssignments;
}

export function transform(payload: any): TabStateFileContent {
  const content = payload as TabStateFileContentV1;
  const migratedContent: TabStateFileContent = {
    version: 2,
    groups: {},
    history: {},
    addons: {},
    selectedGroup: null,
    previousSelectedGroup: null,
    quickSlots: {}
  };

  if (content.groups) {
    for (const [groupId, groupState] of Object.entries(content.groups)) {
      migratedContent.groups[groupId] = {
        ...groupState,
        state: {
          ...groupState.state,
          selectionMap: {}
        }
      };
    }

    if (content.history) {
      for (const [historyName, historyState] of Object.entries(
        content.history
      )) {
        migratedContent.groups[historyName] = {
          ...historyState,
          state: {
            ...historyState.state,
            selectionMap: {}
          }
        };
      }
    }

    if (content.addons) {
      for (const [addonId, addonState] of Object.entries(
        content.addons
      )) {
        migratedContent.groups[addonId] = {
          ...addonState,
          state: {
            ...addonState.state,
            selectionMap: {}
          }
        };
      }
    }
  }

  return migratedContent;
}
