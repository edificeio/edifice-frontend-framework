import { ButtonSkeleton, Flex, TextSkeleton } from '../../../../components';
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
        <TextSkeleton size="lg" className="col-5" />
        <ButtonSkeleton
          aria-hidden="true"
          size="sm"
          className="px-24"
          color="tertiary"
        />
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
              <div
                className="communities-item-image placeholder rounded"
                style={{ display: 'block', aspectRatio: '1 / 1' }}
              />
              <Flex direction="column" gap="4" className="mt-8">
                <div style={{ width: primaryWidth, alignSelf: 'center' }}>
                  <TextSkeleton className="col-12" size="sm" />
                </div>
                <div
                  style={{
                    width: secondaryTitleWidths[index],
                    alignSelf: 'center',
                  }}
                >
                  <TextSkeleton className="col-12" size="sm" />
                </div>
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
