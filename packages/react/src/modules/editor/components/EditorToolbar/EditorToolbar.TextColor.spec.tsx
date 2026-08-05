import { Editor } from '@tiptap/core';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';

import { render, screen } from '~/setup';
import { Dropdown } from '../../../../components';
import { EditorContext } from '../../hooks/useEditorContext';
import { createTestEditor } from '../../test-utils/createTestEditor';
import { EditorToolbarTextColor } from './EditorToolbar.TextColor';

// The component reads/writes the `color` attribute of the `textStyle` mark,
// which is not part of createTestEditor's default extension set: add it
// explicitly here rather than touching the shared helper.
function buildEditor(content = '<p>Hello</p>') {
  return createTestEditor({ content, extensions: [TextStyle, Color] });
}

// Renders EditorToolbarTextColor the same way EditorToolbar.tsx does: as the
// function-children of a real Dropdown, so it receives genuine
// `triggerProps`/`itemRefs` and its `Dropdown.Menu` only shows once opened.
function renderTextColor(editor: Editor | null) {
  return render(
    <EditorContext.Provider
      value={{ id: 'toolbar', appCode: 'blog', editor, editable: true }}
    >
      <Dropdown>
        {(triggerProps: any, itemRefs: any) => (
          <EditorToolbarTextColor
            triggerProps={triggerProps}
            itemRefs={itemRefs}
          />
        )}
      </Dropdown>
    </EditorContext.Provider>,
  );
}

function getTrigger() {
  return screen.getByRole('button', { name: 'Text color' });
}

describe('EditorToolbarTextColor', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
  });

  it('renders both palettes with their labels and swatches once opened', async () => {
    editor = buildEditor();
    const { user } = renderTextColor(editor);

    await user.click(getTrigger());

    // Default palette label is passed pre-translated by the component itself.
    expect(screen.getAllByText('Text color').length).toBeGreaterThan(0);
    // Accessible palette, with its info hint.
    expect(screen.getByText('Accessible palette')).toBeInTheDocument();

    // A sample swatch from each palette (descriptions are untranslated keys).
    expect(
      screen.getByRole('button', { name: 'color.gray.darkest' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'color.blue' }),
    ).toBeInTheDocument();
  });

  it('applies the clicked color to the textStyle mark of the selection', async () => {
    editor = buildEditor();
    editor.commands.selectAll();
    const { user } = renderTextColor(editor);

    await user.click(getTrigger());
    await user.click(screen.getByRole('button', { name: 'color.blue.dark' }));

    expect(editor.getAttributes('textStyle').color).toBe('#2F7EA7');
  });

  it('toggles the color off when clicking the already-applied swatch again', async () => {
    editor = buildEditor();
    editor.commands.selectAll();
    const { user } = renderTextColor(editor);

    await user.click(getTrigger());
    await user.click(screen.getByRole('button', { name: 'color.blue.dark' }));
    expect(editor.getAttributes('textStyle').color).toBe('#2F7EA7');

    // ColorPicker's swatches are plain buttons, not `Dropdown.Item`s, so
    // picking one does not close the menu: click the same swatch again
    // directly.
    await user.click(screen.getByRole('button', { name: 'color.blue.dark' }));

    expect(editor.getAttributes('textStyle').color).toBeFalsy();
  });

  it('marks the trigger as selected once a hex color is active on mount', () => {
    editor = buildEditor();
    editor.commands.selectAll();
    editor.chain().setColor('#005A8A').run();

    renderTextColor(editor);

    expect(getTrigger()).toHaveClass('selected');
  });

  it('does not mark the trigger as selected when no color is active', () => {
    editor = buildEditor();

    renderTextColor(editor);

    expect(getTrigger()).not.toHaveClass('selected');
  });

  it('does not throw when the editor is null', async () => {
    const { user } = renderTextColor(null);

    await user.click(getTrigger());

    expect(
      await screen.findByRole('button', { name: 'color.gray.darkest' }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'color.gray.darkest' }),
    );
    // No editor to reflect the change onto, but nothing should have thrown.
    expect(getTrigger()).toBeInTheDocument();
  });
});
