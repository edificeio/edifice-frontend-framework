import { Editor } from '@tiptap/react';
import { renderHook } from '~/setup';
import { useImageSelection } from './useImageSelection';

// Minimal node fixture builder for editor.state.doc.nodesBetween() callback
const buildNode = (overrides: Record<string, unknown> = {}) => ({
  isAtom: true,
  type: { name: 'image' },
  attrs: { src: 'src.png', title: 'title', alt: 'alt' },
  ...overrides,
});

// Minimal editor mock builder, controlling which nodes nodesBetween() visits
const buildEditor = (nodes: ReturnType<typeof buildNode>[] = []) => {
  const chainMock = {
    updateAttributes: vi.fn(() => chainMock),
    run: vi.fn(),
  };
  const editor = {
    state: {
      selection: { $from: { pos: 0 }, $to: { pos: 10 } },
      doc: {
        nodesBetween: vi.fn(
          (
            _from: number,
            _to: number,
            callback: (node: ReturnType<typeof buildNode>) => void,
          ) => {
            nodes.forEach((node) => callback(node));
          },
        ),
      },
    },
    chain: vi.fn(() => chainMock),
  };
  return { editor: editor as unknown as Editor, chainMock };
};

describe('useImageSelection', () => {
  describe('getSelection', () => {
    it('returns an empty array when there is no editor', () => {
      const { result } = renderHook(() => useImageSelection(undefined));
      expect(result.current.getSelection()).toEqual([]);
    });

    it('returns an empty array when the editor is null', () => {
      const { result } = renderHook(() => useImageSelection(null));
      expect(result.current.getSelection()).toEqual([]);
    });

    it('includes a matching image node', () => {
      const imageNode = buildNode({
        type: { name: 'image' },
        attrs: { src: 'image.png', title: 'Image title', alt: 'Image alt' },
      });
      const { editor } = buildEditor([imageNode]);
      const { result } = renderHook(() => useImageSelection(editor));

      expect(result.current.getSelection()).toEqual([
        { src: 'image.png', title: 'Image title', alt: 'Image alt' },
      ]);
    });

    it('includes a matching custom-image node', () => {
      const customImageNode = buildNode({
        type: { name: 'custom-image' },
        attrs: {
          src: 'custom.png',
          title: 'Custom title',
          alt: 'Custom alt',
        },
      });
      const { editor } = buildEditor([customImageNode]);
      const { result } = renderHook(() => useImageSelection(editor));

      expect(result.current.getSelection()).toEqual([
        { src: 'custom.png', title: 'Custom title', alt: 'Custom alt' },
      ]);
    });

    it('excludes a non-atom node', () => {
      const nonAtomNode = buildNode({ isAtom: false });
      const { editor } = buildEditor([nonAtomNode]);
      const { result } = renderHook(() => useImageSelection(editor));

      expect(result.current.getSelection()).toEqual([]);
    });

    it('excludes an atom node with an unrelated type', () => {
      const paragraphNode = buildNode({ type: { name: 'paragraph' } });
      const { editor } = buildEditor([paragraphNode]);
      const { result } = renderHook(() => useImageSelection(editor));

      expect(result.current.getSelection()).toEqual([]);
    });

    it('only keeps matching nodes among a mix of visited nodes', () => {
      const imageNode = buildNode({
        type: { name: 'image' },
        attrs: { src: 'image.png', title: 'Image title', alt: 'Image alt' },
      });
      const paragraphNode = buildNode({
        isAtom: false,
        type: { name: 'paragraph' },
      });
      const { editor } = buildEditor([imageNode, paragraphNode]);
      const { result } = renderHook(() => useImageSelection(editor));

      expect(result.current.getSelection()).toEqual([
        { src: 'image.png', title: 'Image title', alt: 'Image alt' },
      ]);
    });
  });

  describe('setAttributes', () => {
    it('does not throw when there is no editor', () => {
      const { result } = renderHook(() => useImageSelection(undefined));

      expect(() =>
        result.current.setAttributes({ url: 'image.png' }),
      ).not.toThrow();
    });

    it('updates the custom-image node and does not fall back to image when it succeeds', () => {
      const { editor, chainMock } = buildEditor();
      chainMock.run.mockReturnValue(true);
      const { result } = renderHook(() => useImageSelection(editor));

      result.current.setAttributes({
        url: 'image.png',
        alt: 'alt text',
        title: 'a title',
      });

      expect(chainMock.updateAttributes).toHaveBeenCalledTimes(1);
      expect(chainMock.updateAttributes).toHaveBeenCalledWith(
        'custom-image',
        expect.objectContaining({
          src: expect.stringContaining('image.png'),
          alt: 'alt text',
          title: 'a title',
        }),
      );
      expect(chainMock.run).toHaveBeenCalledTimes(1);
    });

    it('falls back to updating the image node when the custom-image update fails', () => {
      const { editor, chainMock } = buildEditor();
      chainMock.run.mockReturnValue(false);
      const { result } = renderHook(() => useImageSelection(editor));

      result.current.setAttributes({
        url: 'image.png',
        alt: 'alt text',
        title: 'a title',
      });

      expect(chainMock.updateAttributes).toHaveBeenCalledTimes(2);
      expect(chainMock.updateAttributes).toHaveBeenNthCalledWith(
        1,
        'custom-image',
        expect.objectContaining({ src: expect.stringContaining('image.png') }),
      );
      expect(chainMock.updateAttributes).toHaveBeenNthCalledWith(
        2,
        'image',
        expect.objectContaining({ src: expect.stringContaining('image.png') }),
      );
      expect(chainMock.run).toHaveBeenCalledTimes(2);
    });
  });
});
