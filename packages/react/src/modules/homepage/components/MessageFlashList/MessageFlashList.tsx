import { IFlashMessageModel } from '@edifice.io/client';
import { Flex } from '../../../..';
import MessageFlash from './MessageFlash';

export type MessageFlashListProps = {
  /** List of messages to display */
  messages: IFlashMessageModel[];
  /** Callback when the message is closed */
  onCloseMessage?: (message: IFlashMessageModel) => void;
};

const MessageFlashList = ({
  messages,
  onCloseMessage,
}: MessageFlashListProps) => {
  return (
    <section role="region" className="message-flash-list">
      <Flex direction="column" gap="16" role="list">
        {messages.map((message) => (
          <div key={message.id} role="listitem">
            <MessageFlash
              message={message}
              onCloseMessage={(msg) => onCloseMessage?.(msg)}
            />
          </div>
        ))}
      </Flex>
    </section>
  );
};

MessageFlashList.displayName = 'MessageFlashList';

export default MessageFlashList;
