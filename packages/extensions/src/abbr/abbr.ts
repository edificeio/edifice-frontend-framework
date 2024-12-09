import { Mark, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    abbr: {
      /**
       * Set an abbr mark
       */
      setAbbr: (src: string) => ReturnType;
      /**
       * Toggle an abbr mark
       */
      toggleAbbr: (src: string) => ReturnType;
    };
  }
}

export const Abbr = Mark.create({
  name: 'abbr',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'abbr',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'abbr',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setAbbr:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name);
        },
      toggleAbbr:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
    };
  },
});
