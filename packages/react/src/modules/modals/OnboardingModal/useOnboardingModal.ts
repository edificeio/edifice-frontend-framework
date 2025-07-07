import { useEffect, useState } from 'react';

import { odeServices } from '@edifice.io/client';

// TODO : use new hook usePreference
/**
 * getPreference API
 * @returns check onboarding trash param
 */
const getOnboardingTrash = async (key: string) => {
  const res = await odeServices.conf().getPreference<{ key: boolean }>(key);
  return res;
};

// TODO : use new hook usePreference
/**
 * savePreference API
 * @returns set onboarding trash param
 */
const saveOnboardingTrash = async (key: string) => {
  const result = await odeServices
    .conf()
    .savePreference(key, JSON.stringify({ key: false }));

  return result;
};

export const useOnboardingModal = (id: string) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);

  useEffect(() => {
    (async () => {
      const response: { key: boolean } = await getOnboardingTrash(id);

      if (response) {
        const { key } = response;
        if (key === true) {
          setIsOpen(true);
        }
        setIsOnboarding(key);

        return;
      }
      setIsOnboarding(true);
      setIsOpen(true);
    })();
  }, [id]);

  const handleSavePreference = async () => {
    await saveOnboardingTrash(id);
    setIsOpen(false);
    setIsOnboarding(false);
  };

  return {
    isOpen,
    setIsOpen,
    isOnboarding,
    handleSavePreference,
  };
};
