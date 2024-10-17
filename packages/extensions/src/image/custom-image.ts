import { mergeAttributes, nodeInputRule } from '@tiptap/core';
import Image from '@tiptap/extension-image';

export const IMAGE_INPUT_REGEX =
  /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

export interface CustomImageOptions {
  HTMLAttributes: Record<string, string>;
  sizes: string[];
}

interface AttributesProps {
  width: number | string;
  height: number | string;
  size: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customImage: {
      setAttributes: (options: AttributesProps) => ReturnType;
      setNewImage: (options: {
        src: string;
        alt?: string;
        title?: string;
      }) => ReturnType;
    };
  }
}

export const CustomImage = Image.extend<CustomImageOptions>({
  name: 'custom-image',
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      ...this.parent?.(),
      inline: true,
      content: 'inline*',
      sizes: ['small', 'medium', 'large'],
      HTMLAttributes: {
        class: 'custom-image',
      },
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      size: {
        default: 'medium',
        rendered: false,
      },
      alt: {
        renderHTML: (attributes) => {
          return {
            alt: attributes.alt,
          };
        },
        parseHTML: (element) => element.getAttribute('alt'),
      },
      title: {
        renderHTML: (attributes) => {
          return {
            title: attributes.title,
          };
        },
        parseHTML: (element) => element.getAttribute('title'),
      },
      width: {
        default: '350',
        renderHTML: (attributes) => {
          if (
            attributes.width !== null &&
            attributes.width !== undefined &&
            !Number.isNaN(attributes.width)
          ) {
            return {
              width: parseInt(attributes.width),
            };
          }
          return {};
        },
        parseHTML: (element) => element.getAttribute('width'),
      },
      height: {
        renderHTML: (attributes) => {
          if (
            attributes.height !== null &&
            attributes.height !== undefined &&
            !Number.isNaN(attributes.height)
          ) {
            return {
              height: parseInt(attributes.height),
            };
          }
          return {};
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
        parseHTML: (element) => {
          const style = element.getAttribute('style');
          return style && typeof style === 'string' && style.length > 0
            ? {}
            : null;
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]:not([src^="data:"])',
        getAttrs: (el: HTMLImageElement) => {
          const attr = { src: el.getAttribute('src') };
          // Check old content format and get the width from the parent element
          if (el.parentElement?.className.includes('image-container')) {
            if (el.parentElement.style?.width) {
              attr['width'] = el.parentElement.style.width;
            }
          }
          if (el.style?.width) {
            attr['width'] = el.style.width;
          }

          // Check old content smiley
          const oldSmileyList = [
            'happy',
            'proud',
            'dreamy',
            'love',
            'tired',
            'angry',
            'worried',
            'sick',
            'joker',
            'sad',
          ];
          if (
            oldSmileyList.filter((smiley) => attr.src.includes(smiley + '.png'))
              .length > 0
          ) {
            attr['style'] = {
              width: '1.5em',
              height: '1.5em',
              fontSize: el.parentElement?.style?.fontSize,
            };
            attr['width'] = 'null';
            attr['height'] = 'null';
          }
          return attr;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: IMAGE_INPUT_REGEX,
        type: this.type,
        getAttributes: (match) => {
          const [, , alt, src, title] = match;

          return {
            src,
            alt,
            title,
          };
        },
      }),
    ];
  },

  addCommands() {
    return {
      setNewImage:
        (attrs) =>
        ({ tr, dispatch }) => {
          const { selection } = tr;
          const node = this.type.create(attrs);

          if (dispatch) {
            tr.replaceRangeWith(selection.from, selection.to, node);
          }

          return true;
        },
      setAttributes:
        (attributes) =>
        ({ tr, dispatch }) => {
          const { selection } = tr;

          const nodeAttrs = tr.doc.nodeAt(tr.selection.from);
          const options = {
            ...nodeAttrs.attrs,
            ...attributes,
          };
          const node = this.type.create(options);

          if (dispatch) {
            tr.replaceRangeWith(selection.from, selection.to, node);
          }

          return true;
        },
    };
  },
});
