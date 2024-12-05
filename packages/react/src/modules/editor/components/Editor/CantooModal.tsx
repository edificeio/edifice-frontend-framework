import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from '../../../../components';
import { useEditorContext } from '../../hooks';

interface ModalProps {
  isOpen: boolean;
  onSuccess?: (formulaEditor: string) => void;
  onCancel?: () => void;
}

const CantooModal = ({ isOpen, onCancel }: ModalProps) => {
  const { t } = useTranslation();

  const handleOnClose = () => {
    onCancel?.();
  };

  const { editor } = useEditorContext();

  const Cantoo = (window as any).Cantoo;

  const editorHTML = editor?.getHTML();
  const cantooHTML = Cantoo?.formatText(editorHTML);

  return createPortal(
    <Modal id="CantooModal" isOpen={isOpen} onModalClose={handleOnClose}>
      <Modal.Header onModalClose={handleOnClose}>
        {t('tiptap.cantoo.formatText')}
      </Modal.Header>
      <Modal.Body>
        <div dangerouslySetInnerHTML={{ __html: cantooHTML }} />
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="tertiary"
          onClick={onCancel}
          type="button"
          variant="ghost"
        >
          {t('tiptap.cantoo.close')}
        </Button>
      </Modal.Footer>
    </Modal>,
    document.getElementById('portal') as HTMLElement,
  );
};

export default CantooModal;
