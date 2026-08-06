import { createRef, forwardRef } from 'react';

import { act, render, screen } from '~/setup';
import Editor, { EditorProps, EditorRef } from './Editor';

// The real `useTipTapEditor` (kept real, see below) unconditionally includes
// the SpeechRecognition extension, which warns on `onCreate` when the
// browser doesn't expose the SpeechRecognition API - true of jsdom. Stub it
// at module scope (this file's jsdom environment is torn down when the file
// finishes, so there's nothing to restore) so the check genuinely passes
// instead of silencing its warning.
(globalThis as { SpeechRecognition?: unknown }).SpeechRecognition = class {};

// Editor.tsx composes a large number of already independently-tested
// subsystems (see hooks/*.spec.* and components/**/*.spec.* in this module).
// This spec focuses on Editor.tsx's OWN branch logic: mode/toolbar/variant
// props, the imperative ref API, and the conditional rendering of its many
// children. Heavy children are stubbed out; see the mocking strategy in each
// `vi.mock` block below for what stays real and why.

const {
  mockUseCantooEditor,
  mockUseImageModal,
  mockUseMathsModal,
  mockUseSpeechSynthetisis,
} = vi.hoisted(() => ({
  mockUseCantooEditor: vi.fn(),
  mockUseImageModal: vi.fn(),
  mockUseMathsModal: vi.fn(),
  mockUseSpeechSynthetisis: vi.fn(),
}));

// `useMediaLibraryEditor`, `useLinkToolbar` and `useTipTapEditor` are kept
// REAL: they are straightforward, don't touch unavailable browser APIs, and
// using the real `useTipTapEditor` gives a genuine tiptap `Editor` instance
// so the imperative `getContent()` API can be exercised meaningfully.
//
// `useCantooEditor`, `useImageModal` and `useMathsModal` are mocked so their
// `isOpen` / `openPositionAdaptText` state can be driven directly, instead of
// exercising each hook's own (already covered) internal flow.
//
// `useSpeechSynthetisis` is also mocked: its real implementation calls
// `window.speechSynthesis` / `SpeechSynthesisUtterance`, which don't exist in
// jsdom, and `odeServices.data().trackSpeechAndText`.
//
// `EditorToolbar`, `LinkToolbar`, `TableToolbar` and `BubbleMenuEditImage`
// are stubbed to simple, recognizable placeholders (each already has its own
// dedicated spec) so this file only exercises Editor.tsx's own wiring.
vi.mock('../..', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../..')>();
  return {
    ...actual,
    EditorToolbar: (props: {
      mediaLibraryRef?: unknown;
      toggleMathsModal?: () => void;
      cantooEditor?: unknown;
    }) => (
      <div
        data-testid="mock-editor-toolbar"
        data-has-media-library-ref={String(!!props.mediaLibraryRef)}
        data-has-toggle-maths-modal={String(
          typeof props.toggleMathsModal === 'function',
        )}
        data-has-cantoo-editor={String(!!props.cantooEditor)}
      />
    ),
    LinkToolbar: (props: { editor?: unknown }) => (
      <div
        data-testid="mock-link-toolbar"
        data-has-editor={String(!!props.editor)}
      />
    ),
    TableToolbar: (props: { editor?: unknown }) => (
      <div
        data-testid="mock-table-toolbar"
        data-has-editor={String(!!props.editor)}
      />
    ),
    BubbleMenuEditImage: (props: {
      editable?: boolean;
      openEditImage?: boolean;
    }) => (
      <div
        data-testid="mock-bubble-menu-edit-image"
        data-editable={String(props.editable)}
        data-open-edit-image={String(props.openEditImage)}
      />
    ),
    useCantooEditor: (...args: unknown[]) => mockUseCantooEditor(...args),
    useImageModal: (...args: unknown[]) => mockUseImageModal(...args),
    useMathsModal: (...args: unknown[]) => mockUseMathsModal(...args),
    useSpeechSynthetisis: (...args: unknown[]) =>
      mockUseSpeechSynthetisis(...args),
  };
});

// BubbleMenuEditInformationPane is imported directly (not via the barrel
// above), it already has its own dedicated spec.
vi.mock('../BubbleMenuEditInformationPane', () => ({
  BubbleMenuEditInformationPane: (props: { editable?: boolean }) => (
    <div
      data-testid="mock-bubble-menu-edit-information-pane"
      data-editable={String(props.editable)}
    />
  ),
}));

