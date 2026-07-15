import illuCommunities from '@edifice.io/bootstrap/dist/images/homepage/illu-communities.svg';
import { useTranslation } from 'react-i18next';
import { Flex } from '../../../../components/Flex/index';
import { Image } from '../../../../components/Image/index';
import { IconArrowRight } from '../../../icons/components';
import { HomeCard } from '../HomeCard';
import CommunityItem, { CommunityItemProps } from './CommunityItem';

export interface CommunitiesProps {
  communitiesList?: CommunityItemProps[];
  handleActionClick: () => void;
}

const Communities = ({
  communitiesList = [],
  handleActionClick,
}: CommunitiesProps) => {
  const { t } = useTranslation();

  return (
    <HomeCard variant="primary">
      <HomeCard.Header
        actionLabel={
          communitiesList.length > 0
            ? t('homepage.widget.communities.actionLabel.seeMore')
            : t('homepage.widget.communities.actionLabel.create')
        }
        actionRightIcon={<IconArrowRight />}
        onActionClick={handleActionClick}
        title={t('homepage.widget.communities.title')}
      />
      <HomeCard.Content>
        <Flex gap="16">
          {communitiesList.length > 0 ? (
            communitiesList.map((community, index) => (
              <CommunityItem
                key={index}
                title={community.title}
                communityImage={community.communityImage}
                onActionClick={community.onActionClick}
                nbNotifications={community.nbNotifications}
              />
            ))
          ) : (
            <div className="communities-empty">
              <Image
                src={illuCommunities}
                alt=""
                aria-hidden="true"
                style={{ width: 80, height: 80 }}
              />
              <div className="communities-empty-content">
                <p className="communities-empty-title">
                  {t(
                    'homepage.communities.subtitle',
                    'Créez votre première communauté pour animer votre classe !',
                  )}
                </p>
                <p className="communities-empty-description">
                  {t(
                    'homepage.communities.description',
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

Communities.displayName = 'Communities';

export default Communities;
