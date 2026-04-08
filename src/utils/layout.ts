import { commands } from 'vscode';
import { Layout, LayoutGroup, MoveStep } from '../types/commands';

export async function getEditorLayout(): Promise<Layout> {
  return await commands.executeCommand('vscode.getEditorLayout');
}

export async function setEditorLayout(layout: Layout): Promise<void> {
  await commands.executeCommand('vscode.setEditorLayout', layout);
}

export function countLayoutLeaves(layout: Layout): number {
  function count(groups: LayoutGroup[]): number {
    let total = 0;
    for (const g of groups) {
      total += g.groups?.length ? count(g.groups) : 1;
    }
    return total;
  }
  return count(layout.groups);
}

const MOVE_COMMANDS = {
  right: 'workbench.action.moveActiveEditorGroupRight',
  left: 'workbench.action.moveActiveEditorGroupLeft'
} as const;

export function resolveGroupMove(from: number, to: number): MoveStep[] {
  if (from === to) return [];

  const movingRight = to > from;
  const command = movingRight
    ? MOVE_COMMANDS.right
    : MOVE_COMMANDS.left;

  const steps: MoveStep[] = [];
  const direction = movingRight ? 1 : -1;
  let current = from;

  while (current !== to) {
    const next = current + direction;
    steps.push({
      command,
      moverRange: [current, current],
      moverShift: direction,
      jumpedRange: [next, next],
      jumpedShift: -direction
    });
    current = next;
  }

  return steps;
}
