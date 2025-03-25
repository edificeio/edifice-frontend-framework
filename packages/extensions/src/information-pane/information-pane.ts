import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    informationPane: {
      /**
       * Set a informationPane node
       * @param type The type of the informationPane
       */
      setInformationPane: (type?: string) => ReturnType;
    };
  }
}

export const InformationPane = Node.create({
  name: 'information-pane',

  group: 'block',
  content: 'block+',
  defining: true,
  marks: '',

  addAttributes() {
    return {
      type: {
        default: 'info', // type par défaut
        parseHTML: (element) => element.getAttribute('data-type') || 'info',
        renderHTML: (attributes) => {
          return {
            'data-type': attributes.type,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-information-pane]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const type = node.attrs.type;
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-information-pane': '',
        'class': `information-pane information-pane-${type}`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setInformationPane:
        (type = 'info') =>
        ({ commands }) => {
          return commands.insertContent([
            {
              type: this.name,
              attrs: { type },
              content: [
                {
                  type: 'paragraph',
                },
              ],
            },
          ]);
        },
    };
  },
});
