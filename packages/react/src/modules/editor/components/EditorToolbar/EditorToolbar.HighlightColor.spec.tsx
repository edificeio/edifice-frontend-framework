import { CustomHighlight } from '@edifice.io/tiptap-extensions/highlight';
import { Editor } from '@tiptap/react';

import { render, screen } from '~/setup';
import { Dropdown } from '../../../../components';
import { EditorContext } from '../../hooks/useEditorContext';
import { createTestEditor } from '../../test-utils/createTestEditor';
import { EditorToolbarHighlightColor } from './EditorToolbar.HighlightColor';

function renderHighlightColor(editor: Editor | null) {
  return render(
    <EditorContext.Provider
      value={{
        id: 'x',
        appCode: 'blog',
        editor: editor as any,
        editable: true,
      }}
    >
      <Dropdown>
        {(triggerProps: any, itemRefs: any) => (
          <EditorToolbarHighlightColor
            triggerProps={triggerProps}
            itemRefs={itemRefs}
          />
        )}
      </Dropdown>
    </EditorContext.Provider>,
  );
}

// Selects the whole text content of the (single) paragraph, so mark
// commands like `setHighlight`/`unsetHighlight` have a real range to apply
// to instead of just setting stored marks for future keystrokes.
function selectAll(editor: Editor) {
  editor.commands.setTextSelection({
    from: 1,
    to: editor.state.doc.content.size - 1,
  });
}

describe('EditorToolbarHighlightColor', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
  });

  it('renders a trigger button with the translated "Highlight color" label', () => {
    editor = createTestEditor({ extensions: [CustomHighlight] });
    renderHighlightColor(editor);

    expect(
      screen.getByRole('button', { name: 'Highlight color' }),
    ).toBeInTheDocument();
  });

  it('does not mark the trigger as selected when there is no active highlight', () => {
    editor = createTestEditor({
      extensions: [CustomHighlight],
      content: '<p>Hello</p>',
    });
    renderHighlightColor(editor);

    expect(
      screen.getByRole('button', { name: 'Highlight color' }),
    ).not.toHaveClass('is-selected');
  });

  it('marks the trigger as selected when the selection carries a hex-colored highlight', () => {
    editor = createTestEditor({
      extensions: [CustomHighlight],
      content: '<p>Hello</p>',
    });
    selectAll(editor);
    editor.chain().setHighlight({ color: '#005A8A' }).run();

    renderHighlightColor(editor);

    expect(screen.getByRole('button', { name: 'Highlight color' })).toHaveClass(
      'is-selected',
    );
  });

  it('does not throw when there is no editor', async () => {
    const { user } = renderHighlightColor(null);

    await user.click(screen.getByRole('button', { name: 'Highlight color' }));

    await expect(
      user.click(screen.getByRole('button', { name: 'color.blue.darkest' })),
    ).resolves.not.toThrow();
  });

  it('applies the picked color as a highlight on the current selection', async () => {
    editor = createTestEditor({
      extensions: [CustomHighlight],
      content: '<p>Hello</p>',
    });
    selectAll(editor);
    const { user } = renderHighlightColor(editor);

    await user.click(screen.getByRole('button', { name: 'Highlight color' }));
    await user.click(
      screen.getByRole('button', { name: 'color.blue.darkest' }),
    );

    expect(editor.getAttributes('customHighlight').color).toBe('#005A8A');
  });

  it('removes the highlight when clicking the already-active color (toggle off)', async () => {
    editor = createTestEditor({
      extensions: [CustomHighlight],
      content: '<p>Hello</p>',
    });
    selectAll(editor);
    // Pre-apply the highlight the trigger will be initialized with, so the
    // component's local `color` state is synced to it on mount.
    editor.chain().setHighlight({ color: '#005A8A' }).run();
    const { user } = renderHighlightColor(editor);

    await user.click(screen.getByRole('button', { name: 'Highlight color' }));
    await user.click(
      screen.getByRole('button', { name: 'color.blue.darkest' }),
    );

    expect(editor.isActive('customHighlight')).toBe(false);
  });
});
