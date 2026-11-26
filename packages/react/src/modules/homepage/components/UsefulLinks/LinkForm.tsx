import { useEffect } from 'react';
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
import { isValidHttpUrl } from '../../utils/url';

const NAME_MAX_LENGTH = 80;

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
    trigger,
    formState: { errors, isDirty, isValid },
  } = useForm<UsefulLinkPayload>({
    // Errors show once a field is left, then update as the user types.
    mode: 'onTouched',
    defaultValues: {
      name: link?.name ?? '',
      url: link?.url ?? '',
    },
  });

  // A stored URL may not match the current rules: flag it right away, so a
  // disabled save button never comes without an explanation.
  useEffect(() => {
    if (mode === 'edit' && link?.url) trigger('url');
  }, [mode, link?.url, trigger]);

  const title =
    mode === 'add'
      ? t('homepage.usefulLinks.form.addTitle')
      : t('homepage.usefulLinks.form.editTitle');

  const handleFormSubmit = (data: UsefulLinkPayload) => {
    onSubmit({ name: data.name.trim(), url: data.url.trim() });
  };

  return (
    <ModalBeta id="useful-link-modal" isOpen size="l" onModalClose={onClose}>
      <ModalBeta.Header onModalClose={onClose}>{title}</ModalBeta.Header>
      <ModalBeta.Body>
        <form id={formId} onSubmit={handleSubmit(handleFormSubmit)}>
          <FormControl id="useful-link-name" className="mb-16" isRequired>
            <Label>{t('homepage.usefulLinks.form.name')}</Label>
            <Input
              type="text"
              size="md"
              maxLength={NAME_MAX_LENGTH}
              showCounter
              clearable
              data-testid="usefullinks-input-name"
              placeholder={t('homepage.usefulLinks.form.name.placeholder')}
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
            <Label>{t('homepage.usefulLinks.form.url')}</Label>
            <Input
              type="text"
              size="md"
              data-testid="usefullinks-input-url"
              placeholder={t('homepage.usefulLinks.form.url.placeholder')}
              aria-invalid={!!errors.url}
              {...register('url', {
                required: true,
                // Schools may link to their own intranet ("http://intranet").
                validate: (value) =>
                  isValidHttpUrl(value, { allowIntranetHost: true }),
              })}
            />
            {errors.url && (
              <FormControl.Text>
                {t('homepage.usefulLinks.form.url.error')}
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
          {t('homepage.usefulLinks.form.cancel')}
        </ButtonBeta>
        <ButtonBeta
          form={formId}
          type="submit"
          isLoading={isSubmitting}
          disabled={!isValid || !isDirty || isSubmitting}
          data-testid="usefullinks-button-save"
        >
          {t('homepage.usefulLinks.form.save')}
        </ButtonBeta>
      </ModalBeta.Footer>
    </ModalBeta>
  );
}
