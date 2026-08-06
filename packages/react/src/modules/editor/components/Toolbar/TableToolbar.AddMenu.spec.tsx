import { Editor } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';
import { render, screen } from '~/setup';
import { Dropdown } from '../../../../components';
import { createTestEditor } from '../../test-utils/createTestEditor';
import { TableToolbarAddMenu } from './TableToolbar.AddMenu';

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
      <TableToolbarAddMenu editor={editor} />
    </Dropdown>,
  );
}

function getTrigger() {
  return screen.getByRole('button', { name: 'Add' });
}

describe('TableToolbarAddMenu', () => {
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
      'Line above',
      'Line below',
      'Column left',
      'Column right',
      'Header first line',
      'Header first column',
    ];
    labels.forEach((label) => {
      expect(screen.getByRole('menuitem', { name: label })).toBeInTheDocument();
    });
    expect(screen.getAllByRole('menuitem')).toHaveLength(labels.length);
  });

  it('adds a row above on "Line above"', async () => {
    const { user } = renderMenu(editor);
    await user.click(getTrigger());

    await user.click(screen.getByRole('menuitem', { name: 'Line above' }));

    expect(cellTypesGrid(editor)).toHaveLength(3);
  });

  it('adds a row below on "Line below"', async () => {
    const { user } = renderMenu(editor);
    await user.click(getTrigger());

    await user.click(screen.getByRole('menuitem', { name: 'Line below' }));

    expect(cellTypesGrid(editor)).toHaveLength(3);
  });

  it('adds a column to the left on "Column left"', async () => {
    const { user } = renderMenu(editor);
    await user.click(getTrigger());

    await user.click(screen.getByRole('menuitem', { name: 'Column left' }));

    expect(cellTypesGrid(editor)[0]).toHaveLength(3);
  });

  it('adds a column to the right on "Column right"', async () => {
    const { user } = renderMenu(editor);
    await user.click(getTrigger());

    await user.click(screen.getByRole('menuitem', { name: 'Column right' }));

    expect(cellTypesGrid(editor)[0]).toHaveLength(3);
  });

  it('turns the first row into header cells on "Header first line"', async () => {
    const { user } = renderMenu(editor);
    await user.click(getTrigger());

    await user.click(
      screen.getByRole('menuitem', { name: 'Header first line' }),
    );

    const grid = cellTypesGrid(editor);
    expect(grid[0]).toEqual(['tableHeader', 'tableHeader']);
    expect(grid[1]).toEqual(['tableCell', 'tableCell']);
  });

  it('turns the first column into header cells on "Header first column"', async () => {
    const { user } = renderMenu(editor);
    await user.click(getTrigger());

    await user.click(
      screen.getByRole('menuitem', { name: 'Header first column' }),
    );

    const grid = cellTypesGrid(editor);
    expect(grid[0][0]).toBe('tableHeader');
    expect(grid[1][0]).toBe('tableHeader');
    expect(grid[0][1]).toBe('tableCell');
    expect(grid[1][1]).toBe('tableCell');
  });
});
