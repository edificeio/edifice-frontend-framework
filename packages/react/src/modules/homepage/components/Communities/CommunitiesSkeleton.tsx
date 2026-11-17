import { useTranslation } from 'react-i18next';
import { Flex, Skeleton, VisuallyHidden } from '../../../../components';
import { HomeCard } from '../HomeCard';

// Minimum column count of `.communities-list`: the grid only adds a column
// when an item fills it, so more items than that would lay out wider grids
// than a user with fewer communities gets once loaded.
const SKELETON_ITEM_COUNT = 4;

/**
 * Loading placeholder for the Communities card.
 *
 * It reuses the wrappers and classes of `HomeCard.Header`, `Communities` and
 * `CommunityItem`, and swaps each content slot for a `Skeleton` block. The
 * title is static, so it is rendered as is.
 */
const CommunitiesSkeleton = () => {
  const { t } = useTranslation();

  return (
    <HomeCard
      variant="primary"
      role="status"
      aria-busy="true"
      data-testid="communities-skeleton"
    >
      <VisuallyHidden>{t('homepage.widget.loading')}</VisuallyHidden>
      <Flex
        align="center"
        justify="between"
        gap="8"
        wrap="wrap"
        className="home-card-header"
      >
        <h3 className="home-card-header-title">
          {t('homepage.communities.title')}
        </h3>
        <Skeleton
          variant="pill"
          className="home-card-header-action communities__action-skeleton"
        />
      </Flex>
      <HomeCard.Content className="communities-content">
        <Flex gap="16">
          <div className="communities-list">
            {Array.from({ length: SKELETON_ITEM_COUNT }, (_, index) => (
              <div key={index} className="communities-item">
                <Skeleton
                  variant="block"
                  tone="strong"
                  className="communities-item-image"
                />
                <p className="communities-item-title">
                  <Skeleton className="communities__item-title-skeleton" />
                </p>
              </div>
            ))}
          </div>
        </Flex>
      </HomeCard.Content>
    </HomeCard>
  );
};

CommunitiesSkeleton.displayName = 'CommunitiesSkeleton';

export default CommunitiesSkeleton;
