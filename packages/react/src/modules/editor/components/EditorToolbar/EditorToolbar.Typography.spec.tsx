import { Editor } from '@tiptap/core';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';
import { TextSelection } from '@tiptap/pm/state';

import { act, render, screen } from '~/setup';
import { Dropdown } from '../../../../components';
import { EditorContext } from '../../hooks/useEditorContext';
import { createTestEditor } from '../../test-utils/createTestEditor';
import { EditorToolbarTypography } from './EditorToolbar.Typography';

// The component reads/writes the `fontFamily` attribute of the `textStyle`
// mark, and the trigger's "selected" state (as coded) actually checks the
// `color` attribute instead - see the dedicated test below. Neither
// `textStyle`, `fontFamily` nor `color` are part of createTestEditor's
// default extension set.
function buildEditor(content = '<p>Hello</p>') {
  return createTestEditor({
    content,
    extensions: [TextStyle, FontFamily, Color],
  });
}

function renderTypography(editor: Editor | null) {
  return render(
    <EditorContext.Provider
      value={{ id: 'toolbar', appCode: 'blog', editor, editable: true }}
    >
      <Dropdown>
        {(triggerProps: any) => (
          <EditorToolbarTypography triggerProps={triggerProps} />
        )}
      </Dropdown>
    </EditorContext.Provider>,
  );
}

function getTrigger() {
  return screen.getByRole('button', { name: 'Font' });
}

// Returns the doc position of the start of the given text node (so
// `[pos, pos + text.length]` is exactly that word's range).
function posInText(editor: Editor, text: string) {
  let pos: number | undefined;
  editor.state.doc.descendants((node, nodePos) => {
    if (node.isText && node.text === text) {
      pos = nodePos;
    }
  });
  return pos as number;
}

// Moves the text selection to the given position, wrapped in `act` so the
// resulting transaction-driven re-render is flushed before the next
// assertion, like a real user click would be.
function moveSelectionTo(editor: Editor, pos: number) {
  act(() => {
    const tr = editor.state.tr.setSelection(
      TextSelection.near(editor.state.doc.resolve(pos)),
    );
    editor.view.dispatch(tr);
  });
}

describe('EditorToolbarTypography', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
  });

  it('renders all 5 typography options, Sans-serif checked by default', async () => {
    editor = buildEditor();
    const { user } = renderTypography(editor);

    await user.click(getTrigger());

    const labels = [
      'Sans-serif',
      'Serif',
      'Monoscript',
      'Marelle',
      'OpenDyslexic',
    ];
    labels.forEach((label) => {
      expect(
        screen.getByRole('menuitemradio', { name: label }),
      ).toBeInTheDocument();
    });
    expect(screen.getAllByRole('menuitemradio')).toHaveLength(labels.length);

    expect(
      screen.getByRole('menuitemradio', { name: 'Sans-serif' }),
    ).toHaveAttribute('aria-checked', 'true');
    expect(
      screen.getByRole('menuitemradio', { name: 'Serif' }),
    ).toHaveAttribute('aria-checked', 'false');
  });

  it('sets the fontFamily to Lora when clicking "Serif"', async () => {
    editor = buildEditor();
    editor.commands.selectAll();
    const { user } = renderTypography(editor);

    await user.click(getTrigger());
    await user.click(screen.getByRole('menuitemradio', { name: 'Serif' }));

    expect(editor.getAttributes('textStyle').fontFamily).toBe('Lora');
  });

  it('sets the fontFamily to IBM Plex Mono when clicking "Monoscript"', async () => {
    editor = buildEditor();
    editor.commands.selectAll();
    const { user } = renderTypography(editor);

    await user.click(getTrigger());
    await user.click(screen.getByRole('menuitemradio', { name: 'Monoscript' }));

    expect(editor.getAttributes('textStyle').fontFamily).toBe('IBM Plex Mono');
  });

  it('unsets the fontFamily when clicking "Sans-serif" after a custom font was applied', async () => {
    editor = buildEditor();
    editor.commands.selectAll();
    // The radio item does not close the dropdown on click (unlike an action
    // item), so both clicks can happen against the same open menu.
    const { user } = renderTypography(editor);

    await user.click(getTrigger());
    await user.click(screen.getByRole('menuitemradio', { name: 'Marelle' }));
    expect(editor.getAttributes('textStyle').fontFamily).toBe('Marelle');

    await user.click(screen.getByRole('menuitemradio', { name: 'Sans-serif' }));

    expect(editor.getAttributes('textStyle').fontFamily).toBeFalsy();
  });

  it('checks the option matching the fontFamily already active on mount', async () => {
    editor = buildEditor();
    editor.commands.selectAll();
    editor.chain().setFontFamily('OpenDyslexic').run();

    const { user } = renderTypography(editor);
    await user.click(getTrigger());

    expect(
      screen.getByRole('menuitemradio', { name: 'OpenDyslexic' }),
    ).toHaveAttribute('aria-checked', 'true');
    expect(
      screen.getByRole('menuitemradio', { name: 'Sans-serif' }),
    ).toHaveAttribute('aria-checked', 'false');
  });

  it('does not mark the trigger as selected from a fontFamily change alone', async () => {
    // As written, the trigger's "selected" class is driven by an active
    // `color` matching a hex pattern, not by the fontFamily - this looks
    // like a copy/paste artifact from EditorToolbar.TextColor, but we test
    // the component as it actually behaves rather than as intended.
    editor = buildEditor();
    editor.commands.selectAll();
    const { user } = renderTypography(editor);

    await user.click(getTrigger());
    await user.click(screen.getByRole('menuitemradio', { name: 'Serif' }));

    expect(getTrigger()).not.toHaveClass('selected');
  });

  it('marks the trigger as selected once a hex color is active, regardless of fontFamily', () => {
    editor = buildEditor();
    editor.commands.selectAll();
    editor.chain().setColor('#4A4A4A').run();

    renderTypography(editor);

    expect(getTrigger()).toHaveClass('selected');
  });

  it('checks the right option on a pure selection move, with no content change and no manual re-render', async () => {
    editor = buildEditor('<p>Lora</p><p>Default</p>');
    const loraPos = posInText(editor, 'Lora');
    const defaultPos = posInText(editor, 'Default');

    editor.commands.setTextSelection({ from: loraPos, to: loraPos + 4 });
    editor.chain().setFontFamily('Lora').run();
    // Selection starts in the plain paragraph, before the dropdown even
    // opens - no re-render from clicking the trigger should be needed later.
    moveSelectionTo(editor, defaultPos + 2);

    const { user } = renderTypography(editor);
    // Open the dropdown once and leave it open: clicking the trigger again
    // would itself cause a re-render, masking the bug this test guards
    // against (the component never updating on a pure selection move alone).
    await user.click(getTrigger());
    expect(
      screen.getByRole('menuitemradio', { name: 'Sans-serif' }),
    ).toHaveAttribute('aria-checked', 'true');

    // Moving into the "Lora" text - no content edit, dropdown stays open, no
    // manual re-render - must check Serif instead.
    moveSelectionTo(editor, loraPos + 2);
    expect(
      screen.getByRole('menuitemradio', { name: 'Serif' }),
    ).toHaveAttribute('aria-checked', 'true');
  });

  it('still renders all options and does not throw when the editor is null', async () => {
    const { user } = renderTypography(null);

    await user.click(getTrigger());

    expect(screen.getAllByRole('menuitemradio')).toHaveLength(5);
    await user.click(screen.getByRole('menuitemradio', { name: 'Serif' }));

    expect(getTrigger()).toBeInTheDocument();
  });
});
