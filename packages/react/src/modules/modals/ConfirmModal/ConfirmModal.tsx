import { Button, Modal, ModalSize } from '../../../components';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export type ConfirmModalVariant = 'yes/no' | 'ok/cancel';

interface ConfirmModalProps {
  /**
   * Variant of text buttons content
   */
  variant?: ConfirmModalVariant;
  /**
   * Modal id (useful when multiple modal on the same page)
   */
  id: string;
  /**
   * Is Modal Open
   */
  isOpen: boolean;
  /**
   * Content of header modal's
   */
  header?: ReactNode;
  /**
   * Content of body modal's
   */
  body?: ReactNode;
  /**
   * Key text translation of confirm button (useTranslation('common'))
   */
  okText?: string;
  /**
   * Key text translation of cancel button (useTranslation('common'))
   */
  koText?: string;
  /**
   * Size of the modal (width)
   */
  size?: ModalSize;
  /**
   * Function to call when success button proceed
   */
  onSuccess?: () => void;
  /**
   * Function to call when closing modal
   */
  onCancel?: () => void;
}

export default function ConfirmModal({
  variant = 'yes/no',
  id,
  isOpen,
  header,
  body,
  okText,
  koText,
  size = 'md',
  onSuccess = () => ({}),
  onCancel = () => ({}),
}: ConfirmModalProps) {
  const { t } = useTranslation();
  const ok = { 'yes/no': t('yes'), 'ok/cancel': t('ok') };
  const ko = { 'yes/no': t('no'), 'ok/cancel': t('cancel') };

  return (
    <Modal isOpen={isOpen} onModalClose={onCancel} id={id} size={size}>
      <Modal.Header onModalClose={onCancel}>{header}</Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button
          color="tertiary"
          onClick={onCancel}
          type="button"
          variant="ghost"
        >
          {koText ? t(koText) : ko[variant]}
        </Button>
        <Button
          color="danger"
          onClick={onSuccess}
          type="button"
          variant="filled"
        >
          {okText ? t(okText) : ok[variant]}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
