import { Editor } from '@tiptap/react';

import { render, screen } from '~/setup';
import { Dropdown } from '../../../../components';
import { EditorContext } from '../../hooks/useEditorContext';
import { createTestEditor } from '../../test-utils/createTestEditor';
import { EditorToolbarEmoji } from './EditorToolbar.Emoji';

// `emoji-picker-react` renders a full emoji grid backed by its own bundled
// data set, which is unrelated to what `EditorToolbarEmoji` itself is
// responsible for (wiring `onEmojiClick` to the editor). Replace it with a
// minimal stub exposing a single clickable "emoji" so the tests can focus on
// that wiring instead of the third-party picker's internals.
vi.mock('emoji-picker-react', () => ({
  __esModule: true,
  default: ({ onEmojiClick }: any) => (
    <button onClick={() => onEmojiClick({ emoji: '😀' })}>Pick emoji</button>
  ),
  Categories: {
    SUGGESTED: 'suggested',
    SMILEYS_PEOPLE: 'smileys_people',
    ANIMALS_NATURE: 'animals_nature',
    FOOD_DRINK: 'food_drink',
    TRAVEL_PLACES: 'travel_places',
    ACTIVITIES: 'activities',
    OBJECTS: 'objects',
    SYMBOLS: 'symbols',
    FLAGS: 'flags',
  },
}));

function renderEmoji(editor: Editor | null) {
  // Captured so tests can assert on the ref the Dropdown itself owns, the
  // same object `EditorToolbarEmoji` is given in production.
  const itemRefsHolder: { current: any } = { current: null };

  const result = render(
    <EditorContext.Provider
      value={{
        id: 'x',
        appCode: 'blog',
        editor: editor as any,
        editable: true,
      }}
    >
      <Dropdown>
        {(triggerProps: any, itemRefs: any) => {
          itemRefsHolder.current = itemRefs;
          return (
            <EditorToolbarEmoji
              triggerProps={triggerProps}
              itemRefs={itemRefs}
            />
          );
        }}
      </Dropdown>
    </EditorContext.Provider>,
  );

  return { ...result, itemRefs: itemRefsHolder };
}

describe('EditorToolbarEmoji', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
  });

  it('renders a trigger button with the translated "Emojis" label', () => {
    editor = createTestEditor();
    renderEmoji(editor);

    expect(screen.getByRole('button', { name: 'Emojis' })).toBeInTheDocument();
  });

  it('does not show the picker before the trigger is clicked', () => {
    editor = createTestEditor();
    renderEmoji(editor);

    expect(screen.queryByText('Pick emoji')).not.toBeInTheDocument();
  });

  it('inserts the clicked emoji at the current selection', async () => {
    editor = createTestEditor({ content: '<p>Hello</p>' });
    editor.commands.setTextSelection(editor.state.doc.content.size - 1);
    const { user } = renderEmoji(editor);

    await user.click(screen.getByRole('button', { name: 'Emojis' }));
    await user.click(screen.getByText('Pick emoji'));

    expect(editor.getText()).toBe('Hello😀');
  });

  it('tracks the picker wrapper element via itemRefs', async () => {
    editor = createTestEditor();
    const { user, itemRefs } = renderEmoji(editor);

    await user.click(screen.getByRole('button', { name: 'Emojis' }));

    expect(itemRefs.current.current['emoji-picker']).toBeInstanceOf(
      HTMLDivElement,
    );
  });

  it('does not throw when there is no editor', async () => {
    const { user } = renderEmoji(null);

    await user.click(screen.getByRole('button', { name: 'Emojis' }));

    await expect(
      user.click(screen.getByText('Pick emoji')),
    ).resolves.not.toThrow();
  });
});
