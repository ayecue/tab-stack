import { describe, expect, it } from 'vitest';

import { calculateDropIndex } from '../../../src/webview/lib/calculate-drop-index';

describe('calculateDropIndex', () => {
  it('returns the raw index when moving across columns', () => {
    expect(calculateDropIndex(0, 1, 2, 2)).toBe(2);
  });

  it('adjusts index when moving down within the same column', () => {
    // Moving item 1 to raw position 3 in same column → final 2
    expect(calculateDropIndex(1, 1, 3, 1)).toBe(2);
  });

  it('does not adjust index when moving up within the same column', () => {
    // Moving item 3 to raw position 1 in same column → final 1
    expect(calculateDropIndex(3, 1, 1, 1)).toBe(1);
  });

  it('returns null when dropping in the same position (same column)', () => {
    expect(calculateDropIndex(2, 1, 2, 1)).toBeNull();
  });

  it('returns null when adjusted index equals source in same column', () => {
    // From index 2, raw target 3 in same column → adjusted 2 = source → no-op
    expect(calculateDropIndex(2, 1, 3, 1)).toBeNull();
  });

  it('allows moving to position 0 in same column', () => {
    expect(calculateDropIndex(3, 1, 0, 1)).toBe(0);
  });

  it('allows moving to position 0 in a different column', () => {
    expect(calculateDropIndex(0, 1, 0, 2)).toBe(0);
  });

  it('allows moving the same index across different columns', () => {
    // Same index, different column → not a no-op
    expect(calculateDropIndex(2, 1, 2, 2)).toBe(2);
  });
});
