import { QuickPickItem } from "vscode";

export interface LayoutGroup {
  size: number;
  groups?: LayoutGroup[];
}

export interface Layout {
  orientation: number;
  groups: LayoutGroup[];
}

export interface GroupQuickPickItem extends QuickPickItem {
  groupId: string;
}

export interface SavedTabQuickPickItem extends QuickPickItem {
  groupId: string;
  viewColumn: number | null;
  index: number | null;
}