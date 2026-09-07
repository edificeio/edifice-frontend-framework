import { UsefulLink, UsefulLinkPayload } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import {
  ButtonBeta,
  FormControl,
  Input,
  Label,
  ModalBeta,
} from '../../../../components';

const NAME_MAX_LENGTH = 80;
const URL_PLACEHOLDER = 'https://example.fr';
const URL_PATTERN = /^https?:\/\/.+/i;

export interface LinkFormProps {
  mode: 'add' | 'edit';
  /** Link being edited. Ignored (and required to be undefined) in "add" mode. */
  link?: UsefulLink;
  isSubmitting: boolean;
  /** Closes the form and goes back to the management modal, without saving. */
  onCancel: () => void;
  /** Closes the whole modal stack. */
  onClose: () => void;
  onSubmit: (payload: UsefulLinkPayload) => void;
}

export function LinkForm({
  mode,
  link,
  isSubmitting,
  onCancel,
  onClose,
  onSubmit,
}: LinkFormProps) {
  const { t } = useTranslation();
  const formId = 'useful-link-form';

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<UsefulLinkPayload>({
    mode: 'onChange',
    defaultValues: {
      name: link?.name ?? '',
      url: link?.url ?? '',
    },
  });

  const title =
    mode === 'add'
      ? t('homepage.usefulLinks.form.addTitle', 'Ajouter un lien')
      : t('homepage.usefulLinks.form.editTitle', 'Modifier un lien');

  const handleFormSubmit = (data: UsefulLinkPayload) => {
    onSubmit({ name: data.name.trim(), url: data.url.trim() });
  };

  return (
    <ModalBeta id="useful-link-modal" isOpen size="l" onModalClose={onClose}>
      <ModalBeta.Header onModalClose={onClose}>{title}</ModalBeta.Header>
      <ModalBeta.Body>
        <form id={formId} onSubmit={handleSubmit(handleFormSubmit)}>
          <FormControl id="useful-link-name" className="mb-16" isRequired>
            <Label>{t('homepage.usefulLinks.form.name', 'Nom')}</Label>
            <Input
              type="text"
              size="md"
              maxLength={NAME_MAX_LENGTH}
              showCounter
              clearable
              data-testid="usefullinks-input-name"
              placeholder={t(
                'homepage.usefulLinks.form.name.placeholder',
                'Nom du lien utile',
              )}
              {...register('name', {
                required: true,
                maxLength: NAME_MAX_LENGTH,
              })}
            />
          </FormControl>
          <FormControl
            id="useful-link-url"
            isRequired
            status={errors.url ? 'invalid' : undefined}
          >
            <Label>{t('homepage.usefulLinks.form.url', 'Lien')}</Label>
            <Input
              type="text"
              size="md"
              data-testid="usefullinks-input-url"
              placeholder={t(
                'homepage.usefulLinks.form.url.placeholder',
                URL_PLACEHOLDER,
              )}
              {...register('url', {
                required: true,
                pattern: URL_PATTERN,
              })}
            />
            {errors.url && (
              <FormControl.Text>
                {t(
                  'homepage.usefulLinks.form.url.error',
                  "L'adresse doit être une URL valide (ex. https://exemple.fr)",
                )}
              </FormControl.Text>
            )}
          </FormControl>
        </form>
      </ModalBeta.Body>
      <ModalBeta.Footer>
        <ButtonBeta
          type="button"
          variant="ghost"
          color="tertiary"
          data-testid="usefullinks-button-cancel"
          onClick={onCancel}
        >
          {t('homepage.usefulLinks.form.cancel', 'Annuler')}
        </ButtonBeta>
        <ButtonBeta
          form={formId}
          type="submit"
          isLoading={isSubmitting}
          disabled={!isValid || !isDirty || isSubmitting}
          data-testid="usefullinks-button-save"
        >
          {t('homepage.usefulLinks.form.save', 'Enregistrer')}
        </ButtonBeta>
      </ModalBeta.Footer>
    </ModalBeta>
  );
}
