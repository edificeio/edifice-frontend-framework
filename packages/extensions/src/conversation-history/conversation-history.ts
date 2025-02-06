import { mergeAttributes, Node } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';

/**
 * The `ConversationHistory` node is a custom ProseMirror node that represents a block-level
 * container for conversation history. It is implemented using the `@tiptap/core` library.
 *
 * @name ConversationHistory
 * @group block
 * @content block
 *
 * @parseHTML
 * This method defines how to parse the HTML representation of the node. It looks for a `div`
 * element with the class `conversation-history`.
 *
 * @renderHTML
 * This method defines how to render the node as HTML. It creates a `div` element with the class
 * `conversation-history`.
 *
 * @addProseMirrorPlugins
 * This method adds a ProseMirror plugin to the node. The plugin appends a transaction that groups
 * all nodes after a horizontal rule (`horizontalRule`) into a single `conversationHistory` node.
 *
 * @plugin
 * The plugin's `appendTransaction` method is called whenever a transaction is appended. It checks
 * for nodes after a horizontal rule and groups them into a `conversationHistory` node if any are
 * found.
 *
 * @param transactions - The list of transactions that have been applied.
 * @param oldState - The previous editor state.
 * @param newState - The new editor state.
 * @returns A new transaction if modifications were made, otherwise `null`.
 */
export const ConversationHistory = Node.create({
  name: 'converstationHistory',
  group: 'block',
  content: 'block',

  parseHTML() {
    return [
      {
        tag: 'div.conversation-history',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { class: 'conversation-history' }),
      0,
    ];
  },

  /**
   * Adds custom ProseMirror plugins to the editor.
   * When a horizontal rule is encountered, this plugin collects all nodes
   * following the horizontal rule until the end of the document.
   * These nodes are then grouped together and replaced with
   * a single node of the same type as the plugin's type.
   *
   * @returns {Plugin[]} An array of ProseMirror plugins.
   */
  addProseMirrorPlugins() {
    return [
      new Plugin({
        appendTransaction: (transactions, oldState, newState) => {
          const tr = newState.tr;
          let modified = false;
          const nodesAfterHr = [];

          newState.doc.descendants((node, pos, parent) => {
            if (
              node.type.name === 'horizontalRule' &&
              parent.type.name === 'doc'
            ) {
              const start = pos;
              const end = newState.doc.content.size;

              newState.doc.nodesBetween(start, end, (n, p, parent) => {
                if (
                  n.type.name !== 'horizontalRule' &&
                  parent.type.name === 'doc'
                ) {
                  nodesAfterHr.push({ node: n, pos: p });
                } else {
                  return false;
                }
              });

              if (nodesAfterHr.length > 0) {
                const groupNode = this.type.create(
                  {},
                  nodesAfterHr.map((n) => n.node),
                );
                tr.replaceWith(start, end, groupNode);
                modified = true;
              }
              return false;
            }
          });

          return modified ? tr : null;
        },
      }),
    ];
  },
});
