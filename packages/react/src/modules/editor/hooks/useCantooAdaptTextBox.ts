import { useToggle } from '../../../hooks';

/**
 * Custom hook to manage CantooAdaptTextBoxView events in an editor.
 * @returns {
 * `isOpen`: truthy boolean when CantooAdaptTextBoxView sholud be visible,
 * `toggle`: an imperative function to toggle the `isOpen` value,
 * `onCancel`: Cancel event handler,
 * }
 */
export const useCantooAdaptTextBox = (): CantooAdaptTextBox => {
  const [isOpen, toggle] = useToggle(false);
  const onCancel = () => {
    toggle();
  };
  return {
    isOpen,
    toggle,
    onCancel,
  };
};

export interface CantooAdaptTextBox {
  isOpen: boolean;
  toggle: () => void;
  onCancel: () => void;
}
