import { useContext } from 'react';
import { EdificeClientContext } from './EdificeClientProvider.context';

export function useEdificeClient() {
  const context = useContext(EdificeClientContext);

  if (!context) {
    throw new Error(`Cannot be used outside of EdificeClientProvider`);
  }
  return context;
}
