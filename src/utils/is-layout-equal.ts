import { Layout, LayoutGroup } from '../types/commands';

function areLayoutGroupsEqual(
  left?: LayoutGroup[],
  right?: LayoutGroup[],
  ignoreSize: boolean = false
): boolean {
  const queue: [[LayoutGroup[], LayoutGroup[]]] = [[left, right]];

  while (queue.length > 0) {
    const [leftGroups, rightGroups] = queue.pop()!;

    if (leftGroups == null && rightGroups == null) {
      continue;
    } else if (leftGroups == null || rightGroups == null) {
      return false;
    }

    if (leftGroups.length !== rightGroups.length) {
      return false;
    }

    for (let index = 0; index < leftGroups.length; index += 1) {
      const leftGroup = leftGroups[index];
      const rightGroup = rightGroups[index];

      if (leftGroup.size !== rightGroup.size && !ignoreSize) {
        return false;
      }

      queue.push([leftGroup.groups, rightGroup.groups]);
    }
  }

  return true;
}

export function isLayoutEqual(
  left?: Layout,
  right?: Layout,
  ignoreSize?: boolean
): boolean {
  if (left == null || right == null) {
    return left === right;
  }

  return (
    left.orientation === right.orientation &&
    areLayoutGroupsEqual(left.groups, right.groups, ignoreSize)
  );
}
