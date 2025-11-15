import { Layout } from '../../types/commands';
import {
  QuickSlotAssignments,
  TabStateFileContent
} from '../../types/tab-manager';
import { TabState } from '../../types/tabs';

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
    selectedGroup: content.selectedGroup,
    previousSelectedGroup: content.previousSelectedGroup,
    quickSlots: content.quickSlots
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
        migratedContent.history[historyName] = {
          ...historyState,
          state: {
            ...historyState.state,
            selectionMap: {}
          }
        };
      }
    }

    if (content.addons) {
      for (const [addonId, addonState] of Object.entries(content.addons)) {
        migratedContent.addons[addonId] = {
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
