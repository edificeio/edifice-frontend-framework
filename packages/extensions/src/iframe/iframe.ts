import { Node } from '@tiptap/core';
import { iframeTransformer } from './transformers';

export interface IframeOptions {
  allowFullscreen: boolean;
  HTMLAttributes: {
    [key: string]: any;
  };
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      /**
       * Add an iframe
       */
      setIframe: (options: { src: string }) => ReturnType;
    };
  }
}

export const Iframe = Node.create<IframeOptions>({
  name: 'iframe',
  group: 'block',
  atom: true,
  draggable: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: {
        class: 'iframe-wrapper',
      },
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen,
      },
      width: {
        renderHTML: (attributes) => {
          return attributes.width
            ? {
                width:
                  attributes.width === '100%'
                    ? '100%'
                    : parseInt(attributes.width),
              }
            : {};
        },
        parseHTML: (element) => element.getAttribute('width'),
      },
      height: {
        renderHTML: (attributes) => {
          return attributes.height
            ? {
                height: parseInt(attributes.height),
              }
            : {};
        },
        parseHTML: (element) => element.getAttribute('height'),
      },
      style: {
        renderHTML: (attributes) => {
          return attributes.style
            ? {
                style: attributes.style,
              }
            : {};
        },
        parseHTML: (element) => element.getAttribute('style'),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // Call the onRenderHTML method from the iframeTransformer before rendering the iframe
    iframeTransformer.onRenderHTML({ HTMLAttributes });
    return ['div', this.options.HTMLAttributes, ['iframe', HTMLAttributes]];
  },

  addCommands() {
    return {
      setIframe:
        (options: { src: string }) =>
        ({ tr, dispatch }) => {
          const { selection } = tr;
          const node = this.type.create(options);

          if (dispatch) {
            tr.replaceRangeWith(selection.from, selection.to, node);
          }

          return true;
        },
    };
  },
});
