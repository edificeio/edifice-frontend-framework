import { ConfigProvider } from 'antd';
import React from 'react';
import antdTheme from './ant-theme';
import './antThemeOverride.css';

interface AntProviderProps {
  children: React.ReactNode;
}

/**
 * Provider pour Ant Design qui intègre le thème personnalisé
 * avec le système de design existant d'Edifice
 */
export const AntProvider: React.FC<AntProviderProps> = ({ children }) => {
  return <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>;
};

export default AntProvider;
