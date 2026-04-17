import { Layout, LayoutGroup } from '../../src/types/commands';

export interface LayoutGroupFactoryOptions {
  size?: number;
  groups?: LayoutGroup[];
}

export interface LayoutFactoryOptions {
  orientation?: number;
  groups?: LayoutGroup[];
}

export function createLayoutGroup(
  options: LayoutGroupFactoryOptions = {}
): LayoutGroup {
  return {
    size: options.size ?? 1,
    groups: options.groups ?? [],
  };
}

export function createLayout(options: LayoutFactoryOptions | number = {}): Layout {
  if (typeof options === 'number') {
    return createLayout({ orientation: options });
  }

  return {
    orientation: options.orientation ?? 0,
    groups: options.groups ?? [createLayoutGroup()],
  };
}