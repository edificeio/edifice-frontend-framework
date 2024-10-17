import { mergeAttributes } from '@tiptap/core';
import { Heading } from '@tiptap/extension-heading';
import '@tiptap/extension-text-style';

export declare type Level = 1 | 2;

interface Options {
  levels: Level[];
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customHeading: {
      /**
       * Apply Heading Level
       */
      setCustomHeading: (attributes: { level: Level }) => ReturnType;
    };
  }
}

export const CustomHeading = Heading.extend<Options>({
  name: 'customHeading',

  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return this.options.levels.map((level: Level) => ({
      tag: `h${level}`,
      attrs: { level },
    }));
  },

  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level = hasLevel ? node.attrs.level : this.options.levels[0];

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setCustomHeading:
        (attributes) =>
        ({ tr, dispatch, commands }) => {
          if (!this.options.levels.includes(attributes.level)) {
            return false;
          }

          const { selection } = tr;
          const { from, to } = selection;

          tr.doc.nodesBetween(from, to, (node, pos) => {
            if (node.isBlock && from >= pos && to <= pos + node.nodeSize) {
              /* get node content and iterate through */
              node.content.forEach((content) => {
                /* get content marks and iterate through */
                content.marks.forEach((mark) => {
                  /* find textStyle mark and if has fontSize attrs */
                  if (
                    mark.type.name === 'textStyle' &&
                    mark.attrs['fontSize'] &&
                    mark.attrs['fontSize'] !== null
                  ) {
                    /* remove any fontSize attr to reset heading style */
                    tr = tr.removeMark(pos, pos + node.nodeSize, mark.type);
                  }
                });
              });
            }
          });

          if (dispatch) {
            dispatch(tr);
          }
          return commands.setHeading({ level: attributes.level });
        },
    };
  },
});
