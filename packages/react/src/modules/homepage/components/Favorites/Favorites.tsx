import { type IWebApp } from '@edifice.io/client';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import illuEmptyFavorite from '@edifice.io/bootstrap/dist/images/homepage/illu-empty-favorite.svg';
import {
  AppIcon,
  Flex,
  Skeleton,
  VisuallyHidden,
} from '../../../../components';
import { IconArrowRight } from '../../../icons/components';
import HomeCard from '../HomeCard/HomeCard';

const SKELETON_APP_COUNT = 6;

export interface FavoritesProps {
  apps: IWebApp[];
  onSeeAllClick?: () => void;
  isLoading?: boolean;
}

export function Favorites({
  apps,
  onSeeAllClick = () => window.open('/welcome', '_self'),
  isLoading = false,
}: FavoritesProps) {
  const { t } = useTranslation();

  const getAppName = useCallback(
    (app: IWebApp): string =>
      app.prefix && app.prefix.length > 1
        ? t(app.prefix.substring(1))
        : t(app.displayName) || '',
    [t],
  );

  const visibleApps = apps.filter((app) => app.display !== false);

  if (isLoading) {
    return (
      <HomeCard variant="secondary" role="status" aria-busy="true">
        <VisuallyHidden>{t('homepage.widget.loading')}</VisuallyHidden>
        <div className="home-card-header favorites__header-skeleton">
          <div className="home-card-header-title">
            <Skeleton className="favorites__title-skeleton" />
          </div>
          <Skeleton
            variant="pill"
            tone="strong"
            className="home-card-header-action favorites__button-skeleton"
          />
        </div>
        <HomeCard.Content>
          <div className="favorites-content">
            <div className="favorites__apps-skeleton">
              {Array.from({ length: SKELETON_APP_COUNT }, (_, index) => (
                <Skeleton
                  key={index}
                  variant="block"
                  className="favorites__app-skeleton"
                />
              ))}
            </div>
          </div>
        </HomeCard.Content>
      </HomeCard>
    );
  }

  return (
    <HomeCard variant="secondary">
      <HomeCard.Header
        title={t('homepage.favorites.title')}
        actionLabel={t('homepage.favorites.all')}
        onActionClick={onSeeAllClick}
        actionRightIcon={<IconArrowRight />}
      />
      <HomeCard.Content>
        <div className="favorites-content">
          {visibleApps.length === 0 ? (
            <Flex align="center" gap="12">
              <img src={illuEmptyFavorite} alt="" width={50} height={50} />
              <span className="favorites-empty-text">
                {t('homepage.favorites.empty')}
              </span>
            </Flex>
          ) : (
            <Flex wrap="wrap" gap="8 16">
              {visibleApps.map((app) => {
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
