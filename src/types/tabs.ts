export interface TabInfo {
  readonly label: string;
  readonly uri: string;
  readonly isActive: boolean;
  readonly isPinned: boolean;
  readonly viewColumn: number | undefined;
}

export interface TabGroupInfo {
  readonly tabs: TabInfo[];
  readonly viewColumn: number;

  activeTab: TabInfo | undefined;
}

export interface TabState {
  tabGroups: Record<number, TabGroupInfo>;
  activeGroup: number | null;
}
