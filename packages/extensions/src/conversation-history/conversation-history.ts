/**
 * A Tiptap Node extension that creates a conversation history container.
 * This extension groups content blocks that appear after a horizontal rule
 * into a conversation history section.
 *
 * @extends Node
 *
 * @remarks
 * The node is rendered as a div element with the class 'conversation-history'.
 * It can parse HTML elements that match the same structure.
 *
 * For retrocompatibility, this extension also includes a ProseMirror plugin
 * that handles the grouping all the content after an horizontal rules into the
 * conversation-history children block.
 *
 * Usage:
 * ```
 * // Add to your Tiptap editor extensions
 * import { ConversationHistory } from './conversation-history'
 *
 * new Editor({
 *   extensions: [
 *     ConversationHistory,
 *     // ... other extensions
 *   ],
 * })
 * ```
 */
import { mergeAttributes, Node } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';

export const ConversationHistory = Node.create({
  name: 'converstationHistory',
  group: 'block',
  content: 'block+',

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
