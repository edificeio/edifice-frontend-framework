import { createContext, useContext } from 'react';

import { IWebApp } from '@edifice.io/client';

import { CardProps } from './Card';

export interface CardContextProps extends Omit<
  CardProps,
  'children' | 'className'
> {
  app?: IWebApp | undefined;
  appCode: string | undefined;
  isSelectable?: boolean;
  isClickable?: boolean;
  onClick?: () => void;
  onSelect?: () => void;
}

export const CardContext = createContext<CardContextProps | null>(null!);

CardContext.displayName = 'CardContext';

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error(`Cannot be rendered outside the Card component`);
  }
  return context;
};
