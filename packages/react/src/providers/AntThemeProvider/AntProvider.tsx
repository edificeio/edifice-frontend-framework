import { ConfigProvider } from 'antd';
import React from 'react';
import { antTheme } from './antThemeConfig';
import './antThemeOverride.css';
import { useEdificeClient } from '../EdificeClientProvider/EdificeClientProvider.hook';
import { Locale } from 'antd/es/locale';

import frFR from 'antd/locale/fr_FR';
import deDE from 'antd/locale/de_DE';
import esES from 'antd/locale/es_ES';
import itIT from 'antd/locale/it_IT';
import ptPT from 'antd/locale/pt_PT';

const antdLocaleMap: Record<string, Locale> = {
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
 * Provider for Ant Design that integrates the custom theme
 * with Edifice's existing design system
 */
export const AntProvider: React.FC<AntProviderProps> = ({ children }) => {
  const { currentLanguage } = useEdificeClient();
  const locale = currentLanguage
    ? (antdLocaleMap[currentLanguage] ?? frFR)
    : frFR;
  return (
    <ConfigProvider theme={antTheme} locale={locale}>
      {children}
    </ConfigProvider>
  );
};

export default AntProvider;
