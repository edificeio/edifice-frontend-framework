import { useCallback, useEffect } from 'react';

export default function useKeyPress(
  callback: () => void,
  keyCodes: string[],
): void {
  const handler = useCallback(
    ({ code }: KeyboardEvent) => {
      if (keyCodes.includes(code)) {
        callback();
      }
    },
    [callback, keyCodes],
  );

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [handler]);
}
