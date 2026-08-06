import { Editor } from '@tiptap/react';

import { render } from '~/setup';
import AudioRenderer from './AudioRenderer';

function makeNode(attrs: Record<string, any> = {}) {
  return { attrs } as any;
}

function renderAudio(node: any) {
  const props = {
    node,
    editor: {} as Editor,
  };

  return render(<AudioRenderer {...props} />);
}

describe('AudioRenderer', () => {
  it('renders the audio element with src and data-document-id from node.attrs.src', () => {
    const node = makeNode({ src: '/workspace/document/audio-1' });

    const { container } = renderAudio(node);

    const audio = container.querySelector('audio');
    expect(audio).toHaveAttribute('src', '/workspace/document/audio-1');
    expect(audio).toHaveAttribute(
      'data-document-id',
      '/workspace/document/audio-1',
    );
  });

  describe('alignContent', () => {
    it('centers the wrapper (margin auto + fit-content width) for "center"', () => {
      const node = makeNode({ src: '/a.mp3', textAlign: 'center' });
      const { container } = renderAudio(node);

      const wrapper = container.querySelector('.audio-wrapper') as HTMLElement;
      expect(wrapper.style.marginLeft).toBe('auto');
      expect(wrapper.style.marginRight).toBe('auto');
      expect(wrapper.style.width).toBe('fit-content');
    });

    it('centers the wrapper (margin auto + fit-content width) for "justify"', () => {
      const node = makeNode({ src: '/a.mp3', textAlign: 'justify' });
      const { container } = renderAudio(node);

      const wrapper = container.querySelector('.audio-wrapper') as HTMLElement;
      expect(wrapper.style.marginLeft).toBe('auto');
      expect(wrapper.style.marginRight).toBe('auto');
      expect(wrapper.style.width).toBe('fit-content');
    });

    it('applies a margin-right-only rule for "left"', () => {
      const node = makeNode({ src: '/a.mp3', textAlign: 'left' });
      const { container } = renderAudio(node);

      const wrapper = container.querySelector('.audio-wrapper') as HTMLElement;
      expect(wrapper.style.marginRight).toBe('auto');
      expect(wrapper.style.width).toBe('fit-content');
      expect(wrapper.style.marginLeft).toBe('');
    });

    it('applies a margin-left-only rule for "right"', () => {
      const node = makeNode({ src: '/a.mp3', textAlign: 'right' });
      const { container } = renderAudio(node);

      const wrapper = container.querySelector('.audio-wrapper') as HTMLElement;
      expect(wrapper.style.marginLeft).toBe('auto');
      expect(wrapper.style.width).toBe('fit-content');
      expect(wrapper.style.marginRight).toBe('');
    });

    it('applies no positioning rule for an unrecognized/absent textAlign', () => {
      const node = makeNode({ src: '/a.mp3' });
      const { container } = renderAudio(node);

      const wrapper = container.querySelector('.audio-wrapper') as HTMLElement;
      expect(wrapper.style.marginLeft).toBe('');
      expect(wrapper.style.marginRight).toBe('');
      expect(wrapper.style.width).toBe('');
    });
  });
});
