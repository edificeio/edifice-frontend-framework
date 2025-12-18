import { createContext, useContext } from 'react';

export interface RadioCardContextProps {
  value: string;
  model: string | boolean | number;
  groupName: string;
  isSelected: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hideRadioButton: boolean;
}

export const RadioCardContext = createContext<RadioCardContextProps | null>(
  null!,
);

RadioCardContext.displayName = 'RadioCardContext';

export const useRadioCardContext = () => {
  const context = useContext(RadioCardContext);
  if (!context) {
    throw new Error(`Cannot be rendered outside the RadioCard component`);
  }
  return context;
};
