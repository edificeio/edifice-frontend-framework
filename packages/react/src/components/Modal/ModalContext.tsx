import { createContext, useContext } from 'react';

export interface ModalContextProps {
  ariaLabelId: string;
  ariaDescriptionId: string;
  focusId: string | undefined;
}

export const ModalContext = createContext<ModalContextProps>({
  ariaLabelId: '',
  ariaDescriptionId: '',
  focusId: '',
});

ModalContext.displayName = 'ModalContext';

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(`Cannot be rendered outside the Modal component`);
  }
  return context;
};
