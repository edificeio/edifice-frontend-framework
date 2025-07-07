import { ComponentPropsWithoutRef, type ReactNode } from 'react';

import clsx from 'clsx';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { Alert, Button } from '..';
import { useCantoo, useZendeskGuide } from '../../hooks';
import { useCookiesConsent } from '../../hooks/useCookiesConsent';
import { useEdificeTheme } from '../../providers/EdificeThemeProvider/EdificeThemeProvider.hook';
import Header from './components/Header';

export interface LayoutProps extends ComponentPropsWithoutRef<any> {
  /**  Main content of an application */
  children: ReactNode;
  /** Full screen mode without header component  */
  headless?: boolean;
  /** Control white background - defaults to true */
  whiteBg?: boolean;
  /** Additional class name */
  className?: string;
}

export const Layout = ({
  children,
  headless = false,
  whiteBg = true,
  className,
  ...restProps
}: LayoutProps) => {
  const { theme } = useEdificeTheme();

  const { t } = useTranslation();

  const {
    showCookiesConsent,
    handleConsultCookies,
    handleCloseCookiesConsent,
  } = useCookiesConsent();

  useZendeskGuide();

  useCantoo();

  const classes = clsx(
    'd-flex flex-column',
    {
      'bg-white': whiteBg,
      'container-fluid': !headless,
      'rounded-4 border': theme?.is1d && !headless,
      'mt-24': theme?.is1d && !headless,
    },
    className,
  );

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
