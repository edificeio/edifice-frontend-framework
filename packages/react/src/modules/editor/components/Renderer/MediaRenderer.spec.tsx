import { Editor } from '@tiptap/react';

import { fireEvent, render } from '~/setup';
import { useBrowserInfo } from '../../../../hooks';
import { MediaResizeProps } from '../../hooks';
import MediaRenderer from './MediaRenderer';

const { trackVideoRead } = vi.hoisted(() => ({
  trackVideoRead: vi.fn(),
}));

vi.mock('@edifice.io/client', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    odeServices: {
      data: () => ({ trackVideoRead }),
    },
  };
});

function makeNode(name: string, attrs: Record<string, any> = {}) {
  return { type: { name }, attrs } as any;
}

function renderMedia(node: any, updateAttributes = vi.fn()) {
  const props = {
    node,
    editor: {} as Editor,
    updateAttributes,
  } as MediaResizeProps;

  return render(<MediaRenderer {...props} />);
}

describe('MediaRenderer', () => {
  describe('custom-image node type', () => {
    it('renders an Image with the node attrs and a legend when a title is set', () => {
      const node = makeNode('custom-image', {
        src: '/image.png',
        alt: 'my image',
        title: 'My legend',
        width: 100,
        height: 50,
      });

      const { container } = renderMedia(node);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('src', '/image.png');
      expect(img).toHaveAttribute('alt', 'my image');
      expect(img).toHaveAttribute('title', 'My legend');
      expect(img).toHaveAttribute('width', '100');
      expect(img).toHaveAttribute('height', '50');

      const legend = container.querySelector('.custom-image-legend');
      expect(legend).toHaveTextContent('My legend');
    });

    it('does not render a legend when the title attr is falsy', () => {
      const node = makeNode('custom-image', {
        src: '/image.png',
        alt: 'my image',
        title: '',
      });

      const { container } = renderMedia(node);

      expect(
        container.querySelector('.custom-image-legend'),
      ).not.toBeInTheDocument();
    });
  });

  describe('video node type', () => {
    it('enables controls only when the controls attr is the string "true"', () => {
      const trueNode = makeNode('video', {
        src: '/video.mp4',
        width: 320,
        height: 240,
        controls: 'true',
      });
      const { container: withControls, unmount } = renderMedia(trueNode);
      expect(withControls.querySelector('video')).toHaveAttribute('controls');
      unmount();

      const falseNode = makeNode('video', {
        src: '/video.mp4',
        controls: 'false',
      });
      const { container: withoutControls } = renderMedia(falseNode);
      expect(withoutControls.querySelector('video')).not.toHaveAttribute(
        'controls',
      );
    });

    it('does not enable controls for a non-"true" string value', () => {
      const node = makeNode('video', { src: '/video.mp4', controls: 'yes' });
      const { container } = renderMedia(node);
      expect(container.querySelector('video')).not.toHaveAttribute('controls');
    });

    it('sets data-video-resolution by combining width and height', () => {
      const node = makeNode('video', {
        src: '/video.mp4',
        width: 320,
        height: 240,
        controls: 'true',
      });
      const { container } = renderMedia(node);

      expect(container.querySelector('video')).toHaveAttribute(
        'data-video-resolution',
        '320x240',
      );
    });
  });

  describe('iframe node type', () => {
    it('renders the wrapper div and the iframe, defaulting allowFullScreen to true when nullish', () => {
      const node = makeNode('iframe', {
        src: 'https://example.com/embed',
        width: 400,
        height: 300,
      });
      const { container } = renderMedia(node);

      expect(container.querySelector('.iframe-node-view')).toBeInTheDocument();
      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveAttribute('src', 'https://example.com/embed');
      expect(iframe).toHaveAttribute('allowfullscreen');
    });

    it('reflects an explicit false allowfullscreen attr', () => {
      const node = makeNode('iframe', {
        src: 'https://example.com/embed',
        allowfullscreen: false,
      });
      const { container } = renderMedia(node);

      expect(container.querySelector('iframe')).not.toHaveAttribute(
        'allowfullscreen',
      );
    });
  });

  describe('unknown node type', () => {
    it('renders no media element inside the drag-handle wrapper', () => {
      const node = makeNode('unsupported-type', {});
      const { container } = renderMedia(node);

      const dragHandle = container.querySelector('[data-drag-handle]');
      expect(dragHandle).toBeInTheDocument();
      expect(dragHandle?.querySelector('img, video, iframe')).toBeNull();
    });
  });

  describe('alignContent', () => {
    it('centers the wrapper (margin auto + fit-content width) for "center" and "justify"', () => {
      const centerNode = makeNode('custom-image', {
        src: '/a.png',
        alt: 'a',
        textAlign: 'center',
      });
      const { container: centerContainer, unmount } = renderMedia(centerNode);
      const centerWrapper = centerContainer.querySelector(
        '[data-node-view-wrapper]',
      ) as HTMLElement;
      expect(centerWrapper.style.marginLeft).toBe('auto');
      expect(centerWrapper.style.marginRight).toBe('auto');
      expect(centerWrapper.style.width).toBe('fit-content');
      unmount();

      const justifyNode = makeNode('custom-image', {
        src: '/a.png',
        alt: 'a',
        textAlign: 'justify',
      });
      const { container: justifyContainer } = renderMedia(justifyNode);
      const justifyWrapper = justifyContainer.querySelector(
        '[data-node-view-wrapper]',
      ) as HTMLElement;
      expect(justifyWrapper.style.marginLeft).toBe('auto');
      expect(justifyWrapper.style.marginRight).toBe('auto');
      expect(justifyWrapper.style.width).toBe('fit-content');
    });

    it('applies a margin-right-only rule for "left"', () => {
      const node = makeNode('custom-image', {
        src: '/a.png',
        alt: 'a',
        textAlign: 'left',
      });
      const { container } = renderMedia(node);
      const wrapper = container.querySelector(
        '[data-node-view-wrapper]',
      ) as HTMLElement;

      expect(wrapper.style.marginRight).toBe('auto');
      expect(wrapper.style.width).toBe('fit-content');
      expect(wrapper.style.marginLeft).toBe('');
    });

    it('applies a margin-left-only rule for "right"', () => {
      const node = makeNode('custom-image', {
        src: '/a.png',
        alt: 'a',
        textAlign: 'right',
      });
      const { container } = renderMedia(node);
      const wrapper = container.querySelector(
        '[data-node-view-wrapper]',
      ) as HTMLElement;

      expect(wrapper.style.marginLeft).toBe('auto');
      expect(wrapper.style.width).toBe('fit-content');
      expect(wrapper.style.marginRight).toBe('');
    });

    it('applies no positioning rule for an unrecognized/absent textAlign', () => {
      const node = makeNode('custom-image', { src: '/a.png', alt: 'a' });
      const { container } = renderMedia(node);
      const wrapper = container.querySelector(
        '[data-node-view-wrapper]',
      ) as HTMLElement;

      expect(wrapper.style.marginLeft).toBe('');
      expect(wrapper.style.marginRight).toBe('');
      expect(wrapper.style.width).toBe('');
    });
  });

  describe('resize handle class', () => {
    // `isVerticalResizeActive` returned by useResizeMedia is a ref object
    // (see useResizeMedia.tsx), not its `.current` boolean value. The
    // ternary in MediaRenderer therefore tests the ref object's own
    // truthiness, which is always true once the ref exists — so the class
    // is always applied, and the "inactive" branch is unreachable via the
    // public API. This test documents that actual (constant) behavior
    // rather than trying to toggle it through a mouse interaction.
    it('always carries vertical-resize-active because the ref object itself is truthy', () => {
      const node = makeNode('custom-image', { src: '/a.png', alt: 'a' });
      const { container } = renderMedia(node);

      expect(container.querySelector('.vertical-resize-handle')).toHaveClass(
        'vertical-resize-active',
      );
    });

    it('delegates mousedown/mouseup on the handle to useResizeMedia, stopping propagation', () => {
      const node = makeNode('custom-image', { src: '/a.png', alt: 'a' });
      const { container } = renderMedia(node);
      const handle = container.querySelector(
        '.vertical-resize-handle',
      ) as HTMLElement;

      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      fireEvent.mouseDown(handle, { clientX: 100 });
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function),
      );

      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      fireEvent.mouseUp(handle);
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function),
      );

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('onVideoPlay', () => {
    it('calls odeServices.data().trackVideoRead when a video with a documentId is played', () => {
      const node = makeNode('video', {
        src: '/video.mp4',
        controls: 'true',
        documentId: 'doc-42',
        isCaptation: 'true',
      });
      const { container } = renderMedia(node);
      const video = container.querySelector('video') as HTMLVideoElement;

      video.dispatchEvent(new Event('play'));

      const { browser, device } = useBrowserInfo(navigator.userAgent);
      expect(trackVideoRead).toHaveBeenCalledWith(
        'doc-42',
        true,
        window.location.hostname,
        `${browser.name} ${browser.version}`,
        device.type,
      );
    });

    it('does not call trackVideoRead when the video has no documentId', () => {
      const node = makeNode('video', { src: '/video.mp4', controls: 'true' });
      const { container } = renderMedia(node);
      const video = container.querySelector('video') as HTMLVideoElement;

      video.dispatchEvent(new Event('play'));

      expect(trackVideoRead).not.toHaveBeenCalled();
    });

    it('does not call trackVideoRead when the "play" event fires on a non-video element', () => {
      const node = makeNode('custom-image', {
        src: '/a.png',
        alt: 'a',
        // Not read by a custom-image, but proves the instanceof guard, not
        // a missing documentId, is what prevents the call here.
        documentId: 'doc-1',
      });
      const { container } = renderMedia(node);
      const img = container.querySelector('img') as HTMLImageElement;

      img.dispatchEvent(new Event('play'));

      expect(trackVideoRead).not.toHaveBeenCalled();
    });
  });
});
