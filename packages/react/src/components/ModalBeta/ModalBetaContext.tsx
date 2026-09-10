import { createContext, useContext } from 'react';

export interface ModalBetaContextProps {
  ariaLabelId: string;
  ariaDescriptionId: string;
  focusId: string | undefined;
}

export const ModalBetaContext = createContext<ModalBetaContextProps>({
  ariaLabelId: '',
  ariaDescriptionId: '',
  focusId: '',
});

ModalBetaContext.displayName = 'ModalBetaContext';

export const useModalBetaContext = () => {
  const context = useContext(ModalBetaContext);
  if (!context) {
    throw new Error(`Cannot be rendered outside the ModalBeta component`);
  }
  return context;
};
