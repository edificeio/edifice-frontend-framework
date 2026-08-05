import { debounceAggregate } from './debounceAggregate';

describe('debounceAggregate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('holds the callback until the delay has elapsed', () => {
    const callback = vi.fn();
    const push = debounceAggregate(100, (n: number) => n, callback);

    push(1);
    vi.advanceTimersByTime(99);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledWith([1]);
  });

  it('aggregates every event of the window into a single call', () => {
    const callback = vi.fn();
    const push = debounceAggregate(100, (n: number) => n, callback);

    push(1);
    push(2);
    push(3);
    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith([1, 2, 3]);
  });

  it('maps each event before aggregating it', () => {
    const callback = vi.fn();
    const push = debounceAggregate(
      100,
      (input: { x: number }) => input.x * 2,
      callback,
    );

    push({ x: 1 });
    push({ x: 2 });
    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledWith([2, 4]);
  });

  it('restarts the delay on every event — this is a debounce, not a throttle', () => {
    const callback = vi.fn();
    const push = debounceAggregate(100, (n: number) => n, callback);

    push(1);
    vi.advanceTimersByTime(80);
    push(2);
    vi.advanceTimersByTime(80);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(20);
    expect(callback).toHaveBeenCalledWith([1, 2]);
  });

  it('empties the buffer between two windows', () => {
    const callback = vi.fn();
    const push = debounceAggregate(100, (n: number) => n, callback);

    push(1);
    vi.advanceTimersByTime(100);
    push(2);
    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenNthCalledWith(1, [1]);
    expect(callback).toHaveBeenNthCalledWith(2, [2]);
  });

  it('hands over a copy, so a later window cannot mutate an earlier batch', () => {
    const batches: number[][] = [];
    const push = debounceAggregate(
      100,
      (n: number) => n,
      (aggregated) => batches.push(aggregated),
    );

    push(1);
    vi.advanceTimersByTime(100);
    push(2);
    vi.advanceTimersByTime(100);

    expect(batches[0]).toEqual([1]);
    expect(batches[1]).toEqual([2]);
  });

  it('keeps each returned function on its own buffer', () => {
    const first = vi.fn();
    const second = vi.fn();
    const pushFirst = debounceAggregate(100, (n: number) => n, first);
    const pushSecond = debounceAggregate(100, (n: number) => n, second);

    pushFirst(1);
    pushSecond(2);
    vi.advanceTimersByTime(100);

    expect(first).toHaveBeenCalledWith([1]);
    expect(second).toHaveBeenCalledWith([2]);
  });
});
