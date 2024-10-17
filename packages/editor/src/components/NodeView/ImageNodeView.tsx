import { CustomImage } from '@edifice.io/tiptap-extensions';
import { ReactNodeViewRenderer } from '@tiptap/react';

const ImageNodeView = (Component: any) =>
  CustomImage.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Component);
    },
  });

export default ImageNodeView;
