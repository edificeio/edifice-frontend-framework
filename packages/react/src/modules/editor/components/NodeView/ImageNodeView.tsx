import { Image } from '@edifice.io/tiptap-extensions/image';
import { WorkspaceElement } from '@edifice.io/client';
import { ReactNodeViewRenderer } from '@tiptap/react';

const ImageNodeView = (
  Component: any,
  uploadFile?: (file: File) => Promise<WorkspaceElement | null>,
) => {
  const ImageWithNodeView = Image.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Component);
    },
  });

  // The only plugin of Image uploads pasted or dropped image files:
  // without an uploader, those files are left to the editor's default handling.
  if (!uploadFile) {
    return ImageWithNodeView.extend({
      addProseMirrorPlugins() {
        return [];
      },
    });
  }

  return ImageWithNodeView.configure({
    uploadFile,
  });
};

export default ImageNodeView;
