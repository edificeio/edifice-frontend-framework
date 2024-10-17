import { Attachment } from '@edifice.io/tiptap-extensions';
import { ReactNodeViewRenderer } from '@tiptap/react';

const AttachmentNodeView = (Component: any) =>
  Attachment.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Component);
    },
  });

export default AttachmentNodeView;
