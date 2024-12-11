import { Image } from '@edifice.io/tiptap-extensions/image';
import { WorkspaceElement } from '@edifice.io/client';
import { ReactNodeViewRenderer } from '@tiptap/react';

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
