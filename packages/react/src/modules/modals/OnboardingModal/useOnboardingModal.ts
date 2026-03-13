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
        if (applyDisplayRule) {
          const { display, nextState } = applyDisplayRule(response.key);
          setIsOpen(display);
          setIsOnboarding(display);
          state.current = nextState;
        } else {
          if (response.key === true) setIsOpen(true);
          setIsOnboarding(!!response.key);
          state.current = undefined;
        }
      } else {
        setIsOpen(true);
        setIsOnboarding(true);
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
