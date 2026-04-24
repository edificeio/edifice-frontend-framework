import { useTranslation } from 'react-i18next';
import { Button, Flex } from '../../../..';

/**
 * BetaSwitch component displays a banner allowing the user to opt-out
 * from the beta version of the homepage and switch back to the legacy one.
 */
export interface BetaSwitchProps {
  isSwitching?: boolean;
  onSwitchClick?: () => void;
}

const BetaSwitch = ({
  isSwitching = false,
  onSwitchClick,
}: BetaSwitchProps) => {
  const { t } = useTranslation();
  // const { lg } = useBreakpoint();

  return (
    <div className="beta-switch">
      <Flex direction="row">
        <p>
          <strong>{t('betaSwitch.title')}</strong> {t('betaSwitch.description')}
        </p>
        <Button
          data-testid="beta-switch-button"
          isLoading={isSwitching}
          disabled={isSwitching}
          onClick={onSwitchClick}
        >
          {t('betaSwitch.button')}
        </Button>
      </Flex>
    </div>
  );
};

BetaSwitch.displayName = 'BetaSwitch';

export default BetaSwitch;
