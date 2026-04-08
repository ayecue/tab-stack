import { describe, expect, it } from 'vitest';

import { Layout } from '../../../src/types/commands';
import { resolveGroupMove, MoveStep, countLayoutLeaves } from '../../../src/utils/layout';

function applySteps(steps: MoveStep[], viewColumns: number[]): number[] {
  const result = [...viewColumns];
  for (const step of steps) {
    for (let i = 0; i < result.length; i++) {
      const vc = result[i];
      if (vc >= step.moverRange[0] && vc <= step.moverRange[1]) {
        result[i] = vc + step.moverShift;
      } else if (vc >= step.jumpedRange[0] && vc <= step.jumpedRange[1]) {
        result[i] = vc + step.jumpedShift;
      }
    }
  }
  return result;
}

describe('layout utilities', () => {
  describe('countLayoutLeaves', () => {
    it('counts flat layout', () => {
      expect(countLayoutLeaves({ orientation: 0, groups: [{ size: 1 }, { size: 1 }, { size: 1 }] })).toBe(3);
    });

    it('counts nested layout', () => {
      expect(countLayoutLeaves({
        orientation: 0,
        groups: [
          { size: 255 },
          { size: 297 },
          { size: 376, groups: [{ size: 500 }, { size: 287 }] }
        ]
      })).toBe(4);
    });

    it('counts deeply nested layout', () => {
      expect(countLayoutLeaves({
        orientation: 0,
        groups: [
          { size: 500 },
          { size: 500, groups: [
            { size: 500 },
            { size: 500, groups: [{ size: 500 }, { size: 500 }] }
          ]}
        ]
      })).toBe(4);
    });
  });

  describe('resolveGroupMove', () => {
    it('returns empty steps for same position', () => {
      expect(resolveGroupMove(2, 2)).toEqual([]);
    });

    it('moves column 1 → 2 (swap adjacent right)', () => {
      const steps = resolveGroupMove(1, 2);
      expect(steps).toHaveLength(1);
      expect(steps[0].command).toBe('workbench.action.moveActiveEditorGroupRight');
      expect(applySteps(steps, [1, 2, 3])).toEqual([2, 1, 3]);
    });

    it('moves column 2 → 1 (swap adjacent left)', () => {
      const steps = resolveGroupMove(2, 1);
      expect(steps).toHaveLength(1);
      expect(steps[0].command).toBe('workbench.action.moveActiveEditorGroupLeft');
      expect(applySteps(steps, [1, 2, 3])).toEqual([2, 1, 3]);
    });

    it('moves column 1 → 3 (two steps right)', () => {
      const steps = resolveGroupMove(1, 3);
      expect(steps).toHaveLength(2);
      steps.forEach(s => {
        expect(s.command).toBe('workbench.action.moveActiveEditorGroupRight');
      });
      expect(applySteps(steps, [1, 2, 3])).toEqual([3, 1, 2]);
    });

    it('moves column 3 → 1 (two steps left)', () => {
      const steps = resolveGroupMove(3, 1);
      expect(steps).toHaveLength(2);
      steps.forEach(s => {
        expect(s.command).toBe('workbench.action.moveActiveEditorGroupLeft');
      });
      expect(applySteps(steps, [1, 2, 3])).toEqual([2, 3, 1]);
    });

    it('moves column 4 → 1 (three steps left)', () => {
      const steps = resolveGroupMove(4, 1);
      expect(steps).toHaveLength(3);
      steps.forEach(s => {
        expect(s.command).toBe('workbench.action.moveActiveEditorGroupLeft');
      });
      expect(applySteps(steps, [1, 2, 3, 4])).toEqual([2, 3, 4, 1]);
    });

    it('moves column 1 → 4 (three steps right)', () => {
      const steps = resolveGroupMove(1, 4);
      expect(steps).toHaveLength(3);
      steps.forEach(s => {
        expect(s.command).toBe('workbench.action.moveActiveEditorGroupRight');
      });
      expect(applySteps(steps, [1, 2, 3, 4])).toEqual([4, 1, 2, 3]);
    });

    it('moves column 2 → 4 (two steps right)', () => {
      const steps = resolveGroupMove(2, 4);
      expect(steps).toHaveLength(2);
      steps.forEach(s => {
        expect(s.command).toBe('workbench.action.moveActiveEditorGroupRight');
      });
      expect(applySteps(steps, [1, 2, 3, 4])).toEqual([1, 4, 2, 3]);
    });

    it('moves column 4 → 2 (two steps left)', () => {
      const steps = resolveGroupMove(4, 2);
      expect(steps).toHaveLength(2);
      steps.forEach(s => {
        expect(s.command).toBe('workbench.action.moveActiveEditorGroupLeft');
      });
      expect(applySteps(steps, [1, 2, 3, 4])).toEqual([1, 3, 4, 2]);
    });
  });
});
