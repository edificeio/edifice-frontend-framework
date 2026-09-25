import {
  ComponentPropsWithoutRef,
  Suspense,
  lazy,
  type ReactNode,
} from 'react';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Alert } from '..';
import {
  useBackground,
  useCantoo,
  useToast,
  useUiOverride,
  useZendeskGuide,
} from '../../hooks';
import { useCookiesConsent } from '../../hooks/useCookiesConsent';
import { HelpZone } from '../../modules/HelpZone';
import { useEdificeTheme } from '../../providers/EdificeThemeProvider/EdificeThemeProvider.hook';
import { ButtonBeta as Button } from '../ButtonBeta';
import { useOverlay } from '../PageLayout/hook/useOverlay';
import Header from './components/Header';
import HeaderNotificationsOverlay from './components/HeaderNotificationsOverlay';

const HeaderV2 = lazy(
  () => import('../../modules/homepage/components/Header/Header'),
);

function getHeaderColor() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--primitive-blue-400')
    .trim();
}

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
  const override = useUiOverride('layout.header');
  const isHeaderV2 = override?.variant === 'v2';
  // `global` platform override — rollout flag for the new in-product help
  // widget (`HelpZone`), replacing the legacy raw Zendesk widget launcher
  // until the platform opts in (see `useUiOverride`).
  const isEdificeInProductHelp =
    useUiOverride('global')?.variant === 'edifice-in-product';
  const { productOverride, background, isBackgroundImageOverridden } =
    useBackground();
  const { toggleOverlay } = useOverlay();

  const toast = useToast();

  const { t } = useTranslation();

  const {
    showCookiesConsent,
    handleConsultCookies,
    handleCloseCookiesConsent,
  } = useCookiesConsent();

  // Single hook instance shared by both paths — mounting a second instance
  // (e.g. via `HelpZoneContainer`, which calls this hook itself) races
  // against this one on the widget script bootstrap and can leave the
  // second instance's `isReady` stuck at `false`.
  const {
    isReady: isHelpZoneReady,
    isOpen: isHelpZoneOpen,
    open: openHelpZone,
    close: closeHelpZone,
  } = useZendeskGuide(isEdificeInProductHelp ? getHeaderColor() : undefined);

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
    isHeaderV2 ? (
      <Suspense fallback={null}>
        <HeaderV2
          src={theme?.basePath}
          dataProduct={override?.theme}
          onNotificationsClick={toggleOverlay}
        />
      </Suspense>
    ) : (
      <Header is1d={theme?.is1d} src={theme?.basePath} />
    )
  ) : null;

  const renderNotificationsOverlay = !headless && isHeaderV2 && (
    <HeaderNotificationsOverlay />
  );

  const renderCookies = showCookiesConsent && (
    <Alert
      type="info"
      className="m-12 rgpd"
      isConfirm={true}
      position="bottom-right"
      button={
        <Button variant="outline" onClick={handleConsultCookies}>
          {t('rgpd.cookies.banner.button.consult')}
        </Button>
      }
      onClose={handleCloseCookiesConsent}
    >
      {t('rgpd.cookies.banner.text1')}
    </Alert>
  );

  const renderToaster = toast.renderToaster();

  return (
    <div
      data-product={productOverride}
      data-background={theme?.is1d ? undefined : background}
      className={clsx('layout', {
        'layout-has-background-image': isBackgroundImageOverridden,
      })}
    >
      {renderHeader}
      {renderNotificationsOverlay}

      <main className={classes} {...restProps}>
        {children}
      </main>

      {renderToaster}
      {renderCookies}
      {isEdificeInProductHelp && (
        <HelpZone
          isReady={isHelpZoneReady}
          isOpen={isHelpZoneOpen}
          onOpen={openHelpZone}
          onClose={closeHelpZone}
        />
      )}
    </div>
  );
};

Layout.displayName = 'Layout';

export default Layout;
