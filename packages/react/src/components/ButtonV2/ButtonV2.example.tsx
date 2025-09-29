import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ButtonV2 } from './index';
import theme from '../../theme';

/**
 * Exemple d'utilisation du composant ButtonV2
 */
export const ButtonV2Example = () => {
  return (
    <ChakraProvider value={theme}>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          padding: '2rem',
        }}
      >
        <h2>ButtonV2 Examples</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3>Couleurs</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <ButtonV2 color="primary">Primary</ButtonV2>
            <ButtonV2 color="secondary">Secondary</ButtonV2>
            <ButtonV2 color="danger">Danger</ButtonV2>
            <ButtonV2 color="success">Success</ButtonV2>
            <ButtonV2 color="warning">Warning</ButtonV2>
            <ButtonV2 color="info">Info</ButtonV2>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3>Variants</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <ButtonV2 variant="solid">Solid</ButtonV2>
            <ButtonV2 variant="outline">Outline</ButtonV2>
            <ButtonV2 variant="ghost">Ghost</ButtonV2>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3>Tailles</h3>
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <ButtonV2 size="sm">Small</ButtonV2>
            <ButtonV2 size="md">Medium</ButtonV2>
            <ButtonV2 size="lg">Large</ButtonV2>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3>États</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <ButtonV2>Normal</ButtonV2>
            <ButtonV2 isLoading>Loading</ButtonV2>
            <ButtonV2 disabled>Disabled</ButtonV2>
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default ButtonV2Example;
