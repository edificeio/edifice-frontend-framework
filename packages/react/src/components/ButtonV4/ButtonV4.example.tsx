import React from 'react';
import { ButtonV4 } from './ButtonV4';
import { MantineProvider } from '../../providers/MantineProvider';

/**
 * Exemple d'utilisation du composant ButtonV4
 *
 * Ce fichier montre comment utiliser ButtonV4 dans une application
 * et comment l'intégrer avec le MantineProvider.
 */
export const ButtonV4Example: React.FC = () => {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <MantineProvider>
      <div
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h2>Exemples d'utilisation de ButtonV4</h2>

        {/* Variants */}
        <div>
          <h3>Variants</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <ButtonV4 variant="filled" color="primary">
              Filled
            </ButtonV4>
            <ButtonV4 variant="outline" color="primary">
              Outline
            </ButtonV4>
            <ButtonV4 variant="light" color="primary">
              Light
            </ButtonV4>
            <ButtonV4 variant="subtle" color="primary">
              Subtle
            </ButtonV4>
            <ButtonV4 variant="gradient" color="primary">
              Gradient
            </ButtonV4>
          </div>
        </div>

        {/* Couleurs */}
        <div>
          <h3>Couleurs</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <ButtonV4 variant="filled" color="primary">
              Primary
            </ButtonV4>
            <ButtonV4 variant="filled" color="secondary">
              Secondary
            </ButtonV4>
            <ButtonV4 variant="filled" color="success">
              Success
            </ButtonV4>
            <ButtonV4 variant="filled" color="danger">
              Danger
            </ButtonV4>
            <ButtonV4 variant="filled" color="warning">
              Warning
            </ButtonV4>
            <ButtonV4 variant="filled" color="info">
              Info
            </ButtonV4>
          </div>
        </div>

        {/* Tailles */}
        <div>
          <h3>Tailles</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <ButtonV4 size="xs">Extra Small</ButtonV4>
            <ButtonV4 size="sm">Small</ButtonV4>
            <ButtonV4 size="md">Medium</ButtonV4>
            <ButtonV4 size="lg">Large</ButtonV4>
            <ButtonV4 size="xl">Extra Large</ButtonV4>
          </div>
        </div>

        {/* États */}
        <div>
          <h3>États</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <ButtonV4>Normal</ButtonV4>
            <ButtonV4 loading>Loading</ButtonV4>
            <ButtonV4 disabled>Disabled</ButtonV4>
          </div>
        </div>

        {/* Avec gestionnaire d'événements */}
        <div>
          <h3>Avec gestionnaire d'événements</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <ButtonV4 onClick={handleClick}>Cliquez moi</ButtonV4>
            <ButtonV4
              variant="outline"
              color="success"
              onClick={() => alert('Succès!')}
            >
              Alert
            </ButtonV4>
          </div>
        </div>

        {/* Comparaison avec Bootstrap */}
        <div>
          <h3>Comparaison avec Bootstrap</h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <div>
              <h4>ButtonV4 (Mantine)</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <ButtonV4 variant="filled" color="primary">
                  Primary
                </ButtonV4>
                <ButtonV4 variant="filled" color="secondary">
                  Secondary
                </ButtonV4>
                <ButtonV4 variant="filled" color="success">
                  Success
                </ButtonV4>
                <ButtonV4 variant="filled" color="danger">
                  Danger
                </ButtonV4>
              </div>
            </div>
            <div>
              <h4>Bootstrap (pour comparaison)</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className="btn btn-primary">Primary</button>
                <button className="btn btn-secondary">Secondary</button>
                <button className="btn btn-success">Success</button>
                <button className="btn btn-danger">Danger</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MantineProvider>
  );
};

export default ButtonV4Example;
