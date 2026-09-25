import { type IWebApp } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

import illuEmptyFavorite from '@edifice.io/bootstrap/dist/images/homepage/illu-empty-favorite.svg';
import { AppIcon, Flex } from '../../../../components';

// Matches the "2 rows of 5" layout from the design (10 favorites max).
const MAX_VISIBLE_APPS = 10;

const appToOpenOnBlank = ['Administration'];

export const MyAppsPopoverFooter = () => {
  const { t } = useTranslation();
  return (
    <a
      href="/welcome"
      className="link"
      data-testid="header-my-apps-popover-more"
    >
      {t('plus')}
    </a>
  );
};

export const MyAppsPopoverBody = ({
  bookmarkedApps,
}: {
  bookmarkedApps: IWebApp[] | undefined;
}) => {
  const { t } = useTranslation();

  const getAppName = (app: IWebApp): string =>
    app.prefix && app.prefix.length > 1
      ? t(app.prefix.substring(1))
      : t(app.displayName) || '';

  if (!bookmarkedApps?.length) {
    return (
      <Flex direction="column" align="center" gap="8">
        <img src={illuEmptyFavorite} alt="" width={50} height={50} />
        <span className="my-apps-popover-empty-text text-center">
          {t(
            'homepage.header.myapps.empty',
            'Ajoutez et retrouvez ici vos apps favorites !',
          )}
        </span>
      </Flex>
    );
  }

  return (
    <div className="my-apps-popover-grid" data-testid="header-my-apps-popover">
      {bookmarkedApps.slice(0, MAX_VISIBLE_APPS).map((app, index) => {
        const opensInNewTab =
          appToOpenOnBlank.includes(app.name) ||
          app.isExternal ||
          app.target === '_blank';
        const appName = getAppName(app);
        return (
          <a
            key={index}
            href={app.address}
            title={appName}
            aria-label={appName}
            className="my-apps-popover-item"
            data-testid="header-my-apps-popover-item"
            target={opensInNewTab ? '_blank' : undefined}
            rel={opensInNewTab ? 'noopener noreferrer' : undefined}
          >
            <AppIcon app={app} size="32" />
          </a>
        );
      })}
    </div>
  );
};
