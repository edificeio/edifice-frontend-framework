import { useToggle } from "@edifice-ui/react";
/**
 * Custom hook to manage CantooModal events in an editor.
 * @returns {
 * `isOpen`: truthy boolean when CantooModal sholud be visible,
 * `toggle`: an imperative function to toggle the `isOpen` value,
 * `onCancel`: Cancel event handler,
 * `onSuccess`: Success event handler (adds a formula to the editor content),
 * }
 */
export const useCantooModal = () => {
  const [isOpen, toggle] = useToggle(false);
  const onCancel = () => {
    toggle();
  };
  const onSuccess = () => {
    toggle();
  };
  return {
    isOpen,
    toggle,
    onCancel,
    onSuccess,
  };
};