// MediaLibrary has its own dedicated spec and deep dependencies of its own;
// stub it out, forwarding the ref like ResourceModal.spec.tsx does, so this
// spec only exercises Editor.tsx's own branch logic.
vi.mock('../../../multimedia', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../multimedia')>();
  return {
    ...actual,
    MediaLibrary: forwardRef(
      (
        props: {
          appCode?: string;
          visibility?: string;
          multiple?: boolean;
        },
        ref,
      ) => (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          data-testid="mock-media-library"
          data-app-code={props.appCode}
          data-visibility={props.visibility}
          data-multiple={String(props.multiple)}
        />
      ),
    ),
  };
});

// MathsModal and ImageEditor are lazy-loaded (dynamic import()) inside
// Editor.tsx; mock the modules they come from so the Suspense boundary
// resolves to a simple, recognizable placeholder.
vi.mock('../MathsModal/MathsModal', () => ({
  default: (props: { isOpen?: boolean }) => (
    <div data-testid="mock-maths-modal" data-is-open={String(props.isOpen)} />
  ),
}));

vi.mock('../../../multimedia/ImageEditor/components/ImageEditor', () => ({
  default: (props: { isOpen?: boolean; image?: string }) => (
    <div
      data-testid="mock-image-editor"
      data-is-open={String(props.isOpen)}
      data-image={props.image}
    />
  ),
}));

const baseCantooEditor = {
  cantooParam: 'none',
  isAvailable: false,
  speech2textIsAvailable: false,
  speech2textIsActive: false,
  text2speechIsActive: false,
  toggleSpeech2Text: vi.fn(),
  toggleText2Speech: vi.fn(),
  toogleSettings: vi.fn(),
  openPositionAdaptText: { right: false, bottom: false },
  handleCantooAdaptTextPosition: vi.fn(),
};

const baseImageModal = {
  isOpen: false,
  currentImage: undefined,
  toggle: vi.fn(),
  handleCancel: vi.fn(),
  handleEdit: vi.fn(),
  handleSave: vi.fn(),
};

const baseMathsModal = {
  toggle: vi.fn(),
  isOpen: false,
  onCancel: vi.fn(),
  onSuccess: vi.fn(),
};

const baseSpeechSynthetisis = {
  isActivated: false,
  toggle: vi.fn(),
};

const renderEditor = (
  props: Partial<EditorProps> = {},
  ref?: React.Ref<EditorRef>,
) => {
  const content = props.content ?? '<p>Hello world</p>';
  return render(<Editor ref={ref} content={content} {...props} />);
};

