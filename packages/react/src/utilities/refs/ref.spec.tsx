import { createRef, type MutableRefObject } from 'react';
import { mergeRefs, setRef } from './ref';

describe('setRef', () => {
  it('assigns the value to a MutableRefObject', () => {
    const ref = createRef<HTMLDivElement>();
    const el = document.createElement('div');

    setRef(el, ref);

    expect(ref.current).toBe(el);
  });

  it('calls a RefCallback with the value', () => {
    const callback = vi.fn();
    const el = document.createElement('div');

    setRef(el, callback);

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith(el);
  });

  it('sets multiple refs in a single call', () => {
    const ref1 = createRef<HTMLDivElement>();
    const ref2 = createRef<HTMLDivElement>();
    const callback = vi.fn();
    const el = document.createElement('div');

    setRef(el, ref1, ref2, callback);

    expect(ref1.current).toBe(el);
    expect(ref2.current).toBe(el);
    expect(callback).toHaveBeenCalledWith(el);
  });

  it('ignores null refs', () => {
    const ref = createRef<HTMLDivElement>();
    const el = document.createElement('div');

    expect(() => setRef(el, null, ref)).not.toThrow();
    expect(ref.current).toBe(el);
  });

  it('ignores undefined refs', () => {
    const ref = createRef<HTMLDivElement>();
    const el = document.createElement('div');

    expect(() => setRef(el, undefined, ref)).not.toThrow();
    expect(ref.current).toBe(el);
  });

  it('assigns null to a ref when val is null', () => {
    const ref: MutableRefObject<HTMLDivElement | null> = {
      current: document.createElement('div'),
    };

    setRef<HTMLDivElement | null>(null, ref);

    expect(ref.current).toBeNull();
  });
});

describe('mergeRefs', () => {
  it('returns a RefCallback function', () => {
    const ref = createRef<HTMLDivElement>();
    const merged = mergeRefs(ref);

    expect(typeof merged).toBe('function');
  });

  it('assigns the value to all provided MutableRefObjects when called', () => {
    const ref1 = createRef<HTMLDivElement>();
    const ref2 = createRef<HTMLDivElement>();
    const el = document.createElement('div');

    const merged = mergeRefs(ref1, ref2);
    merged(el);

    expect(ref1.current).toBe(el);
    expect(ref2.current).toBe(el);
  });

  it('calls all provided RefCallbacks when invoked', () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    const el = document.createElement('div');

    const merged = mergeRefs(cb1, cb2);
    merged(el);

    expect(cb1).toHaveBeenCalledWith(el);
    expect(cb2).toHaveBeenCalledWith(el);
  });

  it('handles a mix of MutableRefObjects, RefCallbacks, null and undefined', () => {
    const ref = createRef<HTMLDivElement>();
    const callback = vi.fn();
    const el = document.createElement('div');

    const merged = mergeRefs(ref, callback, null, undefined);

    expect(() => merged(el)).not.toThrow();
    expect(ref.current).toBe(el);
    expect(callback).toHaveBeenCalledWith(el);
  });

  it('propagates null when the node is unmounted', () => {
    const ref: MutableRefObject<HTMLDivElement | null> = { current: null };
    const callback = vi.fn();

    const merged = mergeRefs<HTMLDivElement | null>(ref, callback);
    merged(null);

    expect(ref.current).toBeNull();
    expect(callback).toHaveBeenCalledWith(null);
  });
});
