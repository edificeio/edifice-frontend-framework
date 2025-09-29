import React from 'react';
import { MantineProvider as MantineProviderBase } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { mantineTheme } from '../theme/mantine-theme';
import '../styles/mantine.css';

interface MantineProviderProps {
  children: React.ReactNode;
}

/**
 * Provider Mantine qui s'intègre avec l'architecture Edifice
 * Fournit le thème personnalisé et les fonctionnalités Mantine
 */
export const MantineProvider: React.FC<MantineProviderProps> = ({
  children,
}) => {
  return (
    <MantineProviderBase theme={mantineTheme}>
      <ModalsProvider>
        <Notifications position="top-right" />
        {children}
      </ModalsProvider>
    </MantineProviderBase>
  );
};

export default MantineProvider;
