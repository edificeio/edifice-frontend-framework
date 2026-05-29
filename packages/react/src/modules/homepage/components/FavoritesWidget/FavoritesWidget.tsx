import { type IWebApp } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

import illuEmptyFavorite from '@edifice.io/bootstrap/dist/images/homepage/illu-empty-favorite.svg';
import { AppIcon } from '../../../../components';
import { Flex } from '../../../../components';
import { IconArrowRight } from '../../../icons/components';
import HomeCard from '../HomeCard/HomeCard';

export interface FavoritesWidgetProps {
  apps: IWebApp[];
  onSeeAllClick?: () => void;
}

export function FavoritesWidget({
  apps,
  onSeeAllClick = () => window.open('/welcome', '_self'),
}: FavoritesWidgetProps) {
  const { t } = useTranslation();

  return (
    <HomeCard variant="secondary">
      <HomeCard.Header
        title={t('homepage.widget.favorites.title', 'Favoris')}
        actionLabel={t('homepage.widget.favorites.all', 'Mes applis')}
        onActionClick={onSeeAllClick}
        actionRightIcon={<IconArrowRight />}
      />
      <HomeCard.Content>
        {apps.length === 0 ? (
          <Flex align="center" gap="12">
            <img src={illuEmptyFavorite} alt="" width={80} height={80} />
            <span
              style={{
                fontFamily: 'var(--font-family-body)',
                fontSize: 'var(--primitive-font-size-small)',
                fontWeight: 'var(--font-weight-regular)',
                lineHeight: 'var(--primitive-font-lineheight-2xs)',
              }}
            >
              {t(
                'homepage.widget.favorites.empty',
                'Ajouter des applications à vos favoris pour les retrouver içi et y accéder rapidement !',
              )}
            </span>
          </Flex>
        ) : (
          <Flex wrap="wrap" gap="16">
            {apps.slice(0, 6).map((app) => (
              <a
                key={app.name}
                href={app.address}
                title={app.displayName}
                target={app.isExternal ? '_blank' : undefined}
                rel={app.isExternal ? 'noopener noreferrer' : undefined}
              >
                <AppIcon app={app} size="40" variant="square" />
              </a>
            ))}
          </Flex>
        )}
      </HomeCard.Content>
    </HomeCard>
  );
}
