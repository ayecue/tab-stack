import { describe, expect, it } from 'vitest';

import { isLayoutEqual } from '../../../src/utils/is-layout-equal';
import { Layout, LayoutGroup } from '../../../src/types/commands';

describe('isLayoutEqual', () => {
  const createLayoutGroup = (size: number = 1, groups?: LayoutGroup[]): LayoutGroup => ({
    size,
    groups
  });

  const createLayout = (orientation: number = 0, groups?: LayoutGroup[]): Layout => ({
    orientation,
    groups: groups || [createLayoutGroup()]
  });

  describe('null and undefined handling', () => {
    it('returns true when both layouts are undefined', () => {
      expect(isLayoutEqual(undefined, undefined)).toBe(true);
    });

    it('returns false when one layout is undefined and the other is defined', () => {
      const layout = createLayout();
      expect(isLayoutEqual(undefined, layout)).toBe(false);
      expect(isLayoutEqual(layout, undefined)).toBe(false);
    });
  });

  describe('orientation comparison', () => {
    it('returns true for layouts with same orientation', () => {
      const layout1 = createLayout(0);
      const layout2 = createLayout(0);

      expect(isLayoutEqual(layout1, layout2)).toBe(true);
    });

    it('returns false for layouts with different orientation', () => {
      const layout1 = createLayout(0);
      const layout2 = createLayout(1);

      expect(isLayoutEqual(layout1, layout2)).toBe(false);
    });
  });

  describe('group size comparison', () => {
    it('returns true for groups with same size', () => {
      const layout1 = createLayout(0, [createLayoutGroup(1)]);
      const layout2 = createLayout(0, [createLayoutGroup(1)]);

      expect(isLayoutEqual(layout1, layout2)).toBe(true);
    });

    it('returns false for groups with different size', () => {
      const layout1 = createLayout(0, [createLayoutGroup(1)]);
      const layout2 = createLayout(0, [createLayoutGroup(2)]);

      expect(isLayoutEqual(layout1, layout2)).toBe(false);
    });

    it('ignores size differences when ignoreSize is true', () => {
      const layout1 = createLayout(0, [createLayoutGroup(1)]);
      const layout2 = createLayout(0, [createLayoutGroup(2)]);

      expect(isLayoutEqual(layout1, layout2, true)).toBe(true);
    });
  });

  describe('nested groups comparison', () => {
    it('returns true for deeply nested equal groups', () => {
      const layout1 = createLayout(0, [
        createLayoutGroup(1, [
          createLayoutGroup(2, [createLayoutGroup(3)])
        ])
      ]);

      const layout2 = createLayout(0, [
        createLayoutGroup(1, [
          createLayoutGroup(2, [createLayoutGroup(3)])
        ])
      ]);

      expect(isLayoutEqual(layout1, layout2)).toBe(true);
    });

    it('returns false for differently nested groups', () => {
      const layout1 = createLayout(0, [
        createLayoutGroup(1, [
          createLayoutGroup(2)
        ])
      ]);

      const layout2 = createLayout(0, [
        createLayoutGroup(1, [
          createLayoutGroup(3)
        ])
      ]);

      expect(isLayoutEqual(layout1, layout2)).toBe(false);
    });

    it('handles null nested groups', () => {
      const layout1 = createLayout(0, [createLayoutGroup(1)]);
      const layout2 = createLayout(0, [createLayoutGroup(1)]);

      expect(isLayoutEqual(layout1, layout2)).toBe(true);
    });
  });

  describe('group count comparison', () => {
    it('returns false when group counts differ', () => {
      const layout1 = createLayout(0, [
        createLayoutGroup(1),
        createLayoutGroup(2)
      ]);

      const layout2 = createLayout(0, [
        createLayoutGroup(1)
      ]);

      expect(isLayoutEqual(layout1, layout2)).toBe(false);
    });

    it('returns true for multiple groups with same structure', () => {
      const layout1 = createLayout(0, [
        createLayoutGroup(1),
        createLayoutGroup(2),
        createLayoutGroup(3)
      ]);

      const layout2 = createLayout(0, [
        createLayoutGroup(1),
        createLayoutGroup(2),
        createLayoutGroup(3)
      ]);

      expect(isLayoutEqual(layout1, layout2)).toBe(true);
    });
  });

  describe('complex layouts', () => {
    it('handles mixed nested and flat groups', () => {
      const layout1 = createLayout(0, [
        createLayoutGroup(1, [
          createLayoutGroup(2),
          createLayoutGroup(3)
        ]),
        createLayoutGroup(4)
      ]);

      const layout2 = createLayout(0, [
        createLayoutGroup(1, [
          createLayoutGroup(2),
          createLayoutGroup(3)
        ]),
        createLayoutGroup(4)
      ]);

      expect(isLayoutEqual(layout1, layout2)).toBe(true);
    });

    it('detects differences in complex nested structures', () => {
      const layout1 = createLayout(0, [
        createLayoutGroup(1, [
          createLayoutGroup(2),
          createLayoutGroup(3)
        ])
      ]);

      const layout2 = createLayout(0, [
        createLayoutGroup(1, [
          createLayoutGroup(2)
        ])
      ]);

      expect(isLayoutEqual(layout1, layout2)).toBe(false);
    });
  });
});
