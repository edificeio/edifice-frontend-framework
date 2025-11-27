import { ConfigProvider } from 'antd';
import React from 'react';
import { antTheme } from './antThemeConfig';
import './antThemeOverride.css';

interface AntProviderProps {
  children: React.ReactNode;
}

/**
 * Provider pour Ant Design qui intègre le thème personnalisé
 * avec le système de design existant d'Edifice
 */
export const AntProvider: React.FC<AntProviderProps> = ({ children }) => {
  return <ConfigProvider theme={antTheme}>{children}</ConfigProvider>;
};

export default AntProvider;
