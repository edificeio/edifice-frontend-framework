import { WorkspaceElement } from '@edifice.io/client';
import { ImageResizer } from '@edifice.io/utilities';
import { mergeAttributes, nodeInputRule } from '@tiptap/core';
import TiptapImage from '@tiptap/extension-image';
import { Plugin } from 'prosemirror-state';

export const IMAGE_INPUT_REGEX =
  /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

export interface CustomImageOptions {
  HTMLAttributes: Record<string, string>;
  sizes: string[];
  uploadFile?: (file: File) => Promise<WorkspaceElement | null>;
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

export const Image = TiptapImage.extend<CustomImageOptions>({
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
      uploadFile: () => {
        return Promise.resolve(null);
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
          return null;
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
              fontSize: '16px',
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

  addProseMirrorPlugins() {
    const uploadNode = async (file: File) => {
      /**
       * Resize the image
       */
      const resizedImage = await ImageResizer.resizeImageFile(file);

      /**
       * Upload the image
       */
      const image = await this.options.uploadFile(resizedImage);

      /**
       * Get the image url
       */
      const imageUrl = `/workspace/${image.public ? 'pub/' : ''}document/${
        image._id
      }?timestamp=${new Date().getTime()}`;

      /**
       * Create the image node
       */

      const node = this.type.create({
        src: imageUrl,
        alt: image.alt,
        title: image.title,
      });

      return node;
    };

    const getFilteredFiles = (files: FileList) => {
      return Array.from(files).filter((file) =>
        /image\/(png|jpeg|jpg|gif|webp|heic|avif)/.test(file.type),
      );
    };

    const handleImageInsert = async (
      editor: any,
      file: File,
      position?: number,
    ) => {
      const node = await uploadNode(file);
      if (!node) return;

      const transaction =
        position !== undefined
          ? editor.state.tr.insert(position, node)
          : editor.state.tr.replaceSelectionWith(node);

      editor.dispatch(transaction);
    };

    return [
      new Plugin({
        props: {
          handlePaste: (editor, e) => {
            const files = getFilteredFiles(e.clipboardData?.files);
            if (files.length === 0) return false;

            for (const file of files) {
              handleImageInsert(editor, file);
            }

            return true;
          },
          handleDrop: (editor, e, _s, moved) => {
            if (moved) return false;

            const files = getFilteredFiles(e.dataTransfer.files);
            if (files.length === 0) return false;

            const { pos: position } = editor.posAtCoords({
              left: e.clientX,
              top: e.clientY,
            });

            for (const file of files) {
              handleImageInsert(editor, file, position);
            }
            return true;
          },
        },
      }),
    ];
  },
});
