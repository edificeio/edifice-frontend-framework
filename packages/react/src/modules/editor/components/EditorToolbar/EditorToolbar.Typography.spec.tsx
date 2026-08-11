import { Editor } from '@tiptap/core';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';

import { render, screen } from '~/setup';
import { Dropdown } from '../../../../components';
import { EditorContext } from '../../hooks/useEditorContext';
import { createTestEditor } from '../../test-utils/createTestEditor';
import { EditorToolbarTypography } from './EditorToolbar.Typography';

// The component reads/writes the `fontFamily` attribute of the `textStyle`
// mark. Neither `textStyle`, `fontFamily` nor `color` are part of
// createTestEditor's default extension set.
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
      'Cursive',
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
    await user.click(screen.getByRole('menuitemradio', { name: 'Cursive' }));
    expect(editor.getAttributes('textStyle').fontFamily).toBe('Ecriture A');

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

  it('marks the trigger as selected once a custom fontFamily is applied', async () => {
    editor = buildEditor();
    editor.commands.selectAll();
    const { user } = renderTypography(editor);

    await user.click(getTrigger());
    await user.click(screen.getByRole('menuitemradio', { name: 'Serif' }));

    expect(getTrigger()).toHaveClass('selected');
  });

  it('does not mark the trigger as selected from an active color alone', () => {
    editor = buildEditor();
    editor.commands.selectAll();
    editor.chain().setColor('#4A4A4A').run();

    renderTypography(editor);

    expect(getTrigger()).not.toHaveClass('selected');
  });

  it('still renders all options and does not throw when the editor is null', async () => {
    const { user } = renderTypography(null);

    await user.click(getTrigger());

    expect(screen.getAllByRole('menuitemradio')).toHaveLength(5);
    await user.click(screen.getByRole('menuitemradio', { name: 'Serif' }));

    expect(getTrigger()).toBeInTheDocument();
  });
});
