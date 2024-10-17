import { useEffect, useRef } from 'react';

import { Editor } from '@tiptap/react';

export interface MediaResizeProps {
  editor: Editor;
  [x: string]: any;
}

const MIN_WIDTH = 80;

export const useResizeMedia = (
  props: MediaResizeProps,
  refResizable: React.RefObject<HTMLImageElement | HTMLVideoElement>,
) => {
  const aspectRatio = useRef(0);

  const lastCursorX = useRef(-1);

  const isVerticalResizeActive = useRef(false);

  const proseMirrorContainerWidth = useRef(0);

  const limitWidthOrHeight = (width: number) => width < MIN_WIDTH;

  useEffect(() => {
    const proseMirrorContainerDiv = document.querySelector('.ProseMirror');

    if (proseMirrorContainerDiv)
      proseMirrorContainerWidth.current = proseMirrorContainerDiv?.clientWidth;

    if (!refResizable) return;
    aspectRatio.current = 1.5;

    // comment first call of onVerticalResize because re-render and actives undo/redo
    // onVerticalResize("left", 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onVerticalResize = (
    directionOfMouseMove: 'right' | 'left',
    diff: number,
  ) => {
    if (!refResizable) {
      console.error('Media ref is undefined|null', {
        refResizable: refResizable,
      });
      return;
    }

    const currentMediaDimensions = {
      width: refResizable.current?.width,
      height: refResizable.current?.height,
    };

    const newMediaDimensions = {
      width: -1,
      height: -1,
    };

    if (currentMediaDimensions.width) {
      if (directionOfMouseMove === 'left') {
        newMediaDimensions.width =
          currentMediaDimensions.width - Math.abs(diff);
      } else {
        newMediaDimensions.width =
          currentMediaDimensions.width + Math.abs(diff);
      }
    }

    if (newMediaDimensions.width > proseMirrorContainerWidth.current)
      newMediaDimensions.width = proseMirrorContainerWidth.current;

    if (diff !== 0 && limitWidthOrHeight(newMediaDimensions.width)) {
      newMediaDimensions.width = MIN_WIDTH;
    }

    newMediaDimensions.height = newMediaDimensions.width / aspectRatio.current;

    setTimeout(() => {
      props.updateAttributes(newMediaDimensions);
    });
  };

  const onVerticalMouseMove = (event: MouseEvent) => {
    if (!isVerticalResizeActive.current) return;

    const { clientX } = event;

    const diff = lastCursorX.current - clientX;

    lastCursorX.current = clientX;

    if (diff === 0) return;

    const directionOfMouseMove: 'left' | 'right' = diff > 0 ? 'left' : 'right';

    onVerticalResize(directionOfMouseMove, Math.abs(diff));
  };

  const startVerticalResize = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ): void => {
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
