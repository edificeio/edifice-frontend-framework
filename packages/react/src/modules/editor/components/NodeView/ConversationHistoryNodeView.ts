import { ConversationHistory } from '@edifice.io/tiptap-extensions/conversation-history';
import { ReactNodeViewRenderer } from '@tiptap/react';

const ConversationHistoryNodeView = (Component: any) =>
  ConversationHistory.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Component);
    },
  });

export default ConversationHistoryNodeView;
