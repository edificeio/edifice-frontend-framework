import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { afterEach, describe, expect, it } from 'vitest';
import { ConversationHistory } from './conversation-history';

describe('ConversationHistory', () => {
  let editor: Editor | undefined;

  afterEach(() => {
    editor?.destroy();
  });

  it('groups everything after a horizontal rule into a conversation-history node', () => {
    editor = new Editor({
      extensions: [StarterKit, ConversationHistory],
      content: '<p>Before</p><hr><p>After 1</p><p>After 2</p>',
    });
    // The grouping plugin runs on appendTransaction, which the initial content doesn't
    // go through — only a dispatched transaction does. useTipTapEditor.ts's own
    // setContent() effect after mount is what triggers this for real, so we mirror that
    // here instead of asserting on an editor state no real user ever actually sees.
    editor.view.dispatch(editor.state.tr);

    const json = editor.getJSON();
    const history = json.content?.find(
      (node) => node.type === 'converstationHistory',
    );

    expect(history?.content).toHaveLength(2);
  });

  it('parses an already-stored conversation-history div back as the same node', () => {
    editor = new Editor({
      extensions: [StarterKit, ConversationHistory],
      content: '<div class="conversation-history"><p>Reply</p></div>',
    });

    expect(editor.getJSON().content?.[0].type).toBe('converstationHistory');
  });
});
