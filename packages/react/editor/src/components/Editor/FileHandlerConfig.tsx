import { addTimestampToImageUrl } from "@edifice-ui/react";
import ImageResizer from "@edifice.io/image-resizer";
import { Editor } from "@tiptap/core";
import { WorkspaceElement } from "edifice-ts-client";

export const FileHandlerConfig = (
  uploadFile: (file: File) => Promise<WorkspaceElement | null>,
) => {
  const getUrl = (document: WorkspaceElement) => {
    return `/workspace/${document.public ? "pub/" : ""}document/${
      document._id
    }`;
  };

  const uploadFiles = async (
    files: File[],
    editor: Editor,
    position?: number,
  ) => {
    files.forEach(async (file) => {
      if (file.type.startsWith("image")) {
        const resizedImage = await ImageResizer.resizeImageFile(file);
        const image = await uploadFile(resizedImage);
        if (image) {
          editor
            .chain()
            .focus(position)
            .setNewImage({
              /**
               * WB-3053: addTimestampToImageUrl to update correctly image in tiptap-image-extension
               */
              src: addTimestampToImageUrl(getUrl(image)),
              alt: image.alt,
              title: image.title,
            })
            .run();
        }
      }
    });
  };

  return {
    allowedMimeTypes: [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
      "image/avif",
    ],
    onDrop: (editor: Editor, files: File[], pos: number) => {
      uploadFiles(files, editor, pos);
    },
    onPaste: (editor: Editor, files: File[], pasteContent?: string) => {
      if (pasteContent) {
        const containBase64Regex =
          /src="data:image\/(png|jpeg|gif|webp|heic|avif);base64,(.*)" /gim;
        const validBase64Regex = /^[-A-Za-z0-9+/]*={0,3}$/;
        const containBase64 = containBase64Regex.exec(pasteContent);

        // If the pasteContent does not contain base64 or the base64 is invalid, do not insert the image
        if (!containBase64 || !validBase64Regex.test(containBase64[2])) {
          return false;
        }
      }
      uploadFiles(files, editor);
    },
  };
};
