import { Editor } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';
import type { FloatingMenuProps } from '@tiptap/react/menus';
import { act, render, screen } from '~/setup';
import { createTestEditor } from '../../test-utils/createTestEditor';
import TableToolbar from './TableToolbar';

// Captured from the mocked FloatingMenu below, to check what TableToolbar
// actually passes it (see the dedicated test further down).
let capturedOptions: FloatingMenuProps['options'];
let capturedStyle: FloatingMenuProps['style'];

// `@tiptap/react`'s real FloatingMenu relies on tippy.js, whose CJS build
// does not interop cleanly with Vitest's ESM loader in this monorepo (a
// default import of `tippy.js` resolves to the whole CJS module namespace
// instead of the exported function), and it mounts its content by moving
// DOM nodes around via tippy outside of React's control, which fights with
// jsdom in ways unrelated to what TableToolbar itself is responsible for.
// Since the ticket only calls for exercising TableToolbar's own logic
// (`isSpan` and `handleShouldShow`) - not floating-ui positioning - replace
// FloatingMenu with a minimal component that renders its children whenever
// `shouldShow` returns true, keeping everything in the normal React tree.
// v3 moved Floating/BubbleMenu out of `@tiptap/react` into `@tiptap/react/menus`
// (see TableToolbar.tsx's own import) - mock that subpath instead.
vi.mock('@tiptap/react/menus', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tiptap/react/menus')>();
  return {
    ...actual,
    FloatingMenu: ({ editor, shouldShow, children, options, style }: any) => {
      capturedOptions = options;
      capturedStyle = style;
      const visible = shouldShow
        ? shouldShow({ editor, view: editor?.view, state: editor?.state })
        : true;
      return visible ? children : null;
    },
  };
});

// Moves the text selection to the given position. Wrapped in `act` so the
// resulting transaction-driven re-render (see useEditorState) is flushed
// before the next assertion, like a real user interaction would be.
function moveSelectionTo(editor: Editor, pos: number) {
  act(() => {
    const tr = editor.state.tr.setSelection(
      TextSelection.near(editor.state.doc.resolve(pos)),
    );
    editor.view.dispatch(tr);
  });
}

// Returns the doc position of the nth table cell/header node (0-indexed).
function nthCellPos(editor: Editor, index: number) {
  const positions: number[] = [];
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
      positions.push(pos);
    }
  });
  return positions[index];
}

function insertTable(editor: Editor) {
  editor.chain().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run();
}

describe('TableToolbar', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = createTestEditor();
  });

  afterEach(() => {
    editor?.destroy();
  });

  it('does not render the toolbar when there is no table', () => {
    render(<TableToolbar editor={editor} />);

    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('renders nothing and does not crash when there is no editor', () => {
    render(<TableToolbar editor={null} />);

    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('does not render the toolbar when the editor is not editable', () => {
    insertTable(editor);
    moveSelectionTo(editor, nthCellPos(editor, 0) + 1);
    editor.setEditable(false);

    render(<TableToolbar editor={editor} />);

    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('renders the toolbar when the selection is inside a table', () => {
    insertTable(editor);
    moveSelectionTo(editor, nthCellPos(editor, 0) + 1);

    render(<TableToolbar editor={editor} />);

    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('configures a real offset middleware and a z-index, not a dead middleware array', () => {
    insertTable(editor);
    moveSelectionTo(editor, nthCellPos(editor, 0) + 1);

    render(<TableToolbar editor={editor} />);

    // tiptap only reads a named `offset` field to build its middleware array -
    // `middleware: [offset(...)]` is silently ignored (not this key).
    expect(capturedOptions).toMatchObject({
      offset: { mainAxis: 0, crossAxis: 0 },
    });
    expect(capturedOptions).not.toHaveProperty('middleware');
    // v3's `options` has no `zIndex` field - must be set via `style` instead.
    expect(capturedStyle).toMatchObject({ zIndex: 999 });
  });

  it('shows the merge icon on a plain (non-merged) cell', () => {
    insertTable(editor);
    moveSelectionTo(editor, nthCellPos(editor, 0) + 1);

    render(<TableToolbar editor={editor} />);

    expect(screen.getByRole('button', { name: 'Merge' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Split' }),
    ).not.toBeInTheDocument();
  });

  it('shows the split icon once the selected cell is merged (colspan > 1)', () => {
    insertTable(editor);

    const anchorCell = nthCellPos(editor, 0);
    const headCell = nthCellPos(editor, 1);
    (editor.commands as any).setCellSelection({ anchorCell, headCell });
    editor.chain().mergeCells().run();
    moveSelectionTo(editor, anchorCell + 1);

    const { rerender } = render(<TableToolbar editor={editor} />);
    // Force the component to re-render so its effect observes the new
    // editor.state and recomputes `isSpan`.
    rerender(<TableToolbar editor={editor} />);

    expect(screen.getByRole('button', { name: 'Split' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Merge' }),
    ).not.toBeInTheDocument();
  });

  it('updates merge/split on a pure selection move, with no content change and no manual re-render', () => {
    insertTable(editor);

    (editor.commands as any).setCellSelection({
      anchorCell: nthCellPos(editor, 0),
      headCell: nthCellPos(editor, 1),
    });
    editor.chain().mergeCells().run();
    // Positions shift after the merge - look them up on the post-merge doc.
    const mergedCellPos = nthCellPos(editor, 0);
    const plainCellPos = nthCellPos(editor, 1);

    render(<TableToolbar editor={editor} />);

    // Selection starts on the merged cell: Split is shown.
    moveSelectionTo(editor, mergedCellPos + 1);
    expect(screen.getByRole('button', { name: 'Split' })).toBeInTheDocument();

    // Moving the cursor into a plain cell - no content edit, no re-render
    // triggered from outside - must flip the button back to Merge.
    moveSelectionTo(editor, plainCellPos + 1);
    expect(screen.getByRole('button', { name: 'Merge' })).toBeInTheDocument();
  });

  it('calls mergeOrSplit when clicking the merge/split button', async () => {
    insertTable(editor);
    const anchorCell = nthCellPos(editor, 0);
    // Select two cells so that `mergeOrSplit` has something to merge: with
    // a plain text-cursor selection it would be a no-op.
    (editor.commands as any).setCellSelection({
      anchorCell,
      headCell: nthCellPos(editor, 1),
    });

    const { user } = render(<TableToolbar editor={editor} />);

    await user.click(screen.getByRole('button', { name: 'Merge' }));

    // `editor.commands` is a Proxy that builds a fresh command function on
    // every property access, so spying on it never observes calls made via
    // `.chain()`. Assert the real, observable effect instead: the two cells
    // are now a single header spanning both columns.
    moveSelectionTo(editor, anchorCell + 1);
    expect(editor.getAttributes('tableHeader').colspan).toBe(2);
  });
});
