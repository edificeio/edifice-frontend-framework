import { UsefulLink } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

import illuEmptyUsefulLinks from '@edifice.io/bootstrap/dist/images/homepage/illu-empty-useful-links.png';
import { Flex, Image, LinkPill } from '../../../../components';
import { IconEdit } from '../../../icons/components';
import HomeCard from '../HomeCard/HomeCard';

export interface UsefulLinksProps {
  links: UsefulLink[];
  onEditClick: () => void;
}

export function UsefulLinks({ links, onEditClick }: UsefulLinksProps) {
  const { t } = useTranslation();

  return (
    <HomeCard variant="primary">
      <HomeCard.Header
        title={t('homepage.usefulLinks.title', 'Liens utiles')}
        actionLabel={t('homepage.usefulLinks.edit', 'Éditer')}
        actionLeftIcon={<IconEdit />}
        onActionClick={onEditClick}
      />
      <HomeCard.Content>
        {links.length === 0 ? (
          <div className="useful-links-widget-empty">
            <Image
              src={illuEmptyUsefulLinks}
              alt=""
              aria-hidden="true"
              style={{ width: 160, height: 87 }}
            />
            <p className="useful-links-widget-empty-text">
              {t(
                'homepage.usefulLinks.empty',
                'Gardez à portée de main les sites web que vous utilisez souvent !',
              )}
            </p>
          </div>
        ) : (
          <Flex direction="column" gap="8">
            {links.map((link) => (
              <LinkPill key={link.id} href={link.url} label={link.name} />
            ))}
          </Flex>
        )}
      </HomeCard.Content>
    </HomeCard>
  );
}
