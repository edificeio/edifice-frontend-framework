import { mergeAttributes, nodeInputRule } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import { Plugin } from "prosemirror-state";
import { WorkspaceElement } from "edifice-ts-client";
import ImageResizer from "@edifice.io/image-resizer";

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

declare module "@tiptap/core" {
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
  name: "custom-image",
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      ...this.parent?.(),
      inline: true,
      content: "inline*",
      sizes: ["small", "medium", "large"],
      HTMLAttributes: {
        class: "custom-image",
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
        default: "medium",
        rendered: false,
      },
      alt: {
        renderHTML: (attributes) => {
          return {
            alt: attributes.alt,
          };
        },
        parseHTML: (element) => element.getAttribute("alt"),
      },
      title: {
        renderHTML: (attributes) => {
          return {
            title: attributes.title,
          };
        },
        parseHTML: (element) => element.getAttribute("title"),
      },
      width: {
        default: "350",
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
        parseHTML: (element) => element.getAttribute("width"),
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
        parseHTML: (element) => element.getAttribute("height"),
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
          const style = element.getAttribute("style");
          return style && typeof style === "string" && style.length > 0
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
          const attr = { src: el.getAttribute("src") };
          // Check old content format and get the width from the parent element
          if (el.parentElement?.className.includes("image-container")) {
            if (el.parentElement.style?.width) {
              attr["width"] = el.parentElement.style.width;
            }
          }
          if (el.style?.width) {
            attr["width"] = el.style.width;
          }

          // Check old content smiley
          const oldSmileyList = [
            "happy",
            "proud",
            "dreamy",
            "love",
            "tired",
            "angry",
            "worried",
            "sick",
            "joker",
            "sad",
          ];
          if (
            oldSmileyList.filter((smiley) => attr.src.includes(smiley + ".png"))
              .length > 0
          ) {
            attr["style"] = {
              width: "1.5em",
              height: "1.5em",
              fontSize: el.parentElement?.style?.fontSize,
            };
            attr["width"] = "null";
            attr["height"] = "null";
          }
          return attr;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
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
    const uploadAndCreateImages = async (
      files: File[],
      editor,
      position?: number,
    ) => {
      const images = files.filter((file) =>
        /image\/(png|jpeg|jpg|gif|webp|heic|avif)/.test(file.type),
      );
      images.forEach(async (file) => {
        const resizedImage = await ImageResizer.resizeImageFile(file);
        const image = await this.options.uploadFile(resizedImage);

        if (image) {
          /**
           * WB-3053: addTimestampToImageUrl to update correctly image in tiptap-image-extension
           */
          const imageUrl = `/workspace/${image.public ? "pub/" : ""}document/${
            image._id
          }?timestamp=${new Date().getTime()}`;
          const node = this.type.create({
            src: `${imageUrl}`,
            alt: image.alt,
            title: image.title,
          }); // creates the image element

          let transaction; // places it in the correct position
          if (position) {
            transaction = editor.state.tr.insert(position, node); // places it in the correct position
          } else {
            transaction = editor.state.tr.replaceSelectionWith(node); // places it in the correct position
          }

          editor.dispatch(transaction);
        }
      });
    };

    return [
      new Plugin({
        props: {
          handlePaste: (editor, e) => {
            const files = Array.from(e.clipboardData.files);

            uploadAndCreateImages(files, editor);

            return false;
          },
          handleDrop: (editor, e, _s, moved) => {
            const files = Array.from(e.dataTransfer.files);
            if (!moved && files.length > 0) {
              const { pos: position } = editor.posAtCoords({
                left: e.clientX,
                top: e.clientY,
              });

              uploadAndCreateImages(files, editor, position);
              return true;
            }

            return false;
          },
        },
      }),
    ];
  },
});
