import illuCommunities from '@edifice.io/bootstrap/dist/images/homepage/illu-communities.svg';
import { useMeasure } from '@uidotdev/usehooks';
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

/** Below this container width, only 3 items fit without crowding. */
const NARROW_CONTAINER_WIDTH = 800;
const MAX_ITEMS = 4;
const MAX_ITEMS_NARROW = 3;

const Communities = ({
  communitiesList = [],
  handleActionClick,
}: CommunitiesProps) => {
  const { t } = useTranslation();
  const [containerRef, { width }] = useMeasure<HTMLDivElement>();

  const maxItems =
    width !== null && width < NARROW_CONTAINER_WIDTH
      ? MAX_ITEMS_NARROW
      : MAX_ITEMS;
  const visibleCommunities = communitiesList.slice(0, maxItems);
  const itemWidth = `${100 / maxItems}%`;

  return (
    <HomeCard variant="primary">
      <HomeCard.Header
        actionLabel={
          communitiesList.length > 0
            ? t('homepage.communities.actionLabel.seeMore')
            : t('homepage.communities.actionLabel.create')
        }
        actionRightIcon={<IconArrowRight />}
        onActionClick={handleActionClick}
        title={t('homepage.communities.title')}
      />
      <HomeCard.Content>
        <Flex ref={containerRef} gap="16">
          {visibleCommunities.length > 0 ? (
            visibleCommunities.map((community, index) => (
              <CommunityItem
                key={index}
                title={community.title}
                communityImage={community.communityImage}
                onActionClick={community.onActionClick}
                nbNotifications={community.nbNotifications}
                width={itemWidth}
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
