import { ConfigProvider } from 'antd';
import React from 'react';
import './antThemeOverride.css';
import antdTheme from './antd-theme';

interface AntdProviderProps {
  children: React.ReactNode;
}

/**
 * Provider pour Ant Design qui intègre le thème personnalisé
 * avec le système de design existant d'Edifice
 */
export const AntdProvider: React.FC<AntdProviderProps> = ({ children }) => {
  return <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>;
};

export default AntdProvider;
