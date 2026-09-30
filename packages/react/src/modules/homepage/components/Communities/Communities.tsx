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
  canCreateCommunity?: boolean;
}

const Communities = ({
  communitiesList = [],
  handleActionClick,
  canCreateCommunity = false,
}: CommunitiesProps) => {
  const { t } = useTranslation();

  return (
    <HomeCard variant="primary">
      <HomeCard.Header
        actionLabel={
          communitiesList.length > 0 || !canCreateCommunity
            ? t('homepage.communities.actionLabel.seeMore', 'Voir plus')
            : t(
                'homepage.communities.actionLabel.create',
                'Créer une communauté',
              )
        }
        actionRightIcon={<IconArrowRight />}
        onActionClick={handleActionClick}
        title={t('homepage.communities.title', 'Mes communautés')}
      />
      <HomeCard.Content className="communities-content">
        <Flex gap="16">
          {communitiesList.length > 0 ? (
            <div className="communities-list">
              {communitiesList.map((community, index) => (
                <CommunityItem
                  key={index}
                  title={community.title}
                  communityImage={community.communityImage}
                  onActionClick={community.onActionClick}
                  nbNotifications={community.nbNotifications}
                  width="auto"
                />
              ))}
            </div>
          ) : (
            <div className="communities-empty">
              <Image
                src={illuCommunities}
                alt=""
                aria-hidden="true"
                style={{ width: 80, height: 80 }}
              />
              <div className="communities-empty-content">
                {!canCreateCommunity ? (
                  <>
                    <p className="communities-empty-title">
                      {t(
                        'homepage.communities.subtitle.student',
                        'Retrouvez toutes vos communautés ici ! ',
                      )}
                    </p>
                    <p className="communities-empty-description">
                      {t(
                        'homepage.communities.description.student',
                        `Consultez l'onglet "Nouveaux partages" pour découvrir si vous avez été ajouté à une nouvelle communauté.`,
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="communities-empty-title">
                      {t(
                        'homepage.communities.subtitle.teacher',
                        'Réunissez vos élèves avec Communautés !',
                      )}
                    </p>
                    <p className="communities-empty-description">
                      {t(
                        'homepage.communities.description.teacher',
                        `Centralisez et organisez les documents et les ressources pour vos groupes d'élèves.`,
                      )}
                    </p>
                  </>
                )}
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
