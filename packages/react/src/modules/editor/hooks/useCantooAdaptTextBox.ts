import { useState } from 'react';

/**
 * Custom hook to manage CantooAdaptTextBoxView events in an editor.
 * @returns {
 * `isOpen`: truthy boolean when CantooAdaptTextBoxView sholud be visible,
 * `toggle`: an imperative function to toggle the `isOpen` value,
 * }
 */
export const useCantooAdaptTextBox = (): CantooAdaptTextBox => {
  const [openPosition, setOpenPosition] = useState({
    right: false,
    bottom: false,
  });

  const handleCantooAdaptTextPosition = (position: string) => {
    // swith cas to handle the position
    switch (position) {
      case 'right':
        setOpenPosition((prev) => ({
          bottom: false,
          right: !prev.right,
        }));
        break;
      case 'bottom':
        setOpenPosition((prev) => ({
          right: false,
          bottom: !prev.bottom,
        }));
        break;
      default:
        break;
    }
  };

  return {
    openPosition,
    handleCantooAdaptTextPosition,
  };
};

export interface CantooAdaptTextBox {
  openPosition: { right: boolean; bottom: boolean };
  handleCantooAdaptTextPosition: (position: string) => void;
}
