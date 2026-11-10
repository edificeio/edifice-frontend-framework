import { FormEvent, useState } from 'react';

import { useTranslation } from 'react-i18next';
import {
  ButtonBeta as Button,
  FormControl,
  Input,
  Label,
  ModalBeta as Modal,
  RadioCard,
} from '../../../../components';
import { OfficeToolType } from './Tools';

const OFFICE_TOOLS: OfficeToolType[] = ['word', 'powerpoint', 'excel'];

export interface CreateDocumentModalProps {
  /** Document type selected when the modal opens. */
  defaultType: OfficeToolType;
  onClose: () => void;
  /**
   * Called on submit with the chosen type and trimmed name.
   * Called synchronously from the click, so it can safely open a new tab.
   */
  onCreate: (type: OfficeToolType, name: string) => void;
}

export function CreateDocumentModal({
  defaultType,
  onClose,
  onCreate,
}: CreateDocumentModalProps) {
  const { t } = useTranslation();
  const [type, setType] = useState<OfficeToolType>(defaultType);
  const [name, setName] = useState('');

  const trimmedName = name.trim();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!trimmedName) return;
    onCreate(type, trimmedName);
  };

  return (
    <Modal id="create-document-modal" size="xl" isOpen onModalClose={onClose}>
      <Modal.Header onModalClose={onClose}>
        {t('homepage.tools.modal.title')}
      </Modal.Header>

      <Modal.Body>
        <form
          id="create-document-form"
          className="d-flex flex-column gap-24"
          onSubmit={handleSubmit}
        >
          <div className="tools-modal-types">
            {OFFICE_TOOLS.map((tool) => (
              <RadioCard
                key={tool}
                groupName="create-document-type"
                value={tool}
                label={t(`homepage.tools.modal.type.${tool}`)}
                description={t(`homepage.tools.modal.description.${tool}`)}
                selectedValue={type}
                onChange={() => setType(tool)}
              />
            ))}
          </div>

          <FormControl id="create-document-name" isRequired>
            <Label>{t('homepage.tools.modal.name')}</Label>
            <Input
              type="text"
              size="md"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t('homepage.tools.modal.name.placeholder')}
              data-testid="homepage-tools-create-document-name-input"
            />
          </FormControl>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <div>
          <Button
            type="button"
            variant="ghost"
            color="tertiary"
            onClick={onClose}
            data-testid="homepage-tools-create-document-cancel-button"
          >
            {t('homepage.tools.modal.cancel')}
          </Button>
          <Button
            type="submit"
            form="create-document-form"
            disabled={!trimmedName}
            data-testid="homepage-tools-create-document-create-button"
          >
            {t('homepage.tools.modal.create')}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
