import { CustomHeading } from '@edifice.io/tiptap-extensions/heading';
import { FontSize } from '@edifice.io/tiptap-extensions/font-size';
import { Editor } from '@tiptap/core';
import TextStyle from '@tiptap/extension-text-style';

import { render, screen } from '~/setup';
import { Dropdown } from '../../../../components';
import { EditorContext } from '../../hooks/useEditorContext';
import { createTestEditor } from '../../test-utils/createTestEditor';
import { EditorToolbarTextSize } from './EditorToolbar.TextSize';

// The component needs the `customHeading` and `fontSize` extensions (and the
// `textStyle` mark the latter relies on) to show its heading/size options,
// none of which are part of createTestEditor's default set.
function buildEditor(extensions: any[] = []) {
  return createTestEditor({ content: '<p>Hello</p>', extensions });
}

const fullExtensions = [
  TextStyle,
  FontSize,
  CustomHeading.configure({ levels: [1, 2] }),
];

function renderTextSize(editor: Editor | null) {
  return render(
    <EditorContext.Provider
      value={{ id: 'toolbar', appCode: 'blog', editor, editable: true }}
    >
      <Dropdown>
        {(triggerProps: any) => (
          <EditorToolbarTextSize triggerProps={triggerProps} />
        )}
      </Dropdown>
    </EditorContext.Provider>,
  );
}

function getTrigger() {
  return screen.getByRole('button', { name: 'Text size' });
}

describe('EditorToolbarTextSize', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
  });

  it('shows every option and the divider when both extensions are present', async () => {
    editor = buildEditor(fullExtensions);
    const { user } = renderTextSize(editor);

    await user.click(getTrigger());

    ['Heading 1', 'Heading 2', 'Big text', 'Normal text', 'Small text'].forEach(
      (label) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      },
    );
    // Both the wrapping div (explicit role) and the `<hr>` it contains
    // (implicit native role) match "separator", hence getAllByRole here.
    expect(screen.getAllByRole('separator').length).toBeGreaterThan(0);
  });

  it('hides the heading options and the divider when customHeading is absent', async () => {
    editor = buildEditor([TextStyle, FontSize]);
    const { user } = renderTextSize(editor);

    await user.click(getTrigger());

    expect(screen.queryByText('Heading 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Heading 2')).not.toBeInTheDocument();
    expect(screen.queryAllByRole('separator')).toHaveLength(0);
    expect(screen.getByText('Big text')).toBeInTheDocument();
  });

  it('hides the size options and the divider when fontSize is absent', async () => {
    editor = buildEditor([CustomHeading.configure({ levels: [1, 2] })]);
    const { user } = renderTextSize(editor);

    await user.click(getTrigger());

    expect(screen.getByText('Heading 1')).toBeInTheDocument();
    expect(screen.queryByText('Big text')).not.toBeInTheDocument();
    expect(screen.queryByText('Normal text')).not.toBeInTheDocument();
    expect(screen.queryByText('Small text')).not.toBeInTheDocument();
    expect(screen.queryAllByRole('separator')).toHaveLength(0);
  });

  it('clicking "Heading 1" turns the current block into a level-1 heading', async () => {
    editor = buildEditor(fullExtensions);
    const { user } = renderTextSize(editor);

    await user.click(getTrigger());
    await user.click(screen.getByText('Heading 1'));

    // `setCustomHeading` delegates to the plain `setHeading` command (shared
    // with StarterKit's own heading extension), so the resulting node type
    // is "heading", not "customHeading".
    expect(editor.isActive('heading', { level: 1 })).toBe(true);
  });

  it('clicking "Heading 2" turns the current block into a level-2 heading', async () => {
    editor = buildEditor(fullExtensions);
    const { user } = renderTextSize(editor);

    await user.click(getTrigger());
    await user.click(screen.getByText('Heading 2'));

    expect(editor.isActive('heading', { level: 2 })).toBe(true);
  });

  it('clicking "Big text" sets the paragraph fontSize to 18px', async () => {
    editor = buildEditor(fullExtensions);
    const { user } = renderTextSize(editor);

    await user.click(getTrigger());
    await user.click(screen.getByText('Big text'));

    expect(editor.isActive('paragraph')).toBe(true);
    expect(editor.getAttributes('textStyle').fontSize).toBe('18px');
  });

  it('clicking "Normal text" sets the paragraph fontSize to 16px', async () => {
    editor = buildEditor(fullExtensions);
    const { user } = renderTextSize(editor);

    await user.click(getTrigger());
    await user.click(screen.getByText('Normal text'));

    expect(editor.isActive('paragraph')).toBe(true);
    expect(editor.getAttributes('textStyle').fontSize).toBe('16px');
  });

  it('clicking "Small text" sets the paragraph fontSize to 14px', async () => {
    editor = buildEditor(fullExtensions);
    const { user } = renderTextSize(editor);

    await user.click(getTrigger());
    await user.click(screen.getByText('Small text'));

    expect(editor.isActive('paragraph')).toBe(true);
    expect(editor.getAttributes('textStyle').fontSize).toBe('14px');
  });

  it('reverts a heading to a plain sized paragraph when picking a text size afterwards', async () => {
    editor = buildEditor(fullExtensions);
    const { user } = renderTextSize(editor);

    await user.click(getTrigger());
    await user.click(screen.getByText('Heading 1'));
    expect(editor.isActive('heading', { level: 1 })).toBe(true);

    await user.click(getTrigger());
    await user.click(screen.getByText('Big text'));

    expect(editor.isActive('heading')).toBe(false);
    expect(editor.isActive('paragraph')).toBe(true);
    expect(editor.getAttributes('textStyle').fontSize).toBe('18px');
  });

  it('does not mark the trigger as selected on a fresh editor', () => {
    editor = buildEditor(fullExtensions);

    renderTextSize(editor);

    expect(getTrigger()).not.toHaveClass('is-selected');
  });

  it('marks the trigger as selected once "Heading 1" is applied', async () => {
    editor = buildEditor(fullExtensions);
    const { user } = renderTextSize(editor);

    await user.click(getTrigger());
    await user.click(screen.getByText('Heading 1'));

    expect(getTrigger()).toHaveClass('is-selected');
  });

  it('marks the trigger as selected once "Big text" is applied', async () => {
    editor = buildEditor(fullExtensions);
    const { user } = renderTextSize(editor);

    await user.click(getTrigger());
    await user.click(screen.getByText('Big text'));

    expect(getTrigger()).toHaveClass('is-selected');
  });

  it('does not mark the trigger as selected once "Normal text" is applied', async () => {
    editor = buildEditor(fullExtensions);
    const { user } = renderTextSize(editor);

    await user.click(getTrigger());
    await user.click(screen.getByText('Big text'));
    expect(getTrigger()).toHaveClass('is-selected');

    await user.click(getTrigger());
    await user.click(screen.getByText('Normal text'));

    expect(getTrigger()).not.toHaveClass('is-selected');
  });

  it('renders no options and does not throw when the editor is null', async () => {
    const { user } = renderTextSize(null);

    await user.click(getTrigger());

    expect(screen.queryAllByRole('menuitem')).toHaveLength(0);
    expect(screen.queryAllByRole('separator')).toHaveLength(0);
  });
});
