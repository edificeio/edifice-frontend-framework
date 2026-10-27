import { useEffect, useRef, useState } from 'react';

import { WorkspaceElement } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

import {
  ButtonBeta,
  Label,
  ModalBeta,
  ToolbarItem,
} from '../../../../../components';
import { IconMic, IconRecord } from '../../../../icons/components';
import { AudioRecorder } from '../../../../multimedia';
import { AudioRecorderRef } from '../../../../multimedia/AudioRecorder/AudioRecorder';
import { useToast } from '../../../../../hooks';

export interface CaptationAudioProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess?: (resource: WorkspaceElement) => void;
}

export function CaptationAudio({
  isOpen,
  onClose,
  onSaveSuccess,
}: CaptationAudioProps) {
  const { t } = useTranslation();
  const recorderRef = useRef<AudioRecorderRef>(null);
  const [recordURL, setRecordURL] = useState<string>();
  const [hasName, setHasName] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (isOpen) setHasName(true);
  }, [isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const resource = await recorderRef.current?.save();
      if (resource) {
        onSaveSuccess?.(resource);
        onClose();
      }
      toast.success(t('homepage.captationAudio.alert.sucess'));
    } catch (err) {
      toast.error(t('homepage.captationAudio.alert.error'));
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ModalBeta
      id="captation-audio-modal"
      isOpen={isOpen}
      size="xl"
      onModalClose={onClose}
    >
      <ModalBeta.Header onModalClose={onClose}>
        {t('homepage.captationAudio.modal.title')}
      </ModalBeta.Header>
      <ModalBeta.Body>
        <AudioRecorder
          ref={recorderRef}
          className="captation-audio"
          hideSaveAction
          onRecordUpdated={setRecordURL}
          nameFormControlClassName="mb-16"
          nameLabel={
            <Label leftIcon={<IconMic width={18} height={18} />}>
              {t('homepage.captationAudio.name.label')}
            </Label>
          }
          nameInputProps={{
            size: 'lg',
            maxLength: 80,
            showCounter: true,
            placeholder: t('homepage.captationAudio.name.placeholder'),
            onChange: (event) => setHasName(!!event.target.value.trim()),
          }}
          customizeToolbarItems={(items) =>
            toCaptationToolbarItems(items, {
              record: t('homepage.captationAudio.custom.toolbar.record'),
              recordPause: t(
                'homepage.captationAudio.custom.toolbar.recordPause',
              ),
              play: t('homepage.captationAudio.custom.toolbar.play'),
              playPause: t('homepage.captationAudio.custom.toolbar.playPause'),
              stop: t('homepage.captationAudio.custom.toolbar.stop'),
              reset: t('homepage.captationAudio.custom.toolbar.reset'),
            })
          }
        />
      </ModalBeta.Body>
      <ModalBeta.Footer>
        <ButtonBeta
          type="button"
          variant="ghost"
          color="tertiary"
          data-testid="captation-audio-button-cancel"
          onClick={onClose}
        >
          {t('homepage.captationAudio.cancel')}
        </ButtonBeta>
        <ButtonBeta
          type="button"
          isLoading={isSaving}
          disabled={!recordURL || !hasName || isSaving}
          data-testid="captation-audio-button-save"
          onClick={handleSave}
        >
          {t('homepage.captationAudio.save')}
        </ButtonBeta>
      </ModalBeta.Footer>
    </ModalBeta>
  );
}

/**
 * Adapts the AudioRecorder toolbar to the design:
 * labelled record/playback/reset buttons and no divider between record
 * and playback.
 */
function toCaptationToolbarItems(
  items: ToolbarItem[],
  labels: Record<
    'record' | 'recordPause' | 'play' | 'playPause' | 'stop' | 'reset',
    string
  >,
): ToolbarItem[] {
  const firstDividerIndex = items.findIndex((item) => item.type === 'divider');

  return items
    .filter((_, index) => index !== firstDividerIndex)
    .map((item) => {
      if (item.type !== 'icon' || !item.name || !(item.name in labels)) {
        return item;
      }

      const isRecord = item.name === 'record';

      return {
        type: 'button',
        name: item.name,
        visibility: item.visibility,
        props: {
          ...item.props,
          icon: undefined,
          variant: 'ghost',
          color: isRecord ? 'danger' : item.props.color,
          leftIcon: isRecord ? <IconRecord /> : item.props.icon,
          children: item.props.disabled
            ? undefined
            : labels[item.name as keyof typeof labels],
        },
      };
    });
}
