import { QuickSlotAssignments } from './tab-manager';

export type SyncGroup = {
  groupId: string;
  name: string;
  tabCount: number;
  columnCount: number;
};

export type UpdatePayload = {
  selectedGroup: string | null;
  groups: SyncGroup[];
  quickSlots: QuickSlotAssignments;
};
