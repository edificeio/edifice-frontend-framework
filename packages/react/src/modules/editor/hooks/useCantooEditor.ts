import { Editor } from '@tiptap/react';
import { useCallback, useState } from 'react';
import { useHasWorkflow } from '../../../hooks';
import { odeServices } from '@edifice.io/client';

export interface CantooEditor {
  cantooParam: string;
  isAvailable: boolean;
  speech2textIsAvailable: boolean;
  speech2textIsActive: boolean;
  text2speechIsActive: boolean;
  toggleSpeech2Text: () => void;
  toggleText2Speech: () => void;
  toogleSettings: () => void;
  openPositionAdaptText: { right: boolean; bottom: boolean };
  handleCantooAdaptTextPosition: (position: string) => void;
}

export const useCantooEditor = (
  editor: Editor | null,
  cantooParam: string,
): CantooEditor => {
  const Cantoo = (window as any).Cantoo;

  const isAvailable = useHasWorkflow(
    'org.entcore.portal.controllers.PortalController|optionalFeatureCantoo',
  ) as boolean;

  const [speech2textIsActive, setSpeech2textActive] = useState(false);
  const [text2speechIsActive, setText2speechActive] = useState(false);
  const [openPositionAdaptText, setOpenPositionAdaptText] = useState({
    right: false,
    bottom: false,
  });

  const speech2textIsAvailable =
    Cantoo?.speech2text.isAvailableOnDevice() || false;

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
        if (speech2textIsAvailable) {
          if (await Cantoo.speech2text.requestPermission()) {
            cantooStoreEvent('CANTOO_EDITEUR_SPEECH_TO_TEXT');
            await Cantoo.speech2text.start((data: string[]) => {
              editor?.chain().focus().insertContent(data.join(' ')).run();
            }, window.navigator.language);
          } else {
            setSpeech2textActive(false);
            throw new Error(
              'Cantoo speech2text permission denied, please check your browser settings',
            );
          }
        } else {
          setSpeech2textActive(false);
          throw new Error('Cantoo speech2text not available on this device');
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
        cantooStoreEvent('CANTOO_EDITEUR_TEXT_TO_SPEECH');
        Cantoo.text2speech.utter.onend = () => {
          setText2speechActive(false);
        };
      } catch (e) {
        console.warn('Error while trying to use Cantoo (text2speech)', e);
        setText2speechActive(false);
      }
    }
  };

  const handleCantooAdaptTextPosition = (position: string) => {
    // swith cas to handle the position
    switch (position) {
      case 'right':
        if (!openPositionAdaptText.right) {
          cantooStoreEvent('CANTOO_EDITEUR_ADAPT_TEXT');
        }

        setOpenPositionAdaptText((prev) => ({
          bottom: false,
          right: !prev.right,
        }));
        break;
      case 'bottom':
        if (!openPositionAdaptText.bottom) {
          cantooStoreEvent('CANTOO_EDITEUR_ADAPT_TEXT');
        }

        setOpenPositionAdaptText((prev) => ({
          right: false,
          bottom: !prev.bottom,
        }));
        break;
      default:
        break;
    }
  };

  const toogleSettings = () => {
    if (!Cantoo) {
      console.warn('Cantoo not available');
      return;
    }
    Cantoo.openCantooWebConfig();
  };

  const cantooStoreEvent = useCallback(async (eventType: string) => {
    if (eventType.length > 0) {
      const data = { 'event-type': eventType };
      try {
        await odeServices.http().post('/infra/event/web/store', data);
      } catch (e) {
        console.warn('Error while storing event', e);
      }
    }
  }, []);

  return {
    cantooParam,
    isAvailable,
    speech2textIsAvailable,
    speech2textIsActive,
    text2speechIsActive,
    toggleSpeech2Text,
    toggleText2Speech,
    toogleSettings,
    openPositionAdaptText,
    handleCantooAdaptTextPosition,
  };
};
