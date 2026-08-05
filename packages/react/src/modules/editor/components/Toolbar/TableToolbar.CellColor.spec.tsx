import { Editor } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';
import { render, screen } from '~/setup';
import { Dropdown } from '../../../../components';
import { createTestEditor } from '../../test-utils/createTestEditor';
import { TableToolbarCellColor } from './TableToolbar.CellColor';

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

// Builds a 2x2 table (no header row) and puts the cursor in its first cell.
function insertTableAndFocusFirstCell(editor: Editor) {
  editor.chain().insertTable({ rows: 2, cols: 2, withHeaderRow: false }).run();
  moveSelectionTo(editor, nthCellPos(editor, 0) + 1);
}

// The trigger's ColorPickerItem swatch, when the current color isn't "reset".
function getSwatch() {
  return document.querySelector('.color-picker-hue-color-item');
}

function getTrigger() {
  return screen.getByRole('button', { name: 'Background color' });
}

describe('TableToolbarCellColor', () => {
  let editor: Editor;
  let itemRefs: { current: Record<string, any> };

  beforeEach(() => {
    editor = createTestEditor();
    insertTableAndFocusFirstCell(editor);
    itemRefs = { current: {} };
  });

  afterEach(() => {
    editor.destroy();
  });

  function renderCellColor() {
    return render(
      <Dropdown>
        <TableToolbarCellColor editor={editor} itemRefs={itemRefs} />
      </Dropdown>,
    );
  }

  it('defaults to transparent (reset swatch) when the cell has no background color', () => {
    renderCellColor();

    expect(getTrigger()).toBeInTheDocument();
    expect(getSwatch()).toBeNull();
  });

  it('initializes the swatch from the current cell backgroundColor attribute', () => {
    editor.chain().focus().setCellAttribute('backgroundColor', '#005A8A').run();

    renderCellColor();

    expect(getSwatch()).toHaveStyle({ backgroundColor: 'rgb(0, 90, 138)' });
  });

  it('opens the menu and shows the palette label, reset option and swatches', async () => {
    const { user } = renderCellColor();

    await user.click(getTrigger());

    expect(screen.getByText('Cell color')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'None' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'color.blue.darkest' }),
    ).toBeInTheDocument();
  });

  it('registers the ColorPicker element on itemRefs once the menu opens', async () => {
    const { user } = renderCellColor();

    expect(itemRefs.current['color-picker']).toBeUndefined();

    await user.click(getTrigger());

    expect(itemRefs.current['color-picker']).toBeInstanceOf(HTMLElement);
  });

  it('applies the chosen color to the cell via setCellAttribute', async () => {
    const { user } = renderCellColor();
    await user.click(getTrigger());

    await user.click(
      screen.getByRole('button', { name: 'color.blue.darkest' }),
    );

    expect(editor.getAttributes('tableCell').backgroundColor).toBe('#005A8A');
  });

  it('clears the cell backgroundColor when choosing the reset (transparent) option', async () => {
    editor.chain().focus().setCellAttribute('backgroundColor', '#005A8A').run();
    const { user } = renderCellColor();
    await user.click(getTrigger());

    await user.click(screen.getByRole('button', { name: 'None' }));

    expect(editor.getAttributes('tableCell').backgroundColor).toBe('');
  });

  it('re-syncs the displayed color when the selection moves to a different cell', () => {
    editor.chain().focus().setCellAttribute('backgroundColor', '#005A8A').run();

    const { rerender } = renderCellColor();
    expect(getSwatch()).toHaveStyle({ backgroundColor: 'rgb(0, 90, 138)' });

    moveSelectionTo(editor, nthCellPos(editor, 1) + 1);
    editor.chain().focus().setCellAttribute('backgroundColor', '#9E0016').run();

    // Force a re-render so the component's effect observes the new
    // `editor.state` and recomputes `color` from `getAttributes`.
    rerender(
      <Dropdown>
        <TableToolbarCellColor editor={editor} itemRefs={itemRefs} />
      </Dropdown>,
    );

    expect(getSwatch()).toHaveStyle({ backgroundColor: 'rgb(158, 0, 22)' });
  });
});
