import { mergeAttributes, Node } from '@tiptap/core';

export interface AudioOptions {
  url: string;
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    audio: {
      /**
       * Set a audio node
       * @param options.updateSelection set to true will select the newly inserted content
       */
      setAudio: (
        id: string,
        src: string,
        options?: { updateSelection: boolean },
      ) => ReturnType;
    };
  }
}

export const Audio = Node.create({
  name: 'audio',
  group: 'block',

  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (el: any) => (el as HTMLAudioElement).getAttribute('src'),
        renderHTML: (attrs: any) => ({ src: attrs.src }),
      },
      documentId: {
        default: '',
        renderHTML: (attributes: any) => {
          return { 'data-document-id': attributes.documentId };
        },
        parseHTML: (element: any) => element.getAttribute('data-document-id'),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.audio-wrapper>audio,audio',
        getAttrs: (el: any) => ({
          src: (el as HTMLAudioElement).getAttribute('src'),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'audio-wrapper' },
      ['audio', mergeAttributes(HTMLAttributes)],
    ];
  },

  addCommands() {
    return {
      setAudio:
        (id, src, options) =>
        ({ commands, state }) => {
          return commands.insertContentAt(
            state.selection,
            `<audio 
              src="${src}" 
              controls preload="none"
              data-document-id="${id}"></audio>`,
            options,
          );
        },
    };
  },
});
