import { nanoid } from 'nanoid';

import { Layout } from '../../types/commands';
import { QuickSlotAssignments } from '../../types/tab-manager';
import { TabGroupInfo } from '../../types/tabs';
import { TabStateFileContentV1 } from './v1';

export interface TabStateV0 {
  tabGroups: Record<number, TabGroupInfo>;
  activeGroup: number | null;
}

export interface TabTabManagerStateV0 {
  tabState: TabStateV0;
  layout: Layout;
}

export interface TabStateFileContentV0 {
  groups: Record<string, TabTabManagerStateV0>;
  history: Record<string, TabTabManagerStateV0>;
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
          layout: oldState.layout
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
