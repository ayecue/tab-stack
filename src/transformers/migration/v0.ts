import { nanoid } from 'nanoid';

import {
  QuickSlotAssignments,
  StateContainer,
  TabManagerState
} from '../../types/tab-manager';

export interface TabStateFileContentV0 {
  groups: Record<string, TabManagerState>;
  history: Record<string, TabManagerState>;
  selectedGroup: string;
  previousSelectedGroup: string;
  quickSlots: QuickSlotAssignments;
}

export interface TabStateFileContentV1 {
  version?: number;
  groups: Record<string, StateContainer>;
  history: Record<string, StateContainer>;
  selectedGroup: string;
  previousSelectedGroup: string;
  quickSlots: QuickSlotAssignments;
}

export function transform(payload: any): TabStateFileContentV1 {
  const content = payload as TabStateFileContentV0;
  const migratedContent: TabStateFileContentV1 = {
    version: 1,
    groups: {},
    history: {},
    selectedGroup: null,
    previousSelectedGroup: null,
    quickSlots: {}
  };

  if (content.groups) {
    for (const [groupName, oldState] of Object.entries(content.groups)) {
      const newId = nanoid();

      migratedContent.groups[newId] = {
        id: newId,
        name: groupName,
        state: {
          tabState: oldState.tabState,
          layout: oldState.layout,
          selectionMap: {}
        },
        lastSelectedAt: 0,
        createdAt: new Date().getTime()
      };

      if (content.selectedGroup === groupName) {
        migratedContent.selectedGroup = newId;
      }

      if (content.previousSelectedGroup === groupName) {
        migratedContent.previousSelectedGroup = newId;
      }

      const quickSlotIndex = Object.keys(content.quickSlots).find(
        (index) => content.quickSlots[index] === groupName
      );

      if (quickSlotIndex != null) {
        migratedContent.quickSlots[quickSlotIndex] = newId;
      }
    }

    if (content.history) {
      for (const [historyName, historyState] of Object.entries(
        content.history
      )) {
        const newId = nanoid();

        migratedContent.history[newId] = {
          id: newId,
          name: historyName,
          state: historyState,
          createdAt: new Date().getTime(),
          lastSelectedAt: 0
        };
      }
    }
  }

  return migratedContent;
}
