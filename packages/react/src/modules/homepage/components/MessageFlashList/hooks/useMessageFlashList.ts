import { IFlashMessageModel } from '@edifice.io/client';
import { useMarkAsRead, useMessagesFlash } from '../services';

export interface UseMessageFlashListReturn {
  /** Array of flash messages */
  messages: IFlashMessageModel[] | undefined;
  /** Loading state for fetching messages */
  isLoading: boolean;
  /** Error state from fetching messages */
  error: Error | null;
  /** Handler to mark a message as read */
  handleMarkAsRead: (message: IFlashMessageModel) => void;
}

/**
 * Custom hook that provides flash messages data and handlers with exposed loading states
 * @returns Object containing messages, loading state, error state, and mark as read handler
 */
export const useMessageFlashList = (): UseMessageFlashListReturn => {
  const { data: messages, isLoading, error } = useMessagesFlash();
  const markAsReadMessage = useMarkAsRead();

  const handleMarkAsRead = (message: IFlashMessageModel) => {
    markAsReadMessage.mutateAsync(message);
  };

  return {
    messages,
    isLoading,
    error,
    handleMarkAsRead,
  };
};
