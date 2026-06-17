import illuCommunities from '@edifice.io/bootstrap/dist/images/homepage/illu-communities.svg';
import { useTranslation } from 'react-i18next';
import { Flex } from '../../../../components/Flex/index';
import { Image } from '../../../../components/Image/index';
import { IconArrowRight } from '../../../icons/components';
import { HomeCard } from '../HomeCard';
import CommunityCardItem, { CommunityCardItemProps } from './CommunityCardItem';

export interface CommunityCardProps {
  communitiesList?: CommunityCardItemProps[];
}

const CommunityCard = ({ communitiesList = [] }: CommunityCardProps) => {
  const { t } = useTranslation();

  return (
    <HomeCard variant="primary">
      <HomeCard.Header
        actionLabel={t('homepage.widget.community-card.actionLabel')}
        actionRightIcon={<IconArrowRight />}
        onActionClick={() => {}}
        title={t('homepage.widget.community-card.title')}
      />
      <HomeCard.Content>
        <Flex gap="16">
          {communitiesList.length > 0 ? (
            communitiesList.map((community, index) => (
              <CommunityCardItem
                key={index}
                title={community.title}
                communityImage={community.communityImage}
                onActionClick={community.onActionClick}
                nbNotifications={community.nbNotifications}
              />
            ))
          ) : (
            <div className="community-card-empty">
              <Image
                src={illuCommunities}
                alt="No communities available"
                style={{ width: 80, height: 80 }}
              />
              <div className="community-card-empty-content">
                <p className="community-card-empty-title">
                  {t(
                    'homepage.communityCard.subtitle',
                    'Créez votre première communauté pour animez votre classe!',
                  )}
                </p>
                <p className="community-card-empty-description">
                  {t(
                    'homepage.communityCard.descrition',
                    'Vous pouvez centraliser et organiser les documents et les ressources pour vos élèves.',
                  )}
                </p>
              </div>
            </div>
          )}
        </Flex>
      </HomeCard.Content>
    </HomeCard>
  );
};

CommunityCard.displayName = 'CommunityCard';

export default CommunityCard;
