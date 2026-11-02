import { useEffect, useRef, useState } from 'react';

import { WorkspaceElement } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

import { ButtonBeta, ModalBeta } from '../../../../../components';
import { useToast } from '../../../../../hooks';
import { VideoRecorder } from '../../../../multimedia';
import { VideoRecorderRef } from '../../../../multimedia/VideoRecorder/VideoRecorder';

export interface CaptationVideoProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess?: (resource: WorkspaceElement) => void;
  /** Application code used to upload the video (defaults to `homepage`). */
  appCode?: string;
}

export function CaptationVideo({
  isOpen,
  onClose,
  onSaveSuccess,
  appCode = 'homepage',
}: CaptationVideoProps) {
  const { t } = useTranslation();
  const recorderRef = useRef<VideoRecorderRef>(null);
  const [recordURL, setRecordURL] = useState<string>();
  const [hasName, setHasName] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (isOpen) setHasName(true);
  }, [isOpen]);

  const handleSuccess = (resources: WorkspaceElement[]) => {
    toast.success(t('homepage.captationVideo.save.success'));
    if (resources[0]) onSaveSuccess?.(resources[0]);
    onClose();
  };

  const handleError = (error: string) => {
    toast.error(t('homepage.captationVideo.save.error'));
    console.error(error);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await recorderRef.current?.save();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ModalBeta
      id="captation-video-modal"
      isOpen={isOpen}
      size="xl"
      onModalClose={onClose}
    >
      <ModalBeta.Header onModalClose={onClose}>
        {t('homepage.captationVideo.modal.title')}
      </ModalBeta.Header>
      <ModalBeta.Body>
        <VideoRecorder
          ref={recorderRef}
          appCode={appCode}
          hideSaveAction
          onRecordUpdated={setRecordURL}
          onNameChange={(name) => setHasName(!!name.trim())}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </ModalBeta.Body>
      <ModalBeta.Footer>
        <ButtonBeta
          type="button"
          variant="ghost"
          color="tertiary"
          data-testid="captation-video-button-cancel"
          onClick={onClose}
        >
          {t('homepage.captationVideo.cancel')}
        </ButtonBeta>
        <ButtonBeta
          type="button"
          isLoading={isSaving}
          disabled={!recordURL || !hasName || isSaving}
          data-testid="captation-video-button-save"
          onClick={handleSave}
        >
          {t('homepage.captationVideo.save')}
        </ButtonBeta>
      </ModalBeta.Footer>
    </ModalBeta>
  );
}
