import { useCallback, useState } from 'react';

import { odeServices } from '@edifice.io/client';
import { Editor } from '@tiptap/react';

/**
 * Custom hook to manage speech synthetisis.
 * @returns {
 * `isActivated`: truthy boolean when speech synthetisis is activated,
 * `toggle`: an imperative function to toggle the `isActivated` value,
 * }
 */
export const useSpeechSynthetisis = (editor: Editor | null) => {
  const [isActivated, setActivated] = useState<boolean>(false);

  const toggle = useCallback(() => {
    if (isActivated) {
      editor?.commands.stopSpeechSynthesis();
      setActivated(false);
      return false;
    } else {
      odeServices.data().trackSpeechAndText('TTS');
      const speech = editor?.commands.startSpeechSynthesis() || false;
      setActivated(speech);
      return speech;
    }
  }, [editor?.commands, isActivated]);

  return {
    isActivated,
    toggle,
  };
};
