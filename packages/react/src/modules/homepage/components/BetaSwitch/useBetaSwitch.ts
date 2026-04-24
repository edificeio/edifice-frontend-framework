import { odeServices } from '@edifice.io/client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../..';

type UserPrefs = { homePage: { betaEnabled: boolean } | null };

function deactivateHomepage() {
  return odeServices.http().put<UserPrefs>('/userbook/api/preferences', {
    homePage: { betaEnabled: false },
  });
}

export function useBetaSwitch() {
  const { t } = useTranslation();
  const toast = useToast();
  const [isSwitching, setIsSwitching] = useState(false);

  const onSwitchClick = async () => {
    setIsSwitching(true);

    try {
      await deactivateHomepage();
      window.location.reload();
    } catch {
      toast.error(t('betaSwitch.error'));
      setIsSwitching(false);
    }
  };

  return {
    isSwitching,
    onSwitchClick,
  };
}
