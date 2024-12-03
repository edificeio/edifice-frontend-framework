import { useEffect, useState } from "react";

import { odeServices } from "@edifice.io/ts-client";

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
  const [isOpen, setIsOpen] = useState(true);
  const [isOnboarding, setIsOnboarding] = useState(false);

  useEffect(() => {
    (async () => {
      const response: { key: boolean } = await getOnboardingTrash(id);

      if (response) {
        const { key } = response;
        setIsOnboarding(key);
        return;
      }
      setIsOnboarding(true);
    })();
  }, [id]);

  const handleSavePreference = async () => {
    await saveOnboardingTrash(id);
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    isOnboarding,
    handleSavePreference,
  };
};
