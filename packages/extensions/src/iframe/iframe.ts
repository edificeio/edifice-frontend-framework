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
        default: '600',
        parseHTML: (element) => {
          const width = element.getAttribute('width');
          const height = element.getAttribute('height');
          if (!width) return '600';
          
          const widthValue = parseInt(width);
          const maxWidth = 600;
          
          // Si la largeur dépasse le max, on la limite et on stocke le ratio
          if (widthValue > maxWidth && height) {
            const heightValue = parseInt(height);
            const ratio = heightValue / widthValue;
            // Stocker le ratio dans un attribut custom pour calculer la hauteur
            element.dataset.aspectRatio = ratio.toString();
          }
          
          return Math.min(widthValue, maxWidth).toString();
        },
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          
          const widthValue = parseInt(attributes.width);
          const maxWidth = 600;
          return {
            width: Math.min(widthValue, maxWidth),
          };
        },
      },
      height: {
        parseHTML: (element) => {
          const height = element.getAttribute('height');
          const width = element.getAttribute('width');
          
          if (!height) return null;
          
          const heightValue = parseInt(height);
          const widthValue = parseInt(width || '600');
          const maxWidth = 600;
          
          if (widthValue > maxWidth) {
            const ratio = heightValue / widthValue;
            return Math.round(maxWidth * ratio).toString();
          }
          
          return height;
        },
        renderHTML: (attributes) => {
          return attributes.height
            ? {
                height: parseInt(attributes.height),
              }
            : {};
        },
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
