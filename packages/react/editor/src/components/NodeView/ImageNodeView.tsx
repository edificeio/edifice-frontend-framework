import { CustomImage } from "@edifice-tiptap-extensions/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { WorkspaceElement } from "edifice-ts-client";

const ImageNodeView = (
  Component: any,
  uploadFile: (file: File) => Promise<WorkspaceElement | null>,
) =>
  CustomImage.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Component);
    },
  }).configure({
    uploadFile,
  });

export default ImageNodeView;
