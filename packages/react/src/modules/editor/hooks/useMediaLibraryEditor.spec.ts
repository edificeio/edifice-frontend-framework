import { Editor } from '@tiptap/react';
import { WorkspaceElement } from '@edifice.io/client';
import { act, renderHook } from '~/setup';
import {
  IExternalLink,
  InternalLinkTabResult,
  MediaLibraryRef,
} from '../../multimedia';
import { useMediaLibraryEditor } from './useMediaLibraryEditor';

const { removeMock } = vi.hoisted(() => ({
  removeMock: vi.fn(),
}));

vi.mock('../../../hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../hooks')>();
  return {
    ...actual,
    useWorkspaceFile: () => ({ remove: removeMock }),
  };
});

// Minimal WorkspaceElement fixture builder (only fields read by the hook).
const buildWorkspaceElement = (
  overrides: Partial<WorkspaceElement> = {},
): WorkspaceElement =>
  ({
    _id: 'id-1',
    eType: 'file',
    eParent: 'parent',
    name: 'file-name',
    children: [],
    created: new Date(),
    _shared: [],
    isShared: false,
    owner: 'owner-1',
    public: false,
    ...overrides,
  }) as WorkspaceElement;

// Minimal chainable mock, every method used by the hook returns itself.
const buildChainMock = () => {
  const chainMock: Record<string, ReturnType<typeof vi.fn>> = {};
  chainMock.focus = vi.fn(() => chainMock);
  chainMock.setNewImage = vi.fn(() => chainMock);
  chainMock.insertContent = vi.fn(() => chainMock);
  chainMock.insertContentAt = vi.fn(() => chainMock);
  chainMock.setTextSelection = vi.fn(() => chainMock);
  chainMock.run = vi.fn(() => chainMock);
  return chainMock;
};

// Builds a mock editor + its underlying (shared) selection object.
// `editor.state.selection` and `editor.view.state.selection` point to the
// same object on purpose: the hook reads from both depending on the branch,
// and tests only need to set/mutate one shared object.
const buildEditor = () => {
  const chainMock = buildChainMock();
  const selection = {
    to: 0,
    from: 0,
    head: 0,
    empty: true,
    content: vi.fn(() => ({
      content: { child: vi.fn(() => ({ textContent: 'txt' })) },
    })),
  };
  const editor = {
    chain: vi.fn(() => chainMock),
    commands: {
      setTextSelection: vi.fn(),
      setAudio: vi.fn(),
      setVideo: vi.fn(),
      insertContentAt: vi.fn(),
      enter: vi.fn(),
      unsetLinker: vi.fn(),
      toggleMark: vi.fn(),
      focus: vi.fn(),
      setLinker: vi.fn(),
      setLink: vi.fn(),
    },
    state: { selection },
    view: { state: { selection } },
    isActive: vi.fn(() => false),
  };
  return {
    editor: editor as unknown as Editor,
    editorMock: editor,
    chainMock,
    selection,
  };
};

const buildRef = (
  type: MediaLibraryRef['type'],
): MediaLibraryRef & { show: ReturnType<typeof vi.fn> } => ({
  type,
  show: vi.fn(),
  hide: vi.fn(),
  showLink: vi.fn(),
});