describe('Editor', () => {
  // jsdom does not implement a few DOM APIs that the REAL tiptap/prosemirror
  // editor touches when moving focus/selection (Element.scrollIntoView) or
  // measuring selection coordinates (Range.getClientRects /
  // Range.getBoundingClientRect). These are exercised on every mount because
  // `focus` defaults to `'start'` in `useTipTapEditor`'s mount effect, and
  // explicitly by the `setFocus` imperative API test below. Stub them
  // locally to this spec (restored afterAll) rather than touching the
  // shared vitest setup.
  let scrollIntoViewSpy: ReturnType<typeof vi.fn>;
  const originalGetClientRects = Range.prototype.getClientRects;
  const originalGetBoundingClientRect = Range.prototype.getBoundingClientRect;

  beforeAll(() => {
    scrollIntoViewSpy = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewSpy;
    Range.prototype.getClientRects = () =>
      ({ length: 0, item: () => null }) as unknown as DOMRectList;
    Range.prototype.getBoundingClientRect = () =>
      ({
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON() {
          return {};
        },
      }) as DOMRect;
  });

  afterAll(() => {
    Range.prototype.getClientRects = originalGetClientRects;
    Range.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  beforeEach(() => {
    mockUseCantooEditor.mockReturnValue({ ...baseCantooEditor });
    mockUseImageModal.mockReturnValue({ ...baseImageModal });
    mockUseMathsModal.mockReturnValue({ ...baseMathsModal });
    mockUseSpeechSynthetisis.mockReturnValue({ ...baseSpeechSynthetisis });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('mode / toolbar gating', () => {
    it('defaults to read mode: not editable, and hides the toolbar even though toolbar="full" by default', () => {
      renderEditor();

      expect(
        screen.queryByTestId('mock-editor-toolbar'),
      ).not.toBeInTheDocument();
    });

    it('edit mode renders the toolbar by default (toolbar="full")', () => {
      renderEditor({ mode: 'edit' });

      expect(screen.getByTestId('mock-editor-toolbar')).toBeInTheDocument();
    });

    it('edit mode with toolbar="none" still hides the toolbar', () => {
      renderEditor({ mode: 'edit', toolbar: 'none' });

      expect(
        screen.queryByTestId('mock-editor-toolbar'),
      ).not.toBeInTheDocument();
    });

    it('read mode with toolbar="none" hides the toolbar (redundant with the default, still gated correctly)', () => {
      renderEditor({ mode: 'read', toolbar: 'none' });

      expect(
        screen.queryByTestId('mock-editor-toolbar'),
      ).not.toBeInTheDocument();
    });

    it('renders MediaLibrary only when editable', () => {
      renderEditor({ mode: 'read' });
      expect(
        screen.queryByTestId('mock-media-library'),
      ).not.toBeInTheDocument();
    });

    it('renders MediaLibrary in edit mode', async () => {
      renderEditor({ mode: 'edit' });
      expect(
        await screen.findByTestId('mock-media-library'),
      ).toBeInTheDocument();
    });

    it('passes editable through to BubbleMenuEditImage/BubbleMenuEditInformationPane in read mode', () => {
      renderEditor({ mode: 'read' });

      expect(screen.getByTestId('mock-bubble-menu-edit-image')).toHaveAttribute(
        'data-editable',
        'false',
      );
      expect(
        screen.getByTestId('mock-bubble-menu-edit-information-pane'),
      ).toHaveAttribute('data-editable', 'false');
    });

    it('passes editable through to BubbleMenuEditImage/BubbleMenuEditInformationPane in edit mode', () => {
      renderEditor({ mode: 'edit' });

      expect(screen.getByTestId('mock-bubble-menu-edit-image')).toHaveAttribute(
        'data-editable',
        'true',
      );
      expect(
        screen.getByTestId('mock-bubble-menu-edit-information-pane'),
      ).toHaveAttribute('data-editable', 'true');
    });

    it('always renders LinkToolbar and TableToolbar with the editor instance, regardless of mode', () => {
      renderEditor({ mode: 'read' });

      expect(screen.getByTestId('mock-link-toolbar')).toHaveAttribute(
        'data-has-editor',
        'true',
      );
      expect(screen.getByTestId('mock-table-toolbar')).toHaveAttribute(
        'data-has-editor',
        'true',
      );
    });
  });

  describe('variant styling', () => {
    it('applies border/content classes for the outline variant (default)', () => {
      const { container } = renderEditor({ variant: 'outline' });

      expect(container.firstElementChild).toHaveClass('border', 'rounded-3');
      expect(screen.getByTestId('editor-content')).toHaveClass(
        'py-12',
        'px-16',
      );
    });

    it('applies no border/content classes for the ghost variant', () => {
      const { container } = renderEditor({ variant: 'ghost' });

      expect(container.firstElementChild).not.toHaveClass('border');
      expect(container.firstElementChild).not.toHaveClass('rounded-3');
      expect(screen.getByTestId('editor-content')).not.toHaveClass('py-12');
      expect(screen.getByTestId('editor-content')).not.toHaveClass('px-16');
    });
  });

  describe('imperative ref API', () => {
    it('getContent("html") returns editor.getHTML()', () => {
      const ref = createRef<EditorRef>();
      renderEditor({ content: '<p>Hello world</p>' }, ref);

      expect(ref.current?.getContent('html')).toContain('Hello world');
    });

    it('getContent("json") returns editor.getJSON()', () => {
      const ref = createRef<EditorRef>();
      renderEditor({ content: '<p>Hello world</p>' }, ref);

      const json = ref.current?.getContent('json');
      expect(json).toMatchObject({ type: 'doc' });
    });

    it('getContent("plain") returns editor.getText()', () => {
      const ref = createRef<EditorRef>();
      renderEditor({ content: '<p>Hello world</p>' }, ref);

      expect(ref.current?.getContent('plain')).toBe('Hello world');
    });

    it('getContent throws for an unknown format', () => {
      const ref = createRef<EditorRef>();
      renderEditor({ content: '<p>Hello world</p>' }, ref);

      expect(() =>
        ref.current?.getContent('unknown' as unknown as 'html'),
      ).toThrow();
    });

    it('setFocus delegates to editor.commands.focus, calling native focus() on the editor DOM node', () => {
      // tiptap's `focus` command calls `view.dom.focus()` synchronously (the
      // rest of its work, e.g. scrollIntoView, is deferred to a rAF). Rather
      // than asserting on `document.activeElement` — whose update depends on
      // jsdom's own focus-tracking, which is not fully reliable for
      // contenteditable nodes in this environment — spy on the native
      // `focus()` method to verify it was invoked on the editor's DOM node.
      const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
      const ref = createRef<EditorRef>();
      const { container } = renderEditor(
        {
          mode: 'edit',
          content: '<p>Hello world</p>',
          focus: false,
        },
        ref,
      );
      focusSpy.mockClear();

      act(() => {
        ref.current?.setFocus('end');
      });

      const proseMirror = container.querySelector('.ProseMirror');
      expect(focusSpy).toHaveBeenCalled();
      expect(focusSpy.mock.instances).toContain(proseMirror);

      focusSpy.mockRestore();
    });

    it('isSpeeching reflects the (mocked) speech synthetisis activated state', () => {
      mockUseSpeechSynthetisis.mockReturnValue({
        isActivated: true,
        toggle: vi.fn(),
      });
      const ref = createRef<EditorRef>();
      renderEditor({}, ref);

      expect(ref.current?.isSpeeching()).toBe(true);
    });

    it('toogleSpeechSynthetisis delegates to the (mocked) speech synthetisis toggle handler', () => {
      const toggle = vi.fn(() => true);
      mockUseSpeechSynthetisis.mockReturnValue({
        isActivated: false,
        toggle,
      });
      const ref = createRef<EditorRef>();
      renderEditor({}, ref);

      const result = ref.current?.toogleSpeechSynthetisis();

      expect(toggle).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });
  });

  describe('Cantoo adapt-text box (openPositionAdaptText)', () => {
    it('renders nothing when neither right nor bottom is open', () => {
      renderEditor({ mode: 'edit', variant: 'ghost' });

      expect(document.querySelectorAll('.py-12.px-16')).toHaveLength(0);
    });

    it('renders the "right" adapt-text box when openPositionAdaptText.right is true', () => {
      mockUseCantooEditor.mockReturnValue({
        ...baseCantooEditor,
        openPositionAdaptText: { right: true, bottom: false },
      });

      renderEditor({ mode: 'edit', variant: 'ghost' });

      // No .card class on the "right" placement.
      const boxes = document.querySelectorAll('.py-12.px-16');
      expect(boxes).toHaveLength(1);
      expect(boxes[0]).not.toHaveClass('card');
    });

    it('renders the "bottom" adapt-text box (with the card class) when openPositionAdaptText.bottom is true', () => {
      mockUseCantooEditor.mockReturnValue({
        ...baseCantooEditor,
        openPositionAdaptText: { right: false, bottom: true },
      });

      renderEditor({ mode: 'edit', variant: 'ghost' });

      expect(document.querySelector('.card.py-12.px-16')).toBeInTheDocument();
    });

    it('does not render the adapt-text box in read mode even when openPositionAdaptText is set (gated on editable)', () => {
      mockUseCantooEditor.mockReturnValue({
        ...baseCantooEditor,
        openPositionAdaptText: { right: true, bottom: false },
      });

      renderEditor({ mode: 'read', variant: 'ghost' });

      expect(document.querySelectorAll('.py-12.px-16')).toHaveLength(0);
    });
  });

  describe('MathsModal (lazy, mocked useMathsModal)', () => {
    it('does not render when not open', () => {
      renderEditor({ mode: 'edit' });

      expect(screen.queryByTestId('mock-maths-modal')).not.toBeInTheDocument();
    });

    it('renders when editable and mathsModalHandlers.isOpen is true', async () => {
      mockUseMathsModal.mockReturnValue({ ...baseMathsModal, isOpen: true });

      renderEditor({ mode: 'edit' });

      expect(await screen.findByTestId('mock-maths-modal')).toHaveAttribute(
        'data-is-open',
        'true',
      );
    });

    it('does not render in read mode even if isOpen is true (gated on editable)', () => {
      mockUseMathsModal.mockReturnValue({ ...baseMathsModal, isOpen: true });

      renderEditor({ mode: 'read' });

      expect(screen.queryByTestId('mock-maths-modal')).not.toBeInTheDocument();
    });
  });

  describe('ImageEditor (lazy, mocked useImageModal)', () => {
    it('does not render when not open', () => {
      renderEditor({ mode: 'edit' });

      expect(screen.queryByTestId('mock-image-editor')).not.toBeInTheDocument();
    });

    it('renders when editable, isOpen and currentImage are set', async () => {
      mockUseImageModal.mockReturnValue({
        ...baseImageModal,
        isOpen: true,
        currentImage: { src: 'img.png', alt: 'alt text', title: 'a title' },
      });

      renderEditor({ mode: 'edit' });

      expect(await screen.findByTestId('mock-image-editor')).toHaveAttribute(
        'data-image',
        'img.png',
      );
    });

    it('does not render when isOpen is true but currentImage is undefined', () => {
      mockUseImageModal.mockReturnValue({
        ...baseImageModal,
        isOpen: true,
        currentImage: undefined,
      });

      renderEditor({ mode: 'edit' });

      expect(screen.queryByTestId('mock-image-editor')).not.toBeInTheDocument();
    });

    it('does not render in read mode even if isOpen and currentImage are set (gated on editable)', () => {
      mockUseImageModal.mockReturnValue({
        ...baseImageModal,
        isOpen: true,
        currentImage: { src: 'img.png' },
      });

      renderEditor({ mode: 'read' });

      expect(screen.queryByTestId('mock-image-editor')).not.toBeInTheDocument();
    });
  });
});
