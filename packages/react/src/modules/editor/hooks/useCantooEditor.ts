import { Editor } from '@tiptap/react';
import { useState } from 'react';
import { useHasWorkflow } from '../../../hooks';

export const useCantooEditor = (editor: Editor | null) => {
  const isAvailable = useHasWorkflow(
    'org.entcore.portal.controllers.PortalController|optionalFeatureCantoo',
  );

  const [speech2textIsActive, setSpeech2textActive] = useState(false);
  const [text2speechIsActive, setText2speechActive] = useState(false);
  const Cantoo = (window as any).Cantoo;
  const toggleSpeech2Text = async () => {
    if (speech2textIsActive) {
      setSpeech2textActive(false);
      try {
        await Cantoo.speech2text.stop();
      } catch (e) {
        console.warn('Error while trying to stop Cantoo (speech2text)', e);
      }
    } else {
      try {
        setSpeech2textActive(true);
        if (await Cantoo.speech2text.isAvailableOnDevice()) {
          if (await Cantoo.speech2text.requestPermission()) {
            await Cantoo.speech2text.start((data: string[]) => {
              editor?.chain().focus().insertContent(data.join(' ')).run();
            }, window.navigator.language);
          } else {
            throw new Error('Permission denied');
          }
        } else {
          throw new Error('Cantoo not available');
        }
      } catch (e) {
        console.warn('Error while trying to use Cantoo (speech2text)', e);
        setSpeech2textActive(false);
      }
    }
  };
  const toggleText2Speech = () => {
    if (text2speechIsActive) {
      setText2speechActive(false);
      window.speechSynthesis.cancel();
    } else {
      try {
        setText2speechActive(true);
        Cantoo.text2speech.readText(editor?.getText());
        Cantoo.text2speech.utter.onend = () => {
          setText2speechActive(false);
        };
      } catch (e) {
        console.warn('Error while trying to use Cantoo (text2speech)', e);
        setText2speechActive(false);
      }
    }
  };
  const formatText = (openModal: () => void) => {
    openModal();
  };
  return {
    isAvailable,
    speech2textIsActive,
    text2speechIsActive,
    toggleSpeech2Text,
    toggleText2Speech,
    formatText,
  };
};
