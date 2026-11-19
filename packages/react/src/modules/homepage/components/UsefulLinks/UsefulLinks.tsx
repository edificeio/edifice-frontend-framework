import { UsefulLink } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

import illuEmptyUsefulLinks from '@edifice.io/bootstrap/dist/images/homepage/illu-empty-useful-links.png';
import {
  Flex,
  Image,
  LinkPill,
  Skeleton,
  VisuallyHidden,
} from '../../../../components';
import { IconEdit } from '../../../icons/components';
import HomeCard from '../HomeCard/HomeCard';

export interface UsefulLinksProps {
  links: UsefulLink[];
  onEditClick: () => void;
  isLoading?: boolean;
}

export function UsefulLinks({
  links,
  onEditClick,
  isLoading = false,
}: UsefulLinksProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <HomeCard
        variant="primary"
        className="useful-links-widget--skeleton"
        role="status"
        aria-busy="true"
      >
        <VisuallyHidden>{t('homepage.widget.loading')}</VisuallyHidden>
        <div className="useful-links-widget__header-skeleton">
          <Skeleton className="useful-links-widget__title-skeleton" />
          <Skeleton
            variant="circle"
            tone="strong"
            className="useful-links-widget__button-skeleton"
          />
        </div>
        <Skeleton
          variant="block"
          className="useful-links-widget__content-skeleton"
        />
      </HomeCard>
    );
  }

  return (
    <HomeCard variant="primary">
      <HomeCard.Header
        title={t('homepage.usefulLinks.title')}
        actionLabel={t('homepage.usefulLinks.edit')}
        actionLeftIcon={<IconEdit />}
        onActionClick={onEditClick}
        actionProps={{ 'data-testid': 'usefullinks-button-edit' }}
      />
      <HomeCard.Content>
        {links.length === 0 ? (
          <div className="useful-links-widget__empty">
            <Image
              src={illuEmptyUsefulLinks}
              alt=""
              aria-hidden="true"
              style={{ width: 160, height: 87 }}
            />
            <p className="useful-links-widget__empty-text">
              {t('homepage.usefulLinks.empty')}
            </p>
          </div>
        ) : (
          <Flex direction="column" gap="8">
            {links.map((link) => (
              <LinkPill
                key={link.id}
                href={link.url}
                label={link.name}
                data-testid={`usefullinks-link-${link.id}`}
              />
            ))}
          </Flex>
        )}
      </HomeCard.Content>
    </HomeCard>
  );
}
