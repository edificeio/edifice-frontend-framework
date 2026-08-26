/**
 * Runs `worker` over `items` with at most `limit` in flight at once. Unlike
 * chunking into fixed-size batches, a finished worker immediately picks up
 * the next item rather than waiting for the rest of its batch — so one slow
 * item never idles the other slots.
 *
 * Results are returned in the same order as `items`, regardless of
 * completion order, so callers can apply them deterministically.
 */
export async function runWithConcurrencyLimit<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function runNext(): Promise<void> {
    const index = nextIndex++;
    if (index >= items.length) return;
    results[index] = await worker(items[index], index);
    return runNext();
  }

  const workerCount = Math.max(1, Math.min(limit, items.length));
  await Promise.all(Array.from({ length: workerCount }, () => runNext()));

  return results;
}
