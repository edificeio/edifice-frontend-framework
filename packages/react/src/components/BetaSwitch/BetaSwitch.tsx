import { useTranslation } from 'react-i18next';
import { ButtonBeta, Flex, useBreakpoint } from '../..';
import { IconArrowRight } from '../../modules/icons/components';

/**
 * BetaSwitch component displays a banner allowing the user to opt-out
 * from the beta version of the homepage and switch back to the legacy one.
 */
export interface BetaSwitchProps {
  isSwitching?: boolean;
  onSwitchClick?: () => void;
}

export const BetaSwitch = ({
  isSwitching = false,
  onSwitchClick,
}: BetaSwitchProps) => {
  const { t } = useTranslation();
  const { md } = useBreakpoint();

  return (
    <Flex direction={md ? 'row' : 'column'} gap="8" className="beta-switch">
      <p>
        <strong>{t('betaSwitch.title')}</strong>{' '}
        <span>{t('betaSwitch.description')}</span>
      </p>
      <ButtonBeta
        data-testid="beta-switch-button"
        isLoading={isSwitching}
        disabled={isSwitching}
        onClick={onSwitchClick}
        rightIcon={<IconArrowRight />}
      >
        {t('betaSwitch.button')}
      </ButtonBeta>
    </Flex>
  );
};

BetaSwitch.displayName = 'BetaSwitch';

export default BetaSwitch;
