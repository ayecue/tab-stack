import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { delay } from '../../../src/utils/delay';

describe('delay utility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns a promise', () => {
    const result = delay(100);
    expect(result).toBeInstanceOf(Promise);
  });

  it('resolves after specified milliseconds', async () => {
    const promise = delay(500);
    
    let resolved = false;
    promise.then(() => {
      resolved = true;
    });

    // Should not be resolved yet
    await vi.advanceTimersByTimeAsync(400);
    expect(resolved).toBe(false);

    // Should be resolved now
    await vi.advanceTimersByTimeAsync(100);
    expect(resolved).toBe(true);
  });

  it('resolves immediately for 0 milliseconds', async () => {
    const promise = delay(0);
    
    let resolved = false;
    promise.then(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(0);
    expect(resolved).toBe(true);
  });

  it('works with real timers for integration testing', async () => {
    vi.useRealTimers();
    
    const start = Date.now();
    await delay(50);
    const elapsed = Date.now() - start;

    // Should be at least 50ms, with some tolerance for system variance
    expect(elapsed).toBeGreaterThanOrEqual(45);
    expect(elapsed).toBeLessThan(150);
  });

  it('can be used multiple times concurrently', async () => {
    const delays = [
      delay(100),
      delay(200),
      delay(50)
    ];

    const results: number[] = [];
    delays[0].then(() => results.push(100));
    delays[1].then(() => results.push(200));
    delays[2].then(() => results.push(50));

    await vi.advanceTimersByTimeAsync(50);
    expect(results).toEqual([50]);

    await vi.advanceTimersByTimeAsync(50);
    expect(results).toEqual([50, 100]);

    await vi.advanceTimersByTimeAsync(100);
    expect(results).toEqual([50, 100, 200]);
  });
});
