import { createContext, type ReactNode } from 'react';

import { IOdeTheme } from '@edifice.io/client';

export interface EdificeThemeProps {
  children: ReactNode;
  defaultTheme?: 'one' | 'neo' | 'none';
}

export interface EdificeThemeContextProps {
  theme: IOdeTheme | undefined;
}

export const EdificeThemeContext =
  createContext<EdificeThemeContextProps | null>(null!);
