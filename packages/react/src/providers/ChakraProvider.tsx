import { ChakraProvider as BaseChakraProvider } from '@chakra-ui/react';
import theme from '../theme';

interface ChakraProviderProps {
  children: React.ReactNode;
}

/**
 * Provider Chakra UI avec le thème personnalisé Edifice
 */
export const ChakraProvider = ({ children }: ChakraProviderProps) => {
  return <BaseChakraProvider value={theme}>{children}</BaseChakraProvider>;
};

export default ChakraProvider;
