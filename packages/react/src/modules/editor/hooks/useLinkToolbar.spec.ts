import { RefObject } from 'react';

import { HyperlinkAttributes } from '@edifice.io/tiptap-extensions/hyperlink';
import { LinkerAttributes } from '@edifice.io/tiptap-extensions/linker';
import { Editor } from '@tiptap/react';
import { renderHook } from '~/setup';
import { MediaLibraryRef } from '../../multimedia';
import { useLinkToolbar } from './useLinkToolbar';

// Minimal editor mock builder, controlling isActive() and the selection state
const buildEditor = (selectionEmpty = true) => {
  const editor = {
    isActive: vi.fn(),
    commands: {
      extendMarkRange: vi.fn(),
      unsetLinker: vi.fn(),
      unsetLink: vi.fn(),
      setLink: vi.fn(),
    },
    state: {
      selection: {
        empty: selectionEmpty,
        content: vi.fn(() => ({
          content: { child: vi.fn(() => ({ textContent: 'sample' })) },
        })),
      },
    },
  };
  return editor as unknown as Editor;
};

const buildMediaLibraryRef = () =>
  ({
    current: { showLink: vi.fn() },
  }) as unknown as RefObject<MediaLibraryRef>;

describe('useLinkToolbar', () => {
  describe('onEdit', () => {
    it('extends the mark range when a hyperlink is active', () => {
      const editor = buildEditor();
      (editor.isActive as ReturnType<typeof vi.fn>).mockReturnValue(true);
      const mediaLibraryRef = buildMediaLibraryRef();
      const { result } = renderHook(() =>
        useLinkToolbar(editor, mediaLibraryRef),
      );

      result.current.onEdit({
        href: 'https://example.com',
      } as HyperlinkAttributes);

      expect(editor.commands.extendMarkRange).toHaveBeenCalledWith('hyperlink');
    });

    it('does not extend the mark range when no hyperlink is active', () => {
      const editor = buildEditor();
      (editor.isActive as ReturnType<typeof vi.fn>).mockReturnValue(false);
      const mediaLibraryRef = buildMediaLibraryRef();
      const { result } = renderHook(() =>
        useLinkToolbar(editor, mediaLibraryRef),
      );

      result.current.onEdit({
        href: 'https://example.com',
      } as HyperlinkAttributes);

      expect(editor.commands.extendMarkRange).not.toHaveBeenCalled();
    });

    it('shows the internal link tab when attrs is linker-shaped (data-id set)', () => {
      const editor = buildEditor();
      const mediaLibraryRef = buildMediaLibraryRef();
      const { result } = renderHook(() =>
        useLinkToolbar(editor, mediaLibraryRef),
      );

      const attrs = {
        'href': '/blog#/view/id',
        'target': '_blank',
        'title': null,
        'data-id': 'resource-id',
        'data-app-prefix': 'blog',
      } as LinkerAttributes;
      result.current.onEdit(attrs);

      expect(mediaLibraryRef.current?.showLink).toHaveBeenCalledWith({
        target: '_blank',
        resourceId: 'resource-id',
        appPrefix: 'blog',
      });
    });

    it('shows the internal link tab when attrs is linker-shaped (data-app-prefix set)', () => {
      const editor = buildEditor();
      const mediaLibraryRef = buildMediaLibraryRef();
      const { result } = renderHook(() =>
        useLinkToolbar(editor, mediaLibraryRef),
      );

      const attrs = {
        'href': '/blog#/view/id',
        'target': null,
        'title': null,
        'data-id': null,
        'data-app-prefix': 'blog',
      } as LinkerAttributes;
      result.current.onEdit(attrs);

      expect(mediaLibraryRef.current?.showLink).toHaveBeenCalledWith({
        target: null,
        resourceId: null,
        appPrefix: 'blog',
      });
    });

    it('shows the external link tab with an empty text when the selection is empty', () => {
      const editor = buildEditor(true);
      const mediaLibraryRef = buildMediaLibraryRef();
      const { result } = renderHook(() =>
        useLinkToolbar(editor, mediaLibraryRef),
      );

      const attrs = {
        href: 'https://example.com',
        target: '_blank',
        title: null,
        text: null,
      } as HyperlinkAttributes;
      result.current.onEdit(attrs);

      expect(mediaLibraryRef.current?.showLink).toHaveBeenCalledWith({
        link: {
          url: 'https://example.com',
          target: '_blank',
          text: '',
        },
      });
    });

    it('shows the external link tab with the selected text when the selection is not empty', () => {
      const editor = buildEditor(false);
      const mediaLibraryRef = buildMediaLibraryRef();
      const { result } = renderHook(() =>
        useLinkToolbar(editor, mediaLibraryRef),
      );

      const attrs = {
        href: 'https://example.com',
        target: null,
        title: null,
        text: null,
      } as HyperlinkAttributes;
      result.current.onEdit(attrs);

      expect(mediaLibraryRef.current?.showLink).toHaveBeenCalledWith({
        link: {
          url: 'https://example.com',
          target: undefined,
          text: 'sample',
        },
      });
    });
  });

  describe('onOpen', () => {
    it('opens the given href in a new tab', () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      const editor = buildEditor();
      const mediaLibraryRef = buildMediaLibraryRef();
      const { result } = renderHook(() =>
        useLinkToolbar(editor, mediaLibraryRef),
      );

      result.current.onOpen({
        href: 'https://example.com',
      } as LinkerAttributes);

      expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
    });

    it('falls back to about:blank when no href is provided', () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      const editor = buildEditor();
      const mediaLibraryRef = buildMediaLibraryRef();
      const { result } = renderHook(() =>
        useLinkToolbar(editor, mediaLibraryRef),
      );

      result.current.onOpen({ href: null } as LinkerAttributes);

      expect(openSpy).toHaveBeenCalledWith('about:blank', '_blank');
    });
  });

  describe('onUnlink', () => {
    it('unsets both the linker node and the hyperlink mark', () => {
      const editor = buildEditor();
      const mediaLibraryRef = buildMediaLibraryRef();
      const { result } = renderHook(() =>
        useLinkToolbar(editor, mediaLibraryRef),
      );

      result.current.onUnlink();

      expect(editor.commands.unsetLinker).toHaveBeenCalled();
      expect(editor.commands.unsetLink).toHaveBeenCalled();
    });
  });
});
