import { type IWebApp } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

import illuEmptyFavorite from '@edifice.io/bootstrap/dist/images/homepage/illu-empty-favorite.svg';
import { AppIcon, Flex } from '../../../../components';
import { IconArrowRight } from '../../../icons/components';
import HomeCard from '../HomeCard/HomeCard';

export interface FavoritesProps {
  apps: IWebApp[];
  onSeeAllClick?: () => void;
}

export function Favorites({
  apps,
  onSeeAllClick = () => window.open('/welcome', '_self'),
}: FavoritesProps) {
  const { t } = useTranslation();

  const getAppName = (app: IWebApp): string =>
    app.prefix && app.prefix.length > 1
      ? t(app.prefix.substring(1))
      : t(app.displayName) || '';

  return (
    <HomeCard variant="secondary">
      <HomeCard.Header
        title={t('homepage.favorites.title', 'Favoris')}
        actionLabel={t('homepage.favorites.all', 'Mes applis')}
        onActionClick={onSeeAllClick}
        actionRightIcon={<IconArrowRight />}
      />
      <HomeCard.Content>
        <div className="favorites-content">
          {apps.length === 0 ? (
            <Flex align="center" gap="12">
              <img src={illuEmptyFavorite} alt="" width={80} height={80} />
              <span className="favorites-empty-text">
                {t(
                  'homepage.favorites.empty',
                  'Ajouter des applications à vos favoris pour les retrouver ici et y accéder rapidement !',
                )}
              </span>
            </Flex>
          ) : (
            <Flex wrap="wrap" gap="16">
              {apps.slice(0, 6).map((app) => {
                const appName = getAppName(app);
                const opensInNewTab = app.isExternal || app.target === '_blank';
                return (
                  <a
                    key={app.name}
                    href={app.address}
                    aria-label={appName}
                    title={appName}
                    target={opensInNewTab ? '_blank' : undefined}
                    rel={opensInNewTab ? 'noopener noreferrer' : undefined}
                  >
                    <AppIcon app={app} size="40" variant="square" />
                  </a>
                );
              })}
            </Flex>
          )}
        </div>
      </HomeCard.Content>
    </HomeCard>
  );
}
