import { describe, expect, it } from 'vitest';

import { calculateColumnDropIndex } from '../../../src/webview/lib/calculate-column-drop-index';

describe('calculateColumnDropIndex', () => {
  it('returns null when drag state is incomplete', () => {
    expect(calculateColumnDropIndex(null, 3, 'reorder', [1, 2, 3])).toBeNull();
    expect(calculateColumnDropIndex(1, null, 'reorder', [1, 2, 3])).toBeNull();
    expect(calculateColumnDropIndex(1, 3, null, [1, 2, 3])).toBeNull();
  });

  it('returns null for merge mode', () => {
    expect(calculateColumnDropIndex(1, 3, 'merge', [1, 2, 3])).toBeNull();
  });

  it('projects the slot after the hovered column when dragging right', () => {
    expect(calculateColumnDropIndex(1, 3, 'reorder', [1, 2, 3, 4])).toBe(3);
  });

  it('projects the slot before the hovered column when dragging left', () => {
    expect(calculateColumnDropIndex(4, 2, 'reorder', [1, 2, 3, 4])).toBe(1);
  });

  it('returns the trailing slot when dropping after the last column', () => {
    expect(calculateColumnDropIndex(2, 4, 'reorder', [1, 2, 3, 4])).toBe(4);
  });

  it('returns null when either column is missing from the current order', () => {
    expect(calculateColumnDropIndex(5, 2, 'reorder', [1, 2, 3, 4])).toBeNull();
    expect(calculateColumnDropIndex(2, 5, 'reorder', [1, 2, 3, 4])).toBeNull();
  });
});