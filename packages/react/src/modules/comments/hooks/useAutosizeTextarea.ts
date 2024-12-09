import { useEffect, useRef } from 'react';

export const useAutosizeTextarea = (
  /**
   * Set autofocus when editing content
   */
  autoFocus?: boolean,
): [
  React.RefObject<HTMLTextAreaElement>,
  (event: React.FocusEvent<HTMLTextAreaElement>) => void,
  () => void,
] => {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextarea = () => {
    if (ref.current) {
      ref.current.style.height = 'auto'; // Réinitialise la hauteur avant de recalculer
      const scrollHeight = ref.current.scrollHeight;
      ref.current.style.height = `${scrollHeight}px`; // Ajuste à la nouvelle hauteur
    }
  };

  useEffect(() => {
    resizeTextarea();

    if (autoFocus) ref.current?.focus();
  });

  const onFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    event.currentTarget.setSelectionRange(
      event.currentTarget.value.length + 1,
      event.currentTarget.value.length + 1,
    );
  };

  return [ref, onFocus, resizeTextarea];
};