describe('useMediaLibraryEditor', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('onSuccess / appendResult - image', () => {
    it('appends a single (protected) image and does not deselect it', () => {
      const { editor, editorMock, chainMock } = buildEditor();
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      result.current.ref.current = buildRef('image');

      const images = [
        buildWorkspaceElement({ _id: 'img-1', alt: 'alt-1', title: 'title-1' }),
      ];

      act(() => {
        result.current.onSuccess(images);
      });

      expect(chainMock.focus).toHaveBeenCalledTimes(1);
      expect(chainMock.setNewImage).toHaveBeenCalledWith(
        expect.objectContaining({
          src: expect.stringContaining('/workspace/document/img-1'),
          alt: 'alt-1',
          title: 'title-1',
        }),
      );
      expect(chainMock.setNewImage).not.toHaveBeenCalledWith(
        expect.objectContaining({
          src: expect.stringContaining('/workspace/pub/'),
        }),
      );
      expect(chainMock.run).toHaveBeenCalledTimes(1);
      // Single image => never deselected in between.
      expect(editorMock.commands.setTextSelection).not.toHaveBeenCalled();
      expect(result.current.ref.current?.hide).toHaveBeenCalledTimes(1);
    });

    it('appends multiple (public) images and deselects all but the last', () => {
      const { editor, editorMock, chainMock } = buildEditor();
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      result.current.ref.current = buildRef('image');

      const images = [
        buildWorkspaceElement({ _id: 'img-1', public: true }),
        buildWorkspaceElement({ _id: 'img-2', public: true }),
      ];

      act(() => {
        result.current.onSuccess(images);
      });

      expect(chainMock.setNewImage).toHaveBeenCalledTimes(2);
      expect(chainMock.setNewImage).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          src: expect.stringContaining('/workspace/pub/document/img-1'),
        }),
      );
      expect(chainMock.setNewImage).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          src: expect.stringContaining('/workspace/pub/document/img-2'),
        }),
      );
      // First image (index 0 < imagesSize 1) is deselected, last is not.
      expect(editorMock.commands.setTextSelection).toHaveBeenCalledTimes(1);
    });
  });

  describe('onSuccess / appendResult - audio', () => {
    it('inserts a single sound and resets the cursor position', () => {
      const { editor, editorMock, selection } = buildEditor();
      selection.from = 42;
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      result.current.ref.current = buildRef('audio');

      const sounds = [buildWorkspaceElement({ _id: 'sound-1', public: false })];

      act(() => {
        result.current.onSuccess(sounds);
      });

      expect(editorMock.commands.setAudio).toHaveBeenCalledWith(
        'sound-1',
        '/workspace/document/sound-1',
      );
      expect(editorMock.commands.setTextSelection).toHaveBeenCalledWith(42);
    });

    it('inserts multiple sounds, one setAudio call per sound (public url)', () => {
      const { editor, editorMock } = buildEditor();
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      result.current.ref.current = buildRef('audio');

      const sounds = [
        buildWorkspaceElement({ _id: 'sound-1', public: true }),
        buildWorkspaceElement({ _id: 'sound-2', public: false }),
      ];

      act(() => {
        result.current.onSuccess(sounds);
      });

      expect(editorMock.commands.setAudio).toHaveBeenCalledTimes(2);
      expect(editorMock.commands.setAudio).toHaveBeenCalledWith(
        'sound-1',
        '/workspace/pub/document/sound-1',
      );
      expect(editorMock.commands.setAudio).toHaveBeenCalledWith(
        'sound-2',
        '/workspace/document/sound-2',
      );
      expect(editorMock.commands.setTextSelection).toHaveBeenCalledTimes(2);
    });
  });

  describe('onSuccess / appendResult - video', () => {
    it('inserts an embedded iframe code as-is (string result)', () => {
      const { editor, editorMock, selection } = buildEditor();
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      result.current.ref.current = buildRef('video');

      const embedCode = '<iframe src="https://provider/video"></iframe>';

      act(() => {
        result.current.onSuccess(embedCode);
      });

      expect(editorMock.commands.insertContentAt).toHaveBeenCalledWith(
        selection,
        embedCode,
      );
    });

    it('inserts one or more videos (WorkspaceElement[] result, public/protected)', () => {
      const { editor, editorMock } = buildEditor();
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      result.current.ref.current = buildRef('video');

      const videos = [
        buildWorkspaceElement({ _id: 'video-1', public: true }),
        buildWorkspaceElement({ _id: 'video-2', public: false }),
      ];

      act(() => {
        result.current.onSuccess(videos);
      });

      expect(editorMock.commands.setVideo).toHaveBeenCalledTimes(2);
      expect(editorMock.commands.setVideo).toHaveBeenCalledWith(
        'video-1',
        '/workspace/pub/document/video-1',
        true,
      );
      expect(editorMock.commands.setVideo).toHaveBeenCalledWith(
        'video-2',
        '/workspace/document/video-2',
        true,
      );
    });
  });

  describe('onSuccess / appendResult - attachment', () => {
    it('builds an HTML fragment with every link name and inserts it', () => {
      const { editor, editorMock } = buildEditor();
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      result.current.ref.current = buildRef('attachment');

      const attachments = [
        buildWorkspaceElement({ _id: 'att-1', name: 'first-file.pdf' }),
        buildWorkspaceElement({
          _id: 'att-2',
          name: 'second-file.pdf',
          public: true,
        }),
      ];

      act(() => {
        result.current.onSuccess(attachments);
      });

      expect(editorMock.commands.insertContentAt).toHaveBeenCalledTimes(1);
      const html = editorMock.commands.insertContentAt.mock
        .calls[0][1] as string;
      expect(html).toContain('first-file.pdf');
      expect(html).toContain('second-file.pdf');
      expect(html).toContain('/workspace/pub/document/att-2');
      expect(editorMock.commands.enter).toHaveBeenCalledTimes(1);
    });
  });

  describe('onSuccess / appendResult - hyperlink', () => {
    it('unsets a pre-existing linker mark when isActive("linker") is true', () => {
      const { editor, editorMock } = buildEditor();
      editorMock.isActive = vi.fn((name: string) => name === 'linker');
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      result.current.ref.current = buildRef('hyperlink');

      const resourceResult: InternalLinkTabResult = {
        resources: [
          {
            path: '/path',
            application: 'blog',
            assetId: 'asset-1',
            name: 'Resource 1',
          } as any,
        ],
      };

      act(() => {
        result.current.onSuccess(resourceResult);
      });

      expect(editorMock.commands.unsetLinker).toHaveBeenCalledTimes(1);
      expect(editorMock.commands.toggleMark).not.toHaveBeenCalled();
    });

    it('cancels a pre-existing hyperlink mark when isActive("hyperlink") is true', () => {
      const { editor, editorMock } = buildEditor();
      editorMock.isActive = vi.fn((name: string) => name === 'hyperlink');
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      result.current.ref.current = buildRef('hyperlink');

      const resourceResult: InternalLinkTabResult = {
        resources: [
          {
            path: '/path',
            application: 'blog',
            assetId: 'asset-1',
            name: 'Resource 1',
          } as any,
        ],
      };

      act(() => {
        result.current.onSuccess(resourceResult);
      });

      expect(editorMock.commands.toggleMark).toHaveBeenCalledWith('hyperlink');
      expect(editorMock.commands.unsetLinker).not.toHaveBeenCalled();
    });

    it('internal links, empty selection: setLinker per resource + enter() between them', () => {
      const { editor, editorMock, selection } = buildEditor();
      selection.empty = true;
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      result.current.ref.current = buildRef('hyperlink');

      const resourceResult: InternalLinkTabResult = {
        target: '_blank',
        resources: [
          {
            path: '/path-1',
            application: 'blog',
            assetId: 'asset-1',
            name: 'Resource 1',
          } as any,
          {
            path: '/path-2',
            application: 'blog',
            assetId: 'asset-2',
            name: 'Resource 2',
          } as any,
        ],
      };

      act(() => {
        result.current.onSuccess(resourceResult);
      });

      expect(editorMock.commands.focus).toHaveBeenCalledTimes(1);
      expect(editorMock.commands.setLinker).toHaveBeenCalledTimes(2);
      expect(editorMock.commands.setLinker).toHaveBeenNthCalledWith(1, {
        'href': '/path-1',
        'data-app-prefix': 'blog',
        'data-id': 'asset-1',
        'target': '_blank',
        'title': 'Resource 1',
      });
      // More than one resource => a newline is inserted between links.
      expect(editorMock.commands.enter).toHaveBeenCalledTimes(2);
    });

    it('internal links, single resource + empty selection: no enter() call', () => {
      const { editor, editorMock, selection } = buildEditor();
      selection.empty = true;
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      result.current.ref.current = buildRef('hyperlink');

      const resourceResult: InternalLinkTabResult = {
        resources: [
          {
            path: '/path-1',
            application: 'blog',
            assetId: 'asset-1',
            name: 'Resource 1',
          } as any,
        ],
      };

      act(() => {
        result.current.onSuccess(resourceResult);
      });

      expect(editorMock.commands.setLinker).toHaveBeenCalledTimes(1);
      expect(editorMock.commands.enter).not.toHaveBeenCalled();
    });

    it('internal links, non-empty selection: uses setLink (Hyperlink sub-branch)', () => {
      const { editor, editorMock, selection } = buildEditor();
      selection.empty = false;
      selection.head = 5;
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      result.current.ref.current = buildRef('hyperlink');

      const resourceResult: InternalLinkTabResult = {
        target: '_blank',
        resources: [
          {
            path: '/path-1',
            application: 'blog',
            assetId: 'asset-1',
            name: 'Resource 1',
          } as any,
          {
            path: '/path-2',
            application: 'blog',
            assetId: 'asset-2',
            name: 'Resource 2',
          } as any,
        ],
      };

      act(() => {
        result.current.onSuccess(resourceResult);
      });

      expect(editorMock.commands.setLink).toHaveBeenCalledTimes(2);
      expect(editorMock.commands.setLink).toHaveBeenNthCalledWith(1, {
        href: '/path-1',
        target: '_blank',
      });
      expect(editorMock.commands.setTextSelection).toHaveBeenCalledWith({
        from: 5,
        to: 5,
      });
      expect(editorMock.commands.enter).toHaveBeenCalledTimes(2);
    });

    it('external link, empty selection: inserts + selects the link text, then setLink', () => {
      const { editor, editorMock, chainMock, selection } = buildEditor();
      selection.empty = true;
      selection.head = 10;
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      result.current.ref.current = buildRef('hyperlink');

      const externalLink: IExternalLink = {
        url: 'https://example.org',
        target: '_blank',
        text: 'Click me',
      };

      act(() => {
        result.current.onSuccess(externalLink);
      });

      expect(chainMock.insertContent).toHaveBeenCalledWith('Click me');
      expect(chainMock.setTextSelection).toHaveBeenCalledWith({
        from: 10,
        to: 10 + 'Click me'.length,
      });
      expect(editorMock.commands.setLink).toHaveBeenCalledWith({
        href: 'https://example.org',
        title: '',
        target: '_blank',
      });
    });

    it('external link, non-empty selection, text already selected: no re-insertion', () => {
      const { editor, editorMock, chainMock, selection } = buildEditor();
      selection.empty = false;
      selection.from = 1;
      selection.to = 9;
      selection.content = vi.fn(() => ({
        content: { child: vi.fn(() => ({ textContent: 'Same text' })) },
      }));
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      result.current.ref.current = buildRef('hyperlink');

      const externalLink: IExternalLink = {
        url: 'https://example.org',
        text: 'Same text',
      };

      act(() => {
        result.current.onSuccess(externalLink);
      });

      expect(chainMock.insertContentAt).not.toHaveBeenCalled();
      expect(editorMock.commands.setLink).toHaveBeenCalledWith({
        href: 'https://example.org',
        title: '',
        target: undefined,
      });
    });

    it('external link, non-empty selection, different text: re-inserts + reselects', () => {
      const { editor, editorMock, chainMock, selection } = buildEditor();
      selection.empty = false;
      selection.from = 1;
      selection.to = 9;
      selection.content = vi.fn(() => ({
        content: { child: vi.fn(() => ({ textContent: 'Old text' })) },
      }));
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      result.current.ref.current = buildRef('hyperlink');

      const externalLink: IExternalLink = {
        url: 'https://example.org',
        text: 'New text',
      };

      act(() => {
        result.current.onSuccess(externalLink);
      });

      expect(chainMock.focus).toHaveBeenCalled();
      expect(chainMock.insertContentAt).toHaveBeenCalledWith(
        { from: 1, to: 9 },
        'New text',
      );
      expect(chainMock.setTextSelection).toHaveBeenCalledWith({
        from: 1,
        to: 1 + 'New text'.length,
      });
      expect(editorMock.commands.setLink).toHaveBeenCalledWith({
        href: 'https://example.org',
        title: '',
        target: undefined,
      });
    });
  });

  describe('onSuccess / appendResult - embedder', () => {
    it('inserts the raw result and calls enter()', () => {
      const { editor, editorMock, selection } = buildEditor();
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      result.current.ref.current = buildRef('embedder');

      const embedResult = '<iframe src="https://embed"></iframe>';

      act(() => {
        result.current.onSuccess(embedResult);
      });

      expect(editorMock.commands.insertContentAt).toHaveBeenCalledWith(
        selection,
        embedResult,
      );
      expect(editorMock.commands.enter).toHaveBeenCalledTimes(1);
    });
  });

  describe('onSuccess / appendResult - unknown type', () => {
    it('does not invoke any known editor command for an unhandled type', () => {
      const { editor, editorMock, chainMock } = buildEditor();
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      // 'studio' is a valid MediaLibraryType but has no `case` in the switch.
      result.current.ref.current = buildRef('studio');

      act(() => {
        result.current.onSuccess([]);
      });

      expect(chainMock.setNewImage).not.toHaveBeenCalled();
      expect(editorMock.commands.setAudio).not.toHaveBeenCalled();
      expect(editorMock.commands.setVideo).not.toHaveBeenCalled();
      expect(editorMock.commands.insertContentAt).not.toHaveBeenCalled();
      expect(editorMock.commands.setLinker).not.toHaveBeenCalled();
      expect(editorMock.commands.setLink).not.toHaveBeenCalled();
      expect(result.current.ref.current?.hide).toHaveBeenCalledTimes(1);
    });
  });

  describe('onSuccess / appendResult - early return guards', () => {
    it('does not throw when editor is null (type set) and still hides the modal', () => {
      const { result } = renderHook(() => useMediaLibraryEditor(null));
      result.current.ref.current = buildRef('image');

      expect(() => {
        act(() => {
          result.current.onSuccess([buildWorkspaceElement()]);
        });
      }).not.toThrow();

      // `hide()` is called unconditionally once the `if (type)` block is
      // entered in `onSuccess`, regardless of `appendResult`'s early return.
      expect(result.current.ref.current?.hide).toHaveBeenCalledTimes(1);
    });

    it('does nothing when the ref has no type set (onSuccess no-op)', () => {
      const { editor, editorMock, chainMock } = buildEditor();
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      const ref = buildRef('image');
      ref.type = null as unknown as MediaLibraryRef['type'];
      result.current.ref.current = ref;

      act(() => {
        result.current.onSuccess([buildWorkspaceElement()]);
      });

      // The whole `if (mediaLibraryRef.current?.type)` block is skipped.
      expect(chainMock.setNewImage).not.toHaveBeenCalled();
      expect(editorMock.commands.setAudio).not.toHaveBeenCalled();
      expect(ref.hide).not.toHaveBeenCalled();
    });

    it('does not throw when the ref itself is null', () => {
      const { editor } = buildEditor();
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      result.current.ref.current = null;

      expect(() => {
        act(() => {
          result.current.onSuccess([buildWorkspaceElement()]);
        });
      }).not.toThrow();
    });
  });

  describe('onCancel', () => {
    it('removes the uploads then hides the modal when type is set and uploads is non-empty', async () => {
      const { editor } = buildEditor();
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      const ref = buildRef('image');
      result.current.ref.current = ref;
      const uploads = [buildWorkspaceElement({ _id: 'up-1' })];

      await act(async () => {
        await result.current.onCancel(uploads);
      });

      expect(removeMock).toHaveBeenCalledWith(uploads);
      expect(ref.hide).toHaveBeenCalledTimes(1);
    });

    it('does not call remove when uploads is undefined, but still hides', async () => {
      const { editor } = buildEditor();
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      const ref = buildRef('image');
      result.current.ref.current = ref;

      await act(async () => {
        await result.current.onCancel(undefined);
      });

      expect(removeMock).not.toHaveBeenCalled();
      expect(ref.hide).toHaveBeenCalledTimes(1);
    });

    it('does not call remove when uploads is an empty array, but still hides', async () => {
      const { editor } = buildEditor();
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      const ref = buildRef('image');
      result.current.ref.current = ref;

      await act(async () => {
        await result.current.onCancel([]);
      });

      expect(removeMock).not.toHaveBeenCalled();
      expect(ref.hide).toHaveBeenCalledTimes(1);
    });

    it('does not call remove when the ref has no type, but still hides', async () => {
      const { editor } = buildEditor();
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      const ref = buildRef(null as unknown as MediaLibraryRef['type']);
      result.current.ref.current = ref;
      const uploads = [buildWorkspaceElement({ _id: 'up-1' })];

      await act(async () => {
        await result.current.onCancel(uploads);
      });

      expect(removeMock).not.toHaveBeenCalled();
      expect(ref.hide).toHaveBeenCalledTimes(1);
    });
  });

  describe('onTabChange', () => {
    it('removes the uploads when type is set and uploads is non-empty, without hiding', async () => {
      const { editor } = buildEditor();
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      const ref = buildRef('image');
      result.current.ref.current = ref;
      const uploads = [buildWorkspaceElement({ _id: 'up-1' })];

      await act(async () => {
        await result.current.onTabChange({ id: 'workspace' } as any, uploads);
      });

      expect(removeMock).toHaveBeenCalledWith(uploads);
      expect(ref.hide).not.toHaveBeenCalled();
    });

    it('does not call remove when uploads is empty/undefined', async () => {
      const { editor } = buildEditor();
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      const ref = buildRef('image');
      result.current.ref.current = ref;

      await act(async () => {
        await result.current.onTabChange({ id: 'workspace' } as any);
      });

      expect(removeMock).not.toHaveBeenCalled();
      expect(ref.hide).not.toHaveBeenCalled();
    });

    it('does not call remove when the ref has no type', async () => {
      const { editor } = buildEditor();
      const { result } = renderHook(() => useMediaLibraryEditor(editor));
      const ref = buildRef(null as unknown as MediaLibraryRef['type']);
      result.current.ref.current = ref;
      const uploads = [buildWorkspaceElement({ _id: 'up-1' })];

      await act(async () => {
        await result.current.onTabChange({ id: 'workspace' } as any, uploads);
      });

      expect(removeMock).not.toHaveBeenCalled();
    });
  });
});
