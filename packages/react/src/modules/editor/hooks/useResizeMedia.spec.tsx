import { Editor } from '@tiptap/react';
import { act, renderHook } from '~/setup';
import { MediaResizeProps, useResizeMedia } from './useResizeMedia';

type ResizableElt = HTMLImageElement | HTMLVideoElement | HTMLIFrameElement;

// Builds a fake resizable element whose getBoundingClientRect() and
// width/height properties can be controlled independently, so we can drive
// every branch of the aspect-ratio computation and the resize itself.
function createResizableElement({
  rectWidth = 0,
  rectHeight = 0,
  propWidth,
  propHeight,
}: {
  rectWidth?: number;
  rectHeight?: number;
  propWidth?: number;
  propHeight?: number;
} = {}) {
  return {
    getBoundingClientRect: vi.fn(
      () => ({ width: rectWidth, height: rectHeight }) as DOMRect,
    ),
    width: propWidth,
    height: propHeight,
  } as unknown as ResizableElt;
}

// Appends a `.ProseMirror` container with a controllable clientWidth so the
// mount effect can find it via document.querySelector('.ProseMirror').
function appendProseMirrorContainer(width: number) {
  const div = document.createElement('div');
  div.className = 'ProseMirror';
  Object.defineProperty(div, 'clientWidth', {
    value: width,
    configurable: true,
  });
  document.body.appendChild(div);
  return div;
}

function createProps(updateAttributes = vi.fn()): MediaResizeProps {
  return {
    editor: {} as Editor,
    updateAttributes,
  };
}

const startEvent = (clientX: number) =>
  ({ clientX }) as React.MouseEvent<HTMLDivElement, MouseEvent>;

