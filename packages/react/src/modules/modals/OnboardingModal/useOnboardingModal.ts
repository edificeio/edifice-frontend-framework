import { useCallback, useEffect, useRef, useState } from 'react';

import { usePreferences } from '../../../hooks/usePreferences';

export const useOnboardingModal = <T>(
  id: string,
  applyDisplayRule: (previousState?: T) => [boolean, newState: T | undefined],
) => {
  const state = useRef<T | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const { getPreference, savePreference } = usePreferences<{
    key: T;
  }>(id);

  useEffect(() => {
    (async () => {
      const response = await getPreference();

      if (response) {
        const { key } = response;
        const [open, newKeyValue] = applyDisplayRule(key);
        if (open) {
          setIsOpen(true);
        }
        setIsOnboarding(open);
        state.current = newKeyValue;
      } else {
        setIsOnboarding(true);
        setIsOpen(true);
        state.current = undefined;
      }
    })();
  }, [getPreference, applyDisplayRule]);

  const handleSavePreference = useCallback(async () => {
    if (state.current) await savePreference({ key: state.current });
    setIsOpen(false);
    setIsOnboarding(false);
  }, [savePreference, setIsOpen, setIsOnboarding]);

  return {
    isOpen,
    setIsOpen,
    isOnboarding,
    handleSavePreference,
  };
};
