import { createContext, useContext } from 'react';

import { FormControlProps } from './FormControl';

type Props = Omit<FormControlProps, 'className' | 'children'>;

export type FormContextProps = Props;

export const Context = createContext<FormContextProps | null>(null!);

export const useFormControl = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error(`Cannot be rendered outside the FormControl component`);
  }
  return context;
};
