import { Image } from "@edifice.io/tiptap-extensions/image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { WorkspaceElement } from "edifice-ts-client";

const ImageNodeView = (
  Component: any,
  uploadFile: (file: File) => Promise<WorkspaceElement | null>,
) =>
  Image.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Component);
    },
  }).configure({
    uploadFile,
  });

export default ImageNodeView;
