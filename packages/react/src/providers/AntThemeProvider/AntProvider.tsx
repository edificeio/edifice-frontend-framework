import { ConfigProvider } from 'antd';
import React from 'react';
import { antTheme } from './antThemeConfig';
import './antThemeOverride.css';

// Import Ant Design locales
import frFR from 'antd/locale/fr_FR';
import deDE from 'antd/locale/de_DE';
import esES from 'antd/locale/es_ES';
import itIT from 'antd/locale/it_IT';
import ptPT from 'antd/locale/pt_PT';
import { useEdificeClient } from '../EdificeClientProvider/EdificeClientProvider.hook';

const antdLocaleMap: Record<string, any> = {
  fr: frFR,
  de: deDE,
  es: esES,
  it: itIT,
  pt: ptPT,
};
interface AntProviderProps {
  children: React.ReactNode;
}

/**
 * Provider pour Ant Design qui intègre le thème personnalisé
 * avec le système de design existant d'Edifice
 */
export const AntProvider: React.FC<AntProviderProps> = ({ children }) => {
  const { currentLanguage } = useEdificeClient();
  return (
    <ConfigProvider
      theme={antTheme}
      locale={currentLanguage && antdLocaleMap[currentLanguage]}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntProvider;
