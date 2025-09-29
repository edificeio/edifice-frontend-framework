import React from 'react';
import { ButtonV4 } from './ButtonV4';
import { MantineProvider } from '../../providers/MantineProvider';

/**
 * Composant de test pour vérifier que ButtonV4 fonctionne correctement
 * avec tous les styles appliqués
 */
export const ButtonV4Test: React.FC = () => {
  return (
    <MantineProvider>
      <div
        style={{
          padding: '40px',
          background: '#f8f9fa',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center',
        }}
      >
        <h1 style={{ color: '#333', marginBottom: '20px' }}>
          Test ButtonV4 - Styles Mantine
        </h1>

        {/* Test des variants */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <ButtonV4 variant="filled" color="primary">
            Filled Primary
          </ButtonV4>
          <ButtonV4 variant="outline" color="primary">
            Outline Primary
          </ButtonV4>
          <ButtonV4 variant="light" color="primary">
            Light Primary
          </ButtonV4>
          <ButtonV4 variant="subtle" color="primary">
            Subtle Primary
          </ButtonV4>
          <ButtonV4 variant="gradient" color="primary">
            Gradient Primary
          </ButtonV4>
        </div>

        {/* Test des couleurs */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
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

        {/* Test des tailles */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ButtonV4 size="xs" color="primary">
            XS
          </ButtonV4>
          <ButtonV4 size="sm" color="primary">
            SM
          </ButtonV4>
          <ButtonV4 size="md" color="primary">
            MD
          </ButtonV4>
          <ButtonV4 size="lg" color="primary">
            LG
          </ButtonV4>
          <ButtonV4 size="xl" color="primary">
            XL
          </ButtonV4>
        </div>

        {/* Test des états */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <ButtonV4 color="primary">Normal</ButtonV4>
          <ButtonV4 loading color="primary">
            Loading
          </ButtonV4>
          <ButtonV4 disabled color="primary">
            Disabled
          </ButtonV4>
        </div>

        {/* Test avec gestionnaire d'événements */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <ButtonV4
            color="primary"
            onClick={() => alert('ButtonV4 fonctionne!')}
          >
            Cliquez-moi
          </ButtonV4>
          <ButtonV4
            variant="outline"
            color="success"
            onClick={() => console.log('ButtonV4 console log')}
          >
            Console Log
          </ButtonV4>
        </div>

        {/* Comparaison avec Bootstrap */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <h3 style={{ color: '#333', marginBottom: '20px' }}>
            Comparaison Bootstrap vs ButtonV4
          </h3>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h4>Bootstrap</h4>
              <div
                style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}
              >
                <button className="btn btn-primary">Primary</button>
                <button className="btn btn-secondary">Secondary</button>
                <button className="btn btn-success">Success</button>
                <button className="btn btn-danger">Danger</button>
              </div>
            </div>
            <div>
              <h4>ButtonV4 (Mantine)</h4>
              <div
                style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}
              >
                <ButtonV4 color="primary">Primary</ButtonV4>
                <ButtonV4 color="secondary">Secondary</ButtonV4>
                <ButtonV4 color="success">Success</ButtonV4>
                <ButtonV4 color="danger">Danger</ButtonV4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MantineProvider>
  );
};

export default ButtonV4Test;
