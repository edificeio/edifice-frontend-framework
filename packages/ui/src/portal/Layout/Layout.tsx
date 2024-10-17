import { ComponentPropsWithoutRef, type ReactNode } from 'react';

import clsx from 'clsx';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import Alert from '../../components/Alert/Alert';
import Button from '../../components/Button/Button';
import { useCantoo, useOdeTheme, useZendeskGuide } from '../../core';
import useCookiesConsent from '../../core/useCookiesConsent/useCookiesConsent';
import Header from '../Header/Header';

export interface LayoutProps extends ComponentPropsWithoutRef<any> {
  /**  Main content of an application */
  children: ReactNode;
  /** Full screen mode without header component  */
  headless?: boolean;
}

const Layout = ({ children, headless = false, ...restProps }: LayoutProps) => {
  const { theme } = useOdeTheme();

  const { t } = useTranslation();

  const {
    showCookiesConsent,
    handleConsultCookies,
    handleCloseCookiesConsent,
  } = useCookiesConsent();

  useZendeskGuide();

  useCantoo();

  const classes = clsx('d-flex flex-column bg-white', {
    'container-fluid': !headless,
    'rounded-4 border': theme?.is1d && !headless,
    'mt-24': theme?.is1d && !headless,
  });

  const renderHeader = !headless ? (
    <Header is1d={theme?.is1d} src={theme?.basePath} />
  ) : null;

  const renderCookies = showCookiesConsent && (
    <Alert
      type="info"
      className="m-12 rgpd"
      isConfirm={true}
      position="bottom-right"
      button={
        <Button color="tertiary" variant="ghost" onClick={handleConsultCookies}>
          {t('rgpd.cookies.banner.button.consult')}
        </Button>
      }
      onClose={handleCloseCookiesConsent}
    >
      {t('rgpd.cookies.banner.text1')}
    </Alert>
  );

  const renderToaster = (
    <Toaster
      containerClassName="toaster-container"
      toastOptions={{
        position: 'top-right',
      }}
    />
  );

  return (
    <>
      {renderHeader}

      <main className={classes} {...restProps}>
        {children}
      </main>

      {renderToaster}
      {renderCookies}
    </>
  );
};

Layout.displayName = 'Layout';

export default Layout;
