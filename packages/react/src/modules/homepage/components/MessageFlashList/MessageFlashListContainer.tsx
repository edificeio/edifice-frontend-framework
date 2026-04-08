import { useMessageFlashListContainer } from './hooks/useMessageFlashList';
import MessageFlashList from './MessageFlashList';

export const MessageFlashListContainer = () => {
  const { messages, error, handleMarkAsRead } = useMessageFlashListContainer();

  // No messages or loading state
  if (!messages || messages.length === 0 || error) {
    return null;
  }

  return (
    <MessageFlashList messages={messages} onCloseMessage={handleMarkAsRead} />
  );
};

MessageFlashListContainer.displayName = 'MessageFlashListContainer';

export default MessageFlashListContainer;
