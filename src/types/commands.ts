export interface LayoutGroup {
  size: number;
  groups?: LayoutGroup[];
}

export interface Layout {
  orientation: number;
  groups: LayoutGroup[];
}
