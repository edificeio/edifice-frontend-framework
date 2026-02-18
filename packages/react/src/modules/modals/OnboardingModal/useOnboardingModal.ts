import { useCallback, useEffect, useRef, useState } from 'react';

import { usePreferences } from '../../../hooks/usePreferences';

export const useOnboardingModal = <T>(
  id: string,
  applyDisplayRule: (previousState?: T) => {
    display: boolean;
    nextState: T;
  },
) => {
  const state = useRef<T | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const { getPreference, savePreference } = usePreferences<{
    key?: T;
  }>(id);

  useEffect(() => {
    (async () => {
      const response = await getPreference();

      if (response) {
        const { key } = response;
        const { display, nextState } = applyDisplayRule(key);
        setIsOpen(display);
        setIsOnboarding(display);
        state.current = nextState;
      } else {
        setIsOnboarding(true);
        setIsOpen(true);
        state.current = undefined;
      }
    })();
  }, []);

  const handleSavePreference = useCallback(async () => {
    await savePreference({ key: state.current });
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
