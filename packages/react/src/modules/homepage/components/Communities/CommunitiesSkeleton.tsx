import { Flex, Skeleton } from '../../../../components';
import { HomeCard } from '../HomeCard';

const primaryTitleWidths = ['80%', '64%', '88%', '72%'];
const secondaryTitleWidths = ['56%', '44%', '60%', '48%'];

const CommunitiesSkeleton = () => {
  return (
    <HomeCard variant="primary" data-testid="communities-skeleton">
      <Flex
        align="center"
        justify="between"
        gap="8"
        className="home-card-header"
      >
        <Skeleton className="communities-skeleton-title col-5" />
        <Skeleton variant="block" className="communities-skeleton-button" />
      </Flex>
      <HomeCard.Content>
        <Flex gap="16">
          {primaryTitleWidths.map((primaryWidth, index) => (
            <div
              key={primaryWidth}
              className="communities-item"
              style={{ width: '25%' }}
              aria-hidden="true"
            >
              <Skeleton
                variant="block"
                tone="strong"
                className="communities-item-image"
                style={{ aspectRatio: '1 / 1' }}
              />
              <Flex direction="column" gap="4" className="mt-8">
                <Skeleton
                  className="communities-skeleton-line"
                  width={primaryWidth}
                />
                <Skeleton
                  className="communities-skeleton-line"
                  width={secondaryTitleWidths[index]}
                />
              </Flex>
            </div>
          ))}
        </Flex>
      </HomeCard.Content>
    </HomeCard>
  );
};

CommunitiesSkeleton.displayName = 'CommunitiesSkeleton';

export default CommunitiesSkeleton;
