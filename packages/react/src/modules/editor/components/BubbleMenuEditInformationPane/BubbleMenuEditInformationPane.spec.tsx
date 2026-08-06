import { Editor } from '@tiptap/core';
import { InformationPane } from '@edifice.io/tiptap-extensions/information-pane';
import { render, screen } from '~/setup';
import { createTestEditor } from '../../test-utils/createTestEditor';
import BubbleMenuEditInformationPane from './BubbleMenuEditInformationPane';

// `@tiptap/react`'s real BubbleMenu depends on tippy.js, whose CJS build does
// not interop cleanly with Vitest's ESM loader in this monorepo (a default
// import of `tippy.js` resolves to the whole CJS module namespace instead of
// the exported function), and it relocates its content via direct DOM
// manipulation outside of React, unrelated to what
// BubbleMenuEditInformationPane itself is responsible for. Replace BubbleMenu
// with a minimal component that always renders its own wrapper and shows its
// children only when `shouldShow` returns true, keeping everything in the
// normal React tree so RTL can query it.
vi.mock('@tiptap/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tiptap/react')>();
  return {
    ...actual,
    BubbleMenu: ({ editor, shouldShow, children, className }: any) => {
      const visible = shouldShow
        ? shouldShow({ editor, view: editor?.view, state: editor?.state })
        : true;
      return <div className={className}>{visible ? children : null}</div>;
    },
  };
});

// Inserts a real `information-pane` node (with a `paragraph` child, as built
// by the extension's `setInformationPane` command) and places the selection
// inside that inner paragraph. `information-pane` is a top-level `block`
// node, so a selection resolved inside its paragraph child sits at depth 2,
// making `selection.$from.node(1)` (what BubbleMenuEditInformationPane reads)
// resolve to the information-pane node itself, exactly as it would for a real
// cursor placed inside the pane's content.
function insertAndSelectInformationPane(editor: Editor, type: string) {
  editor.commands.setInformationPane(type);

  let panePos: number | undefined;
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'information-pane' && panePos === undefined) {
      panePos = pos;
    }
  });

  // `panePos + 1` enters the information-pane node, `+ 1` again enters its
  // paragraph child, landing the cursor inside the paragraph's content.
  editor.commands.setTextSelection((panePos as number) + 2);
}

// Reads back the `information-pane` node's attrs directly from the document.
function getInformationPaneAttrs(editor: Editor) {
  let attrs: Record<string, unknown> | undefined;
  editor.state.doc.descendants((node) => {
    if (node.type.name === 'information-pane' && attrs === undefined) {
      attrs = node.attrs;
    }
  });
  return attrs;
}

describe('BubbleMenuEditInformationPane', () => {
  let editor: Editor;

  beforeAll(() => {
    // Toolbar unconditionally calls useBreakpoint, which relies on
    // window.matchMedia, absent from jsdom.
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

  beforeEach(() => {
    editor = createTestEditor({ extensions: [InformationPane] });
  });

  afterEach(() => {
    editor?.destroy();
  });

  it('does not render when the selection is not inside an information pane', () => {
    render(<BubbleMenuEditInformationPane editor={editor} editable={true} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not render the Toolbar items when not editable', () => {
    insertAndSelectInformationPane(editor, 'info');

    render(<BubbleMenuEditInformationPane editor={editor} editable={false} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('marks the info button as selected and leaves the others unselected', () => {
    insertAndSelectInformationPane(editor, 'info');

    render(<BubbleMenuEditInformationPane editor={editor} editable={true} />);

    expect(
      screen.getByRole('button', { name: 'Information pane' }),
    ).toHaveClass('is-selected');
    expect(
      screen.getByRole('button', { name: 'Success pane' }),
    ).not.toHaveClass('is-selected');
    expect(
      screen.getByRole('button', { name: 'Warning pane' }),
    ).not.toHaveClass('is-selected');
    expect(
      screen.getByRole('button', { name: 'Question pane' }),
    ).not.toHaveClass('is-selected');
  });

  it('marks the warning button as selected when the pane type is warning', () => {
    insertAndSelectInformationPane(editor, 'warning');

    render(<BubbleMenuEditInformationPane editor={editor} editable={true} />);

    expect(screen.getByRole('button', { name: 'Warning pane' })).toHaveClass(
      'is-selected',
    );
    expect(
      screen.getByRole('button', { name: 'Information pane' }),
    ).not.toHaveClass('is-selected');
  });

  it('updates the information-pane type to success when clicking the success button', async () => {
    insertAndSelectInformationPane(editor, 'info');

    const { user } = render(
      <BubbleMenuEditInformationPane editor={editor} editable={true} />,
    );

    await user.click(screen.getByRole('button', { name: 'Success pane' }));

    expect(getInformationPaneAttrs(editor)).toMatchObject({
      type: 'success',
    });
  });

  it('updates the information-pane type to warning when clicking the warning button', async () => {
    insertAndSelectInformationPane(editor, 'info');

    const { user } = render(
      <BubbleMenuEditInformationPane editor={editor} editable={true} />,
    );

    await user.click(screen.getByRole('button', { name: 'Warning pane' }));

    expect(getInformationPaneAttrs(editor)).toMatchObject({
      type: 'warning',
    });
  });

  it('removes the information-pane node when clicking delete', async () => {
    insertAndSelectInformationPane(editor, 'info');
    expect(editor.isActive('information-pane')).toBe(true);

    const { user } = render(
      <BubbleMenuEditInformationPane editor={editor} editable={true} />,
    );

    // Toolbar's 'button' case overrides the item's aria-label with its
    // `name` field, so the accessible name is the literal item name
    // ('delete'), not the translated tooltip text used for icon buttons.
    await user.click(screen.getByRole('button', { name: 'delete' }));

    expect(editor.isActive('information-pane')).toBe(false);
    expect(getInformationPaneAttrs(editor)).toBeUndefined();
  });
});
