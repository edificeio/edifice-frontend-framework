import Highlight from '@tiptap/extension-highlight';

export const CustomHighlight = Highlight.extend({
  name: 'customHighlight',

  addOptions() {
    return {
      ...this.parent?.(),
      multicolor: true,
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        ...this.parent?.(),
        style: 'background-color',
        getAttrs: (style) => {
          return {
            color: style,
          };
        },
      },
    ];
  },
});
