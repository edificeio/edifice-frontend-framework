import { useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';

export interface MediaResizeProps {
  editor: Editor;
  updateAttributes: (attrs: Record<string, any>) => void;
  [x: string]: any;
}

type ResizableElt = HTMLImageElement | HTMLVideoElement | HTMLIFrameElement;

export const useResizeMedia = (
  props: MediaResizeProps,
  refResizable: React.RefObject<ResizableElt>,
  forcedAspectRatio?: number,
) => {
  const aspectRatio = useRef(0);
  const lastCursorX = useRef(-1);
  const isVerticalResizeActive = useRef(false);
  const proseMirrorContainerWidth = useRef(0);

  const readCurrentPixelWidth = () => {
    const el = refResizable.current;
    if (!el) return 0;

    const rect = el.getBoundingClientRect();
    return Math.round(rect.width || (el as any).width || 0);
  };

  const readCurrentPixelHeight = () => {
    const el = refResizable.current;
    if (!el) return 0;

    const rect = el.getBoundingClientRect();
    return Math.round(rect.height || (el as any).height || 0);
  };

  useEffect(() => {
    const proseMirrorContainerDiv = document.querySelector('.ProseMirror');
    if (proseMirrorContainerDiv)
      proseMirrorContainerWidth.current = proseMirrorContainerDiv.clientWidth;

    if (forcedAspectRatio && forcedAspectRatio > 0) {
      aspectRatio.current = forcedAspectRatio;
    } else {
      const w = readCurrentPixelWidth();
      const h = readCurrentPixelHeight();
      if (w > 0 && h > 0) {
        aspectRatio.current = w / h;
      } else {
        aspectRatio.current = 16 / 9;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clampWidth = (w: number) => {
    let width = w;
    if (
      proseMirrorContainerWidth.current > 0 &&
      width > proseMirrorContainerWidth.current
    ) {
      width = proseMirrorContainerWidth.current;
    }
    return Math.round(width);
  };

  const onVerticalResize = (direction: 'right' | 'left', diff: number) => {
    const currWidth = readCurrentPixelWidth();
    if (!currWidth) return;

    let newWidth =
      direction === 'left'
        ? currWidth - Math.abs(diff)
        : currWidth + Math.abs(diff);
    newWidth = clampWidth(newWidth);

    const ratio = aspectRatio.current || 16 / 9;
    const newHeight = Math.round(newWidth / ratio);

    setTimeout(() => {
      props.updateAttributes({ width: newWidth, height: newHeight });
    });
  };

  const onVerticalMouseMove = (event: MouseEvent) => {
    if (!isVerticalResizeActive.current) return;
    const { clientX } = event;
    const diff = lastCursorX.current - clientX;
    lastCursorX.current = clientX;
    if (diff === 0) return;
    const direction: 'left' | 'right' = diff > 0 ? 'left' : 'right';
    onVerticalResize(direction, Math.abs(diff));
  };

  const startVerticalResize = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    isVerticalResizeActive.current = true;
    lastCursorX.current = event.clientX;

    document.addEventListener('mousemove', onVerticalMouseMove);
    document.addEventListener('mouseup', stopVerticalResize);
  };

  const stopVerticalResize = () => {
    isVerticalResizeActive.current = false;
    lastCursorX.current = -1;

    document.removeEventListener('mousemove', onVerticalMouseMove);
    document.removeEventListener('mouseup', stopVerticalResize);
  };

  return {
    startVerticalResize,
    stopVerticalResize,
    isVerticalResizeActive,
  };
};
