import { Editor } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';
import { render, screen } from '~/setup';
import { Dropdown } from '../../../../components';
import { createTestEditor } from '../../test-utils/createTestEditor';
import { TableToolbarDelMenu } from './TableToolbar.DelMenu';

// Moves the text selection to the given document position.
function moveSelectionTo(editor: Editor, pos: number) {
  const tr = editor.state.tr.setSelection(
    TextSelection.near(editor.state.doc.resolve(pos)),
  );
  editor.view.dispatch(tr);
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

// Returns the type name (tableCell/tableHeader) of every cell, as a
// [row][col] grid, to observe the effect of row/column commands.
function cellTypesGrid(editor: Editor): string[][] {
  const grid: string[][] = [];
  editor.state.doc.descendants((node) => {
    if (node.type.name === 'tableRow') {
      const row: string[] = [];
      node.forEach((cell) => row.push(cell.type.name));
      grid.push(row);
      return false;
    }
    return true;
  });
  return grid;
}

// Builds a 2x2 table (no header row) and puts the cursor in its first cell.
function insertTableAndFocusFirstCell(editor: Editor) {
  editor.chain().insertTable({ rows: 2, cols: 2, withHeaderRow: false }).run();
  moveSelectionTo(editor, nthCellPos(editor, 0) + 1);
}

function renderMenu(editor: Editor | null) {
  return render(
    <Dropdown>
      <TableToolbarDelMenu editor={editor} />
    </Dropdown>,
  );
}

function getTrigger() {
  return screen.getByRole('button', { name: 'Delete' });
}

describe('TableToolbarDelMenu', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = createTestEditor();
    insertTableAndFocusFirstCell(editor);
  });

  afterEach(() => {
    editor.destroy();
  });

  it('keeps the menu closed until the trigger is clicked', () => {
    renderMenu(editor);

    expect(getTrigger()).toBeInTheDocument();
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  it('shows every item with its translated label once opened', async () => {
    const { user } = renderMenu(editor);

    await user.click(getTrigger());

    const labels = [
      'Delete line',
      'Delete column',
      'Delete header line',
      'Delete header column',
      'Delete table',
    ];
    labels.forEach((label) => {
      expect(screen.getByRole('menuitem', { name: label })).toBeInTheDocument();
    });
    expect(screen.getAllByRole('menuitem')).toHaveLength(labels.length);
  });

  it('deletes the current row on "Delete line"', async () => {
    const { user } = renderMenu(editor);
    await user.click(getTrigger());

    await user.click(screen.getByRole('menuitem', { name: 'Delete line' }));

    expect(cellTypesGrid(editor)).toHaveLength(1);
  });

  it('deletes the current column on "Delete column"', async () => {
    const { user } = renderMenu(editor);
    await user.click(getTrigger());

    await user.click(screen.getByRole('menuitem', { name: 'Delete column' }));

    expect(cellTypesGrid(editor)[0]).toHaveLength(1);
  });

  it('turns the first row into header cells on "Delete header line"', async () => {
    // Despite its label, this item runs the same `toggleHeaderRow` command
    // as the Add menu's "Header first line" - it is exercised here as-is.
    const { user } = renderMenu(editor);
    await user.click(getTrigger());

    await user.click(
      screen.getByRole('menuitem', { name: 'Delete header line' }),
    );

    const grid = cellTypesGrid(editor);
    expect(grid[0]).toEqual(['tableHeader', 'tableHeader']);
    expect(grid[1]).toEqual(['tableCell', 'tableCell']);
  });

  it('turns the first column into header cells on "Delete header column"', async () => {
    // Despite its label, this item runs the same `toggleHeaderColumn`
    // command as the Add menu's "Header first column".
    const { user } = renderMenu(editor);
    await user.click(getTrigger());

    await user.click(
      screen.getByRole('menuitem', { name: 'Delete header column' }),
    );

    const grid = cellTypesGrid(editor);
    expect(grid[0][0]).toBe('tableHeader');
    expect(grid[1][0]).toBe('tableHeader');
    expect(grid[0][1]).toBe('tableCell');
    expect(grid[1][1]).toBe('tableCell');
  });

  it('deletes the whole table on "Delete table"', async () => {
    const { user } = renderMenu(editor);
    await user.click(getTrigger());

    await user.click(screen.getByRole('menuitem', { name: 'Delete table' }));

    expect(editor.isActive('table')).toBe(false);
  });
});
