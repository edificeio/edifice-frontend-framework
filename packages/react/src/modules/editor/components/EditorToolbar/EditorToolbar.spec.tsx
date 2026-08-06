import { RefObject } from 'react';

import { Editor } from '@tiptap/core';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';

import { CustomHighlight } from '@edifice.io/tiptap-extensions/highlight';
import { InformationPane } from '@edifice.io/tiptap-extensions/information-pane';

import { render, screen } from '~/setup';
import { CantooEditor } from '../../hooks/useCantooEditor';
import { EditorContext } from '../../hooks/useEditorContext';
import { createTestEditor } from '../../test-utils/createTestEditor';
import { MediaLibraryRef } from '../../../multimedia';
import { EditorToolbar } from './EditorToolbar';

// All 7 dropdown sub-components are already covered by their own dedicated
// specs. Stubbing them here keeps this spec focused on EditorToolbar's own
// composition/visibility/gating logic (which item shows, which is disabled,
// which handler fires) instead of re-testing each dropdown's internals.
vi.mock('./EditorToolbar.Cantoo.tsx', () => ({
  EditorToolbarCantoo: () => <div data-testid="mock-cantoo" />,
}));
vi.mock('./EditorToolbar.Typography', () => ({
  EditorToolbarTypography: () => <div data-testid="mock-typography" />,
}));
vi.mock('./EditorToolbar.TextSize', () => ({
  EditorToolbarTextSize: () => <div data-testid="mock-text-size" />,
}));
vi.mock('./EditorToolbar.TextColor', () => ({
  EditorToolbarTextColor: () => <div data-testid="mock-text-color" />,
}));
vi.mock('./EditorToolbar.HighlightColor', () => ({
  EditorToolbarHighlightColor: () => <div data-testid="mock-highlight-color" />,
}));
vi.mock('./EditorToolbar.Emoji', () => ({
  EditorToolbarEmoji: () => <div data-testid="mock-emoji" />,
}));
vi.mock('./EditorToolbar.DropdownMenu', () => ({
  EditorToolbarDropdownMenu: (props: { ariaLabel: string }) => (
    <div data-testid={`mock-dropdown-menu-${props.ariaLabel}`} />
  ),
}));
vi.mock('./EditorToolbar.PlusMenu', () => ({
  EditorToolbarPlusMenu: () => <div data-testid="mock-plus-menu" />,
}));

// Tracks every real tiptap `Editor` created by a test so it can be destroyed
// afterwards, whatever helper was used to build it.
let editors: Editor[] = [];

function track<T extends Editor>(editor: T): T {
  editors.push(editor);
  return editor;
}

afterEach(() => {
  editors.forEach((editor) => editor.destroy());
  editors = [];
});

/** A editor built from only `StarterKit`, bypassing createTestEditor's
 * default extension set entirely - used to test visibility branches that
 * depend on an extension NOT being present (Underline, TextAlign, color,
 * highlight, fontFamily are all absent here). */
function makeBareEditor(content = '<p></p>') {
  return track(new Editor({ extensions: [StarterKit], content }));
}

/** A `StarterKit`-only editor with history explicitly disabled - the
 * `history` extension always ships as part of `createTestEditor`'s default
 * set, so the only way to get an editor without it is to opt out at the
 * source (StarterKit bundles its own `history` sub-extension by name, and
 * `hasExtension` matches by name regardless of configuration). */
function makeNoHistoryEditor(content = '<p></p>') {
  return track(
    new Editor({
      extensions: [StarterKit.configure({ history: false })],
      content,
    }),
  );
}

function buildMediaLibraryRef(
  overrides: Partial<MediaLibraryRef> = {},
): RefObject<MediaLibraryRef> {
  return {
    current: {
      show: vi.fn(),
      hide: vi.fn(),
      showLink: vi.fn(),
      type: null,
      ...overrides,
    },
  };
}

function buildCantooEditor(
  overrides: Partial<CantooEditor> = {},
): CantooEditor {
  return {
    cantooParam: '',
    isAvailable: false,
    speech2textIsAvailable: false,
    speech2textIsActive: false,
    text2speechIsActive: false,
    toggleSpeech2Text: vi.fn(),
    toggleText2Speech: vi.fn(),
    toogleSettings: vi.fn(),
    openPositionAdaptText: { right: false, bottom: false },
    handleCantooAdaptTextPosition: vi.fn(),
    ...overrides,
  };
}

