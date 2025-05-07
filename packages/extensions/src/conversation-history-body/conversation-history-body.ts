/**
 * A Tiptap Node extension that represents a conversation history body.
 * This node is a block-level element that can contain one or more block elements.
 *
 * @remarks
 * The node is rendered as a div element with the class 'conversation-history-body'.
 * It can parse HTML elements that match the same structure.
 *
 * @group Block Nodes
 */
import { mergeAttributes, Node } from '@tiptap/core';

export const ConversationHistoryBody = Node.create({
  name: 'converstationHistoryBody',
  group: 'block',
  content: 'block+',

  parseHTML() {
    return [
      {
        tag: 'div.conversation-history-body',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { class: 'conversation-history-body' }),
      0,
    ];
  },
});
