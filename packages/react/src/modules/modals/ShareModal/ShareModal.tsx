import { ReactNode, useRef, useState } from 'react';

import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { Alert, Button, Modal } from '../../../components';
import ShareResources, {
  ShareOptions,
  ShareResourceMutation,
  ShareResourcesRef,
} from './ShareResources';

interface ShareResourceModalProps {
  /** Handle open/close state */
  isOpen: boolean;
  /**
   * Expect resourceId,
   * new rights array (replace shared array),
   * creatorId
   * of a resource */
  shareOptions: ShareOptions;
  /**
   * Use the `shareResource` props when you need to do Optimistic UI
   * otherwise ShareModal handles everything
   * Must use React Query */
  shareResource?: ShareResourceMutation;
  /**
   * To pass any specific app related component (e.g: Blog)
   */
  children?: ReactNode;
  /**
   * onSuccess callback when a resource is successfully shared
   */
  onSuccess: () => void;
  /**
   * onCancel handler to close ShareModal
   */
  onCancel: () => void;
}

export default function ShareResourceModal({
  isOpen,
  shareOptions,
  shareResource,
  children,
  onSuccess,
  onCancel,
}: ShareResourceModalProps) {
  const refShareResources = useRef<ShareResourcesRef>(null);
  const handleShare = () => {
    refShareResources.current?.handleShare();
  };
  const [isSaving, setIsSaving] = useState(false);

  const { t } = useTranslation();

  const onSaving = (isSaving: boolean) => {
    setIsSaving(isSaving);
  };

  return createPortal(
    <Modal id="share_modal" size="lg" isOpen={isOpen} onModalClose={onCancel}>
      <Modal.Header onModalClose={onCancel}>{t('share.title')}</Modal.Header>
      <Modal.Body>
        <Alert type="info" className="mb-16">
          {t('explorer.modal.share.alert.community')}
        </Alert>
        <ShareResources
          shareOptions={shareOptions}
          shareResource={shareResource}
          ref={refShareResources}
          onSuccess={onSuccess}
          onSubmit={onSaving}
          classNameSearchInput="flex-fill"
        />
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          color="tertiary"
          variant="ghost"
          onClick={onCancel}
          disabled={isSaving}
        >
          {t('explorer.cancel')}
        </Button>

        <Button
          type="button"
          color="primary"
          variant="filled"
          isLoading={isSaving}
          onClick={handleShare}
          disabled={isSaving}
        >
          {t('share')}
        </Button>
      </Modal.Footer>
    </Modal>,
    (document.getElementById('portal') as HTMLElement) || document.body,
  );
}