function renderToolbar(
  editor: Editor,
  options: {
    mediaLibraryRef?: RefObject<MediaLibraryRef>;
    toggleMathsModal?: () => void;
    cantooEditor?: CantooEditor;
  } = {},
) {
  const mediaLibraryRef = options.mediaLibraryRef ?? buildMediaLibraryRef();
  const toggleMathsModal = options.toggleMathsModal ?? vi.fn();
  const cantooEditor = options.cantooEditor ?? buildCantooEditor();

  const rendered = render(
    <EditorContext.Provider
      value={{ id: 'toolbar', appCode: 'blog', editor, editable: true }}
    >
      <EditorToolbar
        mediaLibraryRef={mediaLibraryRef}
        toggleMathsModal={toggleMathsModal}
        cantooEditor={cantooEditor}
      />
    </EditorContext.Provider>,
  );

  return { mediaLibraryRef, toggleMathsModal, cantooEditor, ...rendered };
}

describe('EditorToolbar', () => {
  beforeAll(() => {
    // The underlying `Toolbar` unconditionally calls `useBreakpoint`, which
    // relies on `window.matchMedia`, absent from jsdom.
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  describe('undo / redo', () => {
    it('disables undo and redo on a fresh editor with nothing to undo/redo', () => {
      const editor = track(createTestEditor());
      renderToolbar(editor);

      expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Redo' })).toBeDisabled();
    });

    it('enables undo once a change was made, and redo once that change was undone', () => {
      const editor = track(createTestEditor());
      editor.commands.insertContent('some text');
      const first = renderToolbar(editor);

      expect(screen.getByRole('button', { name: 'Undo' })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'Redo' })).toBeDisabled();

      editor.commands.undo();
      // Mount a fresh tree rather than rerendering the same one: the
      // toolbar items are memoized on the `editor` object identity, which
      // does not change when a command mutates its internal state.
      first.unmount();
      renderToolbar(editor);

      expect(screen.getByRole('button', { name: 'Redo' })).toBeEnabled();
    });

    it('calls the editor undo/redo commands when clicked', async () => {
      const editor = track(createTestEditor());
      editor.commands.insertContent('some text');
      const first = renderToolbar(editor);

      // The Undo button is enabled at this first mount (there is something
      // to undo), so the click actually reaches the handler.
      await first.user.click(screen.getByRole('button', { name: 'Undo' }));
      expect(editor.getText()).toBe('');

      // Re-mount so the Redo button's `disabled` attribute reflects the
      // post-undo state: it is not recomputed by the previous render, whose
      // memoized items are unaffected by a command mutating editor state.
      first.unmount();
      const second = renderToolbar(editor);
      await second.user.click(screen.getByRole('button', { name: 'Redo' }));
      expect(editor.getText()).toContain('some text');
    });

    it('crashes when the editor has no history extension, because `disabled` is computed unconditionally', () => {
      // NOTE: this documents an actual quirk of the source rather than an
      // aspirational behavior. `visibility` only controls whether the
      // Toolbar *renders* an item; the item's `props` (including
      // `disabled: !editor?.can().undo()`) are still built eagerly for
      // every item on every render, regardless of that item's visibility.
      // When `history` is absent, tiptap's `can()` proxy has no `undo`/
      // `redo` keys at all (they only exist once the extension registers
      // those commands), so `editor?.can().undo()` throws instead of
      // evaluating to `false`. A real editor without `history` would hit
      // this same crash in production.
      const editor = makeNoHistoryEditor();

      // React (dev mode) and jsdom both log this expected render crash to
      // the console; silence it locally so it doesn't drown out real
      // failures elsewhere, while still asserting the throw itself below.
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      try {
        expect(() => renderToolbar(editor)).toThrow(
          /can\(\.\.\.\)\.undo is not a function/,
        );
      } finally {
        consoleErrorSpy.mockRestore();
      }
    });
  });

  describe('bold / italic / underline', () => {
    it('reflects the active mark via the is-selected class', () => {
      const editor = track(createTestEditor());
      editor.chain().focus().toggleBold().run();
      editor.chain().focus().toggleItalic().run();
      editor.chain().focus().toggleUnderline().run();
      renderToolbar(editor);

      expect(screen.getByRole('button', { name: 'Bold' })).toHaveClass(
        'is-selected',
      );
      expect(screen.getByRole('button', { name: 'Italic' })).toHaveClass(
        'is-selected',
      );
      expect(screen.getByRole('button', { name: 'Underline' })).toHaveClass(
        'is-selected',
      );
    });

    it('does not mark the buttons as selected when the mark is inactive', () => {
      const editor = track(createTestEditor());
      renderToolbar(editor);

      expect(screen.getByRole('button', { name: 'Bold' })).not.toHaveClass(
        'is-selected',
      );
      expect(screen.getByRole('button', { name: 'Italic' })).not.toHaveClass(
        'is-selected',
      );
      expect(screen.getByRole('button', { name: 'Underline' })).not.toHaveClass(
        'is-selected',
      );
    });

    it('toggles bold/italic/underline on click', async () => {
      const editor = track(createTestEditor());
      const { user } = renderToolbar(editor);

      await user.click(screen.getByRole('button', { name: 'Bold' }));
      expect(editor.isActive('bold')).toBe(true);

      await user.click(screen.getByRole('button', { name: 'Italic' }));
      expect(editor.isActive('italic')).toBe(true);

      await user.click(screen.getByRole('button', { name: 'Underline' }));
      expect(editor.isActive('underline')).toBe(true);
    });

    it('disables the bold button while a heading is active', () => {
      const editor = track(createTestEditor({ content: '<h1>Title</h1>' }));
      editor.commands.setTextSelection(1);
      expect(editor.isActive('heading')).toBe(true);
      renderToolbar(editor);

      expect(screen.getByRole('button', { name: 'Bold' })).toBeDisabled();
    });

    it('does not disable the bold button outside of a heading', () => {
      const editor = track(createTestEditor());
      renderToolbar(editor);

      expect(screen.getByRole('button', { name: 'Bold' })).toBeEnabled();
    });

    it('hides underline when the editor has no underline extension, while bold/italic (from StarterKit) still show', () => {
      const editor = makeBareEditor();
      renderToolbar(editor);

      expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Italic' }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Underline' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('media buttons (image / video / audio / attachment)', () => {
    it('are always visible - no visibility gate in source', () => {
      const editor = makeBareEditor();
      renderToolbar(editor);

      expect(
        screen.getByRole('button', { name: 'Add image' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Add video' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Add audio' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Add attachment' }),
      ).toBeInTheDocument();
    });

    it('call mediaLibraryRef.show with the matching type when clicked', async () => {
      const editor = track(createTestEditor());
      const { user, mediaLibraryRef } = renderToolbar(editor);

      await user.click(screen.getByRole('button', { name: 'Add image' }));
      expect(mediaLibraryRef.current?.show).toHaveBeenCalledWith('image');

      await user.click(screen.getByRole('button', { name: 'Add video' }));
      expect(mediaLibraryRef.current?.show).toHaveBeenCalledWith('video');

      await user.click(screen.getByRole('button', { name: 'Add audio' }));
      expect(mediaLibraryRef.current?.show).toHaveBeenCalledWith('audio');

      await user.click(screen.getByRole('button', { name: 'Add attachment' }));
      expect(mediaLibraryRef.current?.show).toHaveBeenCalledWith('attachment');
    });
  });

  describe('linker', () => {
    it('opens the hyperlink tab when the selection is empty', async () => {
      const editor = track(createTestEditor({ content: '<p></p>' }));
      const { user, mediaLibraryRef } = renderToolbar(editor);

      await user.click(screen.getByRole('button', { name: 'Link' }));

      expect(mediaLibraryRef.current?.show).toHaveBeenCalledWith('hyperlink');
      expect(mediaLibraryRef.current?.showLink).not.toHaveBeenCalled();
    });

    it('shows the link tab with the selected text when a single block is selected', async () => {
      const editor = track(createTestEditor({ content: '<p>Hello world</p>' }));
      editor.commands.selectAll();
      const { user, mediaLibraryRef } = renderToolbar(editor);

      await user.click(screen.getByRole('button', { name: 'Link' }));

      expect(mediaLibraryRef.current?.showLink).toHaveBeenCalledWith({
        link: { text: 'Hello world', target: '_blank' },
        multiNodeSelected: false,
      });
    });

    it('flags multiNodeSelected when the selection spans several blocks', async () => {
      const editor = track(
        createTestEditor({
          content: '<p>Hello world</p><p>Second line</p>',
        }),
      );
      editor.commands.selectAll();
      const { user, mediaLibraryRef } = renderToolbar(editor);

      await user.click(screen.getByRole('button', { name: 'Link' }));

      expect(mediaLibraryRef.current?.showLink).toHaveBeenCalledWith({
        link: { text: 'Hello world', target: '_blank' },
        multiNodeSelected: true,
      });
    });
  });

  describe('information pane', () => {
    it('inserts an information-pane node of type "info" when clicked', async () => {
      const editor = track(
        createTestEditor({
          content: '<p></p>',
          extensions: [InformationPane],
        }),
      );
      const { user } = renderToolbar(editor);

      await user.click(
        screen.getByRole('button', { name: 'Information pane' }),
      );

      const json = editor.getJSON();
      const informationPaneNode = json.content?.find(
        (node) => node.type === 'information-pane',
      );
      expect(informationPaneNode).toBeDefined();
      expect(informationPaneNode?.attrs?.type).toBe('info');
    });
  });

  describe('speech to text', () => {
    it('is hidden by default in a jsdom test environment (no SpeechRecognition API)', () => {
      const editor = track(createTestEditor());
      renderToolbar(editor);

      expect(
        screen.queryByRole('button', { name: 'Voice dictation' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('cantoo / speech divider', () => {
    it('hides the cantoo dropdown and the speech divider when unavailable', () => {
      const editor = track(createTestEditor());
      const { container } = renderToolbar(editor, {
        cantooEditor: buildCantooEditor({ isAvailable: false }),
      });

      expect(screen.queryByTestId('mock-cantoo')).not.toBeInTheDocument();
      // Only the 6 unconditional dividers are rendered (div-speech is hidden).
      expect(container.querySelectorAll('.toolbar-divider')).toHaveLength(6);
    });

    it('shows the cantoo dropdown and the speech divider when cantoo is available', () => {
      const editor = track(createTestEditor());
      const { container } = renderToolbar(editor, {
        cantooEditor: buildCantooEditor({ isAvailable: true }),
      });

      expect(screen.getByTestId('mock-cantoo')).toBeInTheDocument();
      expect(container.querySelectorAll('.toolbar-divider')).toHaveLength(7);
    });
  });

  describe('text color / highlight / typography extension gating', () => {
    it('hides color, highlight and font family dropdowns by default (createTestEditor has none of those extensions)', () => {
      const editor = track(createTestEditor());
      renderToolbar(editor);

      expect(screen.queryByTestId('mock-text-color')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('mock-highlight-color'),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('mock-typography')).not.toBeInTheDocument();
    });

    it('shows the text color dropdown once TextStyle + Color are present', () => {
      const editor = track(
        createTestEditor({ extensions: [TextStyle, Color] }),
      );
      renderToolbar(editor);

      expect(screen.getByTestId('mock-text-color')).toBeInTheDocument();
    });

    it('shows the highlight dropdown once CustomHighlight is present', () => {
      const editor = track(createTestEditor({ extensions: [CustomHighlight] }));
      renderToolbar(editor);

      expect(screen.getByTestId('mock-highlight-color')).toBeInTheDocument();
    });

    it('shows the font family (typography) dropdown once FontFamily is present', () => {
      const editor = track(createTestEditor({ extensions: [FontFamily] }));
      renderToolbar(editor);

      expect(screen.getByTestId('mock-typography')).toBeInTheDocument();
    });
  });

  describe('list / alignment / plus menus', () => {
    it('shows the list menu whenever StarterKit is present', () => {
      const editor = makeBareEditor();
      renderToolbar(editor);

      expect(
        screen.getByTestId('mock-dropdown-menu-Lists'),
      ).toBeInTheDocument();
    });

    it('hides alignment and plus when textAlign is absent (StarterKit-only editor)', () => {
      const editor = makeBareEditor();
      renderToolbar(editor);

      expect(
        screen.queryByTestId('mock-dropdown-menu-Alignment'),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('mock-plus-menu')).not.toBeInTheDocument();
    });

    it('shows alignment and plus once textAlign is present (createTestEditor default set)', () => {
      const editor = track(createTestEditor());
      renderToolbar(editor);

      expect(
        screen.getByTestId('mock-dropdown-menu-Alignment'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('mock-plus-menu')).toBeInTheDocument();
    });
  });
});