describe('useResizeMedia', () => {
  afterEach(() => {
    document.querySelectorAll('.ProseMirror').forEach((node) => node.remove());
    vi.useRealTimers();
  });

  it('marks the resize as active, records the cursor position and registers listeners on start', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const el = createResizableElement({ rectWidth: 400, rectHeight: 200 });
    const refResizable = { current: el };
    const props = createProps();

    const { result } = renderHook(() => useResizeMedia(props, refResizable));

    act(() => {
      result.current.startVerticalResize(startEvent(100));
    });

    expect(result.current.isVerticalResizeActive.current).toBe(true);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'mouseup',
      expect.any(Function),
    );

    addEventListenerSpy.mockRestore();
  });

  it('computes the aspect ratio from getBoundingClientRect and does not clamp when the ProseMirror container is wider than the new width', () => {
    vi.useFakeTimers();
    appendProseMirrorContainer(1000);
    const el = createResizableElement({ rectWidth: 400, rectHeight: 200 });
    const refResizable = { current: el };
    const updateAttributes = vi.fn();
    const props = createProps(updateAttributes);

    const { result } = renderHook(() => useResizeMedia(props, refResizable));

    act(() => {
      result.current.startVerticalResize(startEvent(100));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 80 }));
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    // Ratio from the rect is 400/200 = 2. Moving left by 20px shrinks the
    // width to 380, which is well under the 1000px container, so no clamp.
    expect(updateAttributes).toHaveBeenCalledWith({ width: 380, height: 190 });
  });

  it('falls back to the width/height properties when getBoundingClientRect returns zero dimensions', () => {
    vi.useFakeTimers();
    const el = createResizableElement({
      rectWidth: 0,
      rectHeight: 0,
      propWidth: 200,
      propHeight: 100,
    });
    const refResizable = { current: el };
    const updateAttributes = vi.fn();
    const props = createProps(updateAttributes);

    const { result } = renderHook(() => useResizeMedia(props, refResizable));

    act(() => {
      result.current.startVerticalResize(startEvent(100));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 80 }));
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    // Ratio from the fallback properties is 200/100 = 2. Moving left by 20px
    // shrinks the width (also read via the fallback) from 200 to 180.
    expect(updateAttributes).toHaveBeenCalledWith({ width: 180, height: 90 });
  });

  it('defaults to a 16/9 aspect ratio when the width is readable but the height is not', () => {
    vi.useFakeTimers();
    const el = createResizableElement({
      rectWidth: 300,
      rectHeight: 0,
    });
    const refResizable = { current: el };
    const updateAttributes = vi.fn();
    const props = createProps(updateAttributes);

    const { result } = renderHook(() => useResizeMedia(props, refResizable));

    act(() => {
      result.current.startVerticalResize(startEvent(100));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 70 }));
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    // Width is readable (300) but height is not, so aspectRatio defaults to
    // 16/9. Moving left by 30px shrinks the width to 270.
    expect(updateAttributes).toHaveBeenCalledWith({
      width: 270,
      height: Math.round(270 / (16 / 9)),
    });
  });

  it('uses forcedAspectRatio directly, bypassing the measured element dimensions', () => {
    vi.useFakeTimers();
    // The rect implies a ratio of 4 (400/100); forcedAspectRatio must win.
    const el = createResizableElement({ rectWidth: 400, rectHeight: 100 });
    const refResizable = { current: el };
    const updateAttributes = vi.fn();
    const props = createProps(updateAttributes);

    const { result } = renderHook(() => useResizeMedia(props, refResizable, 2));

    act(() => {
      result.current.startVerticalResize(startEvent(100));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 60 }));
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    // Moving left by 40px shrinks the width to 360. If the rect-derived
    // ratio of 4 had been used, height would be 90 instead of 180.
    expect(updateAttributes).toHaveBeenCalledWith({ width: 360, height: 180 });
  });

  it('falls through to the measured dimensions when forcedAspectRatio is zero or negative', () => {
    vi.useFakeTimers();
    const el = createResizableElement({ rectWidth: 300, rectHeight: 100 });
    const refResizable = { current: el };
    const updateAttributes = vi.fn();
    const props = createProps(updateAttributes);

    const { result } = renderHook(() => useResizeMedia(props, refResizable, 0));

    act(() => {
      result.current.startVerticalResize(startEvent(100));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 70 }));
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    // forcedAspectRatio <= 0 is ignored, so the ratio comes from the rect:
    // 300/100 = 3. Moving left by 30px shrinks the width to 270.
    expect(updateAttributes).toHaveBeenCalledWith({ width: 270, height: 90 });
  });

  it('grows the element when the cursor moves right and applies no clamp without a ProseMirror container', () => {
    vi.useFakeTimers();
    const el = createResizableElement({ rectWidth: 400, rectHeight: 200 });
    const refResizable = { current: el };
    const updateAttributes = vi.fn();
    const props = createProps(updateAttributes);

    const { result } = renderHook(() => useResizeMedia(props, refResizable));

    act(() => {
      result.current.startVerticalResize(startEvent(100));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 130 }));
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    // Moving right by 30px grows the width to 430; there is no ProseMirror
    // container in the DOM, so nothing clamps it.
    expect(updateAttributes).toHaveBeenCalledWith({ width: 430, height: 215 });
  });

  it('clamps the new width to the ProseMirror container width when it is narrower', () => {
    vi.useFakeTimers();
    appendProseMirrorContainer(300);
    const el = createResizableElement({ rectWidth: 400, rectHeight: 200 });
    const refResizable = { current: el };
    const updateAttributes = vi.fn();
    const props = createProps(updateAttributes);

    const { result } = renderHook(() => useResizeMedia(props, refResizable));

    act(() => {
      result.current.startVerticalResize(startEvent(100));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 80 }));
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    // Moving left by 20px would produce a 380px width, but the 300px
    // ProseMirror container clamps it down.
    expect(updateAttributes).toHaveBeenCalledWith({ width: 300, height: 150 });
  });

  it('ignores a mousemove event when the cursor position has not changed', () => {
    vi.useFakeTimers();
    const el = createResizableElement({ rectWidth: 400, rectHeight: 200 });
    const refResizable = { current: el };
    const updateAttributes = vi.fn();
    const props = createProps(updateAttributes);

    const { result } = renderHook(() => useResizeMedia(props, refResizable));

    act(() => {
      result.current.startVerticalResize(startEvent(100));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 100 }));
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(updateAttributes).not.toHaveBeenCalled();
  });

  it('does not call updateAttributes when the current pixel width can no longer be measured', () => {
    vi.useFakeTimers();
    let rectWidth = 400;
    let rectHeight = 200;
    const el = {
      getBoundingClientRect: vi.fn(
        () => ({ width: rectWidth, height: rectHeight }) as DOMRect,
      ),
    } as unknown as ResizableElt;
    const refResizable = { current: el };
    const updateAttributes = vi.fn();
    const props = createProps(updateAttributes);

    const { result } = renderHook(() => useResizeMedia(props, refResizable));

    // Simulate the element becoming unmeasurable after mount (e.g. removed
    // from the layout), so onVerticalResize must bail out early.
    rectWidth = 0;
    rectHeight = 0;

    act(() => {
      result.current.startVerticalResize(startEvent(100));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 80 }));
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(updateAttributes).not.toHaveBeenCalled();
  });

  it('stopVerticalResize resets the active state and removes the document listeners', () => {
    vi.useFakeTimers();
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const el = createResizableElement({ rectWidth: 400, rectHeight: 200 });
    const refResizable = { current: el };
    const updateAttributes = vi.fn();
    const props = createProps(updateAttributes);

    const { result } = renderHook(() => useResizeMedia(props, refResizable));

    act(() => {
      result.current.startVerticalResize(startEvent(100));
    });
    act(() => {
      result.current.stopVerticalResize();
    });

    expect(result.current.isVerticalResizeActive.current).toBe(false);
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mouseup',
      expect.any(Function),
    );

    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50 }));
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(updateAttributes).not.toHaveBeenCalled();

    removeEventListenerSpy.mockRestore();
  });
});
