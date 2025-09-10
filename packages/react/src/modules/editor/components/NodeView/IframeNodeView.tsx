import { Iframe } from '@edifice.io/tiptap-extensions/iframe';
import { ReactNodeViewRenderer } from '@tiptap/react';

const IframeNodeView = (Component: any) =>
  Iframe.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Component);
    },
  });

export default IframeNodeView;
