import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Flex, Skeleton, VisuallyHidden } from '../../../../components';

const SKELETON_LINES = 2;
const SKELETON_MEDIA_COUNT = 2;

const LastInfosSkeletonCard = ({
  withMedia = false,
}: {
  withMedia?: boolean;
}) => (
  <article className="last-infos-card last-infos-card--skeleton">
    <header className="last-infos-card-header">
      <Flex
        gap="8"
        align="center"
        justify="start"
        fill
        className="last-infos-card-thread"
      >
        <Skeleton tone="strong" className="last-infos-card__icon-skeleton" />
        <Skeleton
          className={clsx('last-infos-card__thread-skeleton', {
            'last-infos-card__thread-skeleton--wide': !withMedia,
          })}
        />
      </Flex>
    </header>

    <Flex gap="4" direction="column" className="last-infos-card-content">
      <div className="last-infos-card-title last-infos-card__lines-skeleton">
        {Array.from({ length: SKELETON_LINES }, (_, index) => (
          <Skeleton
            key={index}
            tone="strong"
            className="last-infos-card__line-skeleton"
          />
        ))}
      </div>

      <div className="last-infos-card-excerpt last-infos-card__lines-skeleton">
        {Array.from({ length: SKELETON_LINES }, (_, index) => (
          <Skeleton key={index} className="last-infos-card__line-skeleton" />
        ))}
      </div>

      {withMedia && (
        <div className="last-infos-card__media-skeleton">
          {Array.from({ length: SKELETON_MEDIA_COUNT }, (_, index) => (
            <Skeleton
              key={index}
              variant="block"
              tone="strong"
              className="last-infos-card__media-skeleton-tile"
            />
          ))}
        </div>
      )}
    </Flex>
  </article>
);

const LastInfosSkeleton = () => {
  const { t } = useTranslation();

  return (
    <div className="last-infos-list-body" role="status" aria-busy="true">
      <VisuallyHidden>{t('homepage.widget.loading')}</VisuallyHidden>
      <LastInfosSkeletonCard withMedia={true} />
      <LastInfosSkeletonCard />
      <LastInfosSkeletonCard withMedia={true} />
      <LastInfosSkeletonCard />
    </div>
  );
};

LastInfosSkeleton.displayName = 'LastInfosSkeleton';

export default LastInfosSkeleton;
