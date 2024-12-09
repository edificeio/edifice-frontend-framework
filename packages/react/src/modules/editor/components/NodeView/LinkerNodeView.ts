import { Linker } from '@edifice.io/tiptap-extensions/linker';
import { ReactNodeViewRenderer } from '@tiptap/react';

const LinkerNodeView = (Component: any) =>
  Linker.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Component);
    },
  });

export default LinkerNodeView;
