import { Editor } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import { render, screen } from '~/setup';
import { createTestEditor } from '../../test-utils/createTestEditor';
import LinkToolbar from './LinkToolbar';

// `@tiptap/react`'s real FloatingMenu relies on tippy.js, whose CJS build
// does not interop cleanly with Vitest's ESM loader in this monorepo (a
// default import of `tippy.js` resolves to the whole CJS module namespace
// instead of the exported function), and it mounts its content by moving DOM
// nodes around via tippy outside of React's control, which fights with
// jsdom in ways unrelated to what LinkToolbar itself is responsible for.
// Since the ticket only calls for exercising LinkToolbar's own logic (the
// `linkAttrs` effect and `handleShouldShow`) - not floating-ui positioning -
// replace FloatingMenu with a minimal component that renders its children
// whenever `shouldShow` returns true, keeping everything in the normal React
// tree.
vi.mock('@tiptap/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tiptap/react')>();
  return {
    ...actual,
    FloatingMenu: ({ editor, shouldShow, children }: any) => {
      const visible = shouldShow
        ? shouldShow({ editor, view: editor?.view, state: editor?.state })
        : true;
      return visible ? children : null;
    },
  };
});

// Inserts a real `linker` node with the given attributes (mirroring what the
// `Linker` extension's own `setLinker` command does internally) and selects
// it with a NodeSelection, since `Linker` is `selectable: true` and its
// `unsetLinker` command reads the currently selected node.
function insertAndSelectLinker(
  editor: Editor,
  attrs: {
    'href': string | null;
    'target': '_blank' | null;
    'title': string | null;
    'data-id': string | null;
    'data-app-prefix': string | null;
  },
) {
  editor.commands.setLinker(attrs);

  let linkerPos: number | undefined;
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'linker' && linkerPos === undefined) {
      linkerPos = pos;
    }
  });

  const tr = editor.state.tr.setSelection(
    NodeSelection.create(editor.state.doc, linkerPos as number),
  );
  editor.view.dispatch(tr);
}

// Inserts plain text and applies the `hyperlink` mark (via the inherited
// `setLink` command) over its full range, leaving the selection on that
// range so `editor.isActive('hyperlink')` is true.
function insertAndSelectHyperlink(editor: Editor, href: string) {
  editor.commands.insertContent('link text');

  let from: number | undefined;
  let to: number | undefined;
  editor.state.doc.descendants((node, pos) => {
    if (node.isText && from === undefined) {
      from = pos;
      to = pos + node.nodeSize;
    }
  });

  editor.commands.setTextSelection({ from: from as number, to: to as number });
  editor.commands.setLink({ href });
}

describe('LinkToolbar', () => {
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
    editor = createTestEditor();
  });

  afterEach(() => {
    editor?.destroy();
  });

  it('renders nothing and does not crash when there is no editor', () => {
    render(
      <LinkToolbar
        editor={null}
        onEdit={vi.fn()}
        onOpen={vi.fn()}
        onUnlink={vi.fn()}
      />,
    );

    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('does not render the toolbar when neither a linker nor a hyperlink is active', () => {
    render(
      <LinkToolbar
        editor={editor}
        onEdit={vi.fn()}
        onOpen={vi.fn()}
        onUnlink={vi.fn()}
      />,
    );

    // Since `handleShouldShow` and the `linkAttrs` effect rely on the same
    // `isActive('linker') || isActive('hyperlink')` checks, whenever the
    // toolbar is hidden `linkAttrs` is necessarily undefined too - there is
    // no reachable state, through this component's public API, where the
    // toolbar is visible while `linkAttrs` is undefined. So clicking a
    // button with `linkAttrs === undefined` is not independently testable.
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('does not render the toolbar when the editor is not editable, even with a linker active', () => {
    insertAndSelectLinker(editor, {
      'href': '/blog#/view/blog-id/post-id',
      'target': null,
      'title': 'My post',
      'data-id': 'post-id',
      'data-app-prefix': 'blog',
    });
    editor.setEditable(false);

    render(
      <LinkToolbar
        editor={editor}
        onEdit={vi.fn()}
        onOpen={vi.fn()}
        onUnlink={vi.fn()}
      />,
    );

    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('shows the toolbar with the linker node attrs when a linker is selected', async () => {
    insertAndSelectLinker(editor, {
      'href': '/blog#/view/blog-id/post-id',
      'target': '_blank',
      'title': 'My post',
      'data-id': 'post-id',
      'data-app-prefix': 'blog',
    });

    const onEdit = vi.fn();
    const onOpen = vi.fn();
    const onUnlink = vi.fn();

    const { user } = render(
      <LinkToolbar
        editor={editor}
        onEdit={onEdit}
        onOpen={onOpen}
        onUnlink={onUnlink}
      />,
    );

    expect(screen.getByRole('toolbar')).toBeInTheDocument();

    const expectedAttrs = expect.objectContaining({
      'href': '/blog#/view/blog-id/post-id',
      'target': '_blank',
      'title': 'My post',
      'data-id': 'post-id',
      'data-app-prefix': 'blog',
    });

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onEdit).toHaveBeenCalledWith(expectedAttrs);

    await user.click(screen.getByRole('button', { name: 'Open in new tab' }));
    expect(onOpen).toHaveBeenCalledWith(expectedAttrs);

    await user.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onUnlink).toHaveBeenCalledWith(expectedAttrs);
  });

  it('shows the toolbar with the hyperlink mark attrs when a hyperlink is selected', async () => {
    insertAndSelectHyperlink(editor, 'https://example.com');

    const onEdit = vi.fn();
    const onOpen = vi.fn();
    const onUnlink = vi.fn();

    const { user } = render(
      <LinkToolbar
        editor={editor}
        onEdit={onEdit}
        onOpen={onOpen}
        onUnlink={onUnlink}
      />,
    );

    expect(screen.getByRole('toolbar')).toBeInTheDocument();

    const expectedAttrs = expect.objectContaining({
      href: 'https://example.com',
    });

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onEdit).toHaveBeenCalledWith(expectedAttrs);

    await user.click(screen.getByRole('button', { name: 'Open in new tab' }));
    expect(onOpen).toHaveBeenCalledWith(expectedAttrs);

    await user.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onUnlink).toHaveBeenCalledWith(expectedAttrs);
  });
});
