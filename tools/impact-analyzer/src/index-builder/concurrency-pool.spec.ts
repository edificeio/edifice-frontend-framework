import { describe, expect, it } from 'vitest';
import { runWithConcurrencyLimit } from './concurrency-pool.js';

describe('runWithConcurrencyLimit', () => {
  it('runs every item and preserves the original order in the result', async () => {
    const results = await runWithConcurrencyLimit(
      [1, 2, 3, 4],
      2,
      async (n) => n * 10,
    );
    expect(results).toEqual([10, 20, 30, 40]);
  });

  it('never runs more than `limit` workers concurrently', async () => {
    let active = 0;
    let maxActive = 0;
    const items = Array.from({ length: 8 }, (_, i) => i);

    await runWithConcurrencyLimit(items, 3, async () => {
      active++;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      active--;
    });

    expect(maxActive).toBeLessThanOrEqual(3);
    // Proves the items actually overlapped in time, not accidentally serial.
    expect(maxActive).toBeGreaterThan(1);
  });

  it('propagates a worker rejection without hanging the pool', async () => {
    await expect(
      runWithConcurrencyLimit([1, 2, 3], 2, async (n) => {
        if (n === 2) throw new Error('boom');
        return n;
      }),
    ).rejects.toThrow('boom');
  });

  it('handles an empty item list', async () => {
    const results = await runWithConcurrencyLimit([] as number[], 4, () => {
      throw new Error('should never be called');
    });
    expect(results).toEqual([]);
  });

  it('handles a limit greater than the number of items', async () => {
    const results = await runWithConcurrencyLimit([1, 2], 10, async (n) => n);
    expect(results).toEqual([1, 2]);
  });
});
