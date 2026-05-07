import { useTranslation } from 'react-i18next';
import { ButtonBeta, Flex, useBreakpoint } from '../..';

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
  const { md, sm } = useBreakpoint();

  return (
    <div className="beta-switch">
      <Flex direction={sm ? 'row' : 'column'} gap="8">
        <p>
          <strong>{t('betaSwitch.title')}</strong>{' '}
          {md && <span>{t('betaSwitch.description')}</span>}
        </p>
        <ButtonBeta
          data-testid="beta-switch-button"
          isLoading={isSwitching}
          disabled={isSwitching}
          onClick={onSwitchClick}
        >
          {t('betaSwitch.button')}
        </ButtonBeta>
      </Flex>
    </div>
  );
};

BetaSwitch.displayName = 'BetaSwitch';

export default BetaSwitch;
