import { InformationPane } from '@edifice.io/tiptap-extensions/information-pane';
import { ReactNodeViewRenderer } from '@tiptap/react';

const InformationPaneNodeView = (Component: any) =>
  InformationPane.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Component);
    },
  });

export default InformationPaneNodeView;
