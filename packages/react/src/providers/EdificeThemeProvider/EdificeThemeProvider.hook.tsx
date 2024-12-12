import { useContext } from 'react';
import { EdificeThemeContext } from './EdificeThemeProvider.context';

export function useEdificeTheme() {
  const context = useContext(EdificeThemeContext);

  if (!context) {
    throw new Error(`Cannot be used outside of EdificeThemeProvider`);
  }
  return context;
}
