import { mergeAttributes, Node } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';

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

  addProseMirrorPlugins() {
    return [
      new Plugin({
        appendTransaction: (transactions, oldState, newState) => {
          const tr = newState.tr;
          let modified = false;
          const nodesAfterHr = [];

          newState.doc.descendants((node, pos) => {
            if (node.type.name === 'horizontalRule') {
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
