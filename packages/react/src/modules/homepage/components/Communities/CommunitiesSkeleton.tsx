import { ButtonSkeleton, Flex, TextSkeleton } from '../../../../components';
import { HomeCard } from '../HomeCard';

const primaryTitleWidths = ['80%', '64%', '88%', '72%', '76%', '68%'];
const secondaryTitleWidths = ['56%', '44%', '60%', '48%', '52%', '40%'];

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
      <HomeCard.Content className="communities-content">
        <Flex gap="16">
          <div className="communities-list">
            {primaryTitleWidths.map((primaryWidth, index) => (
              <div
                key={primaryWidth}
                className="communities-item"
                aria-hidden="true"
              >
                <div
                  className="communities-item-image placeholder rounded"
                  style={{ display: 'block' }}
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
          </div>
        </Flex>
      </HomeCard.Content>
    </HomeCard>
  );
};

CommunitiesSkeleton.displayName = 'CommunitiesSkeleton';

export default CommunitiesSkeleton;
