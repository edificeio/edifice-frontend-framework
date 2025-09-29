import React from 'react';
import { ButtonV4 } from './ButtonV4';
import { MantineProvider } from '../../providers/MantineProvider';

/**
 * Démonstration simple de ButtonV4 avec styles Mantine
 */
export const ButtonV4Demo: React.FC = () => {
  return (
    <MantineProvider>
      <div
        style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1
          style={{
            color: 'white',
            textAlign: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            marginBottom: '20px',
          }}
        >
          🎉 ButtonV4 avec Mantine
        </h1>

        <p
          style={{
            color: 'white',
            textAlign: 'center',
            fontSize: '1.2rem',
            marginBottom: '40px',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          Composant moderne avec styles intégrés
        </p>

        {/* Test des variants avec styles modernes */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '30px',
          }}
        >
          <ButtonV4 variant="filled" color="primary" size="lg">
            ✨ Filled Primary
          </ButtonV4>
          <ButtonV4 variant="outline" color="primary" size="lg">
            🔲 Outline Primary
          </ButtonV4>
          <ButtonV4 variant="light" color="primary" size="lg">
            💡 Light Primary
          </ButtonV4>
          <ButtonV4 variant="gradient" color="primary" size="lg">
            🌈 Gradient Primary
          </ButtonV4>
        </div>

        {/* Test des couleurs */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '30px',
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
            marginBottom: '30px',
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
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '30px',
          }}
        >
          <ButtonV4 color="primary">Normal</ButtonV4>
          <ButtonV4 loading color="primary">
            Loading
          </ButtonV4>
          <ButtonV4 disabled color="primary">
            Disabled
          </ButtonV4>
        </div>

        {/* Test avec gestionnaire d'événements */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <ButtonV4
            color="primary"
            size="lg"
            onClick={() => alert('🎉 ButtonV4 fonctionne parfaitement!')}
          >
            🚀 Cliquez-moi
          </ButtonV4>
          <ButtonV4
            variant="outline"
            color="success"
            size="lg"
            onClick={() => console.log('ButtonV4 console log')}
          >
            📝 Console Log
          </ButtonV4>
        </div>

        {/* Message de succès */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3 style={{ color: 'white', margin: '0 0 10px 0' }}>
            ✅ Intégration Mantine Réussie !
          </h3>
          <p style={{ color: 'white', margin: '0', opacity: 0.9 }}>
            ButtonV4 utilise maintenant les styles Mantine avec votre thème
            personnalisé
          </p>
        </div>
      </div>
    </MantineProvider>
  );
};

export default ButtonV4Demo;
