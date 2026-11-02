import { useEffect, useRef, useState } from 'react';

import { WorkspaceElement } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

import { ButtonBeta, ModalBeta } from '../../../../../components';
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
      if (!resource) {
        throw new Error('Audio record was not saved');
      }
      onSaveSuccess?.(resource);
      toast.success(t('homepage.captationAudio.alert.sucess'));
      onClose();
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
          hideSaveAction
          onRecordUpdated={setRecordURL}
          onNameChange={(name) => setHasName(!!name.trim())}
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
