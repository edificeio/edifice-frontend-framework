import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  ButtonBeta as Button,
  FormControl,
  Input,
  Label,
  ModalBeta,
} from '../../../../components';
import { isValidRssFeedUrl } from './utils';
import { RssFeed, RssFeedPayload } from './types';

const TITLE_MAX_LENGTH = 80;

export interface RssFeedFormProps {
  mode: 'add' | 'edit';
  /** Feed being edited. Ignored in "add" mode. */
  feed?: RssFeed;
  isSubmitting: boolean;
  /** Closes the form and goes back to the management modal, without saving. */
  onCancel: () => void;
  /** Closes the whole modal stack. */
  onClose: () => void;
  onSubmit: (payload: RssFeedPayload) => void;
}

export function RssFeedForm({
  mode,
  feed,
  isSubmitting,
  onCancel,
  onClose,
  onSubmit,
}: RssFeedFormProps) {
  const { t } = useTranslation();
  const formId = 'rss-feed-form';

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<RssFeedPayload>({
    mode: 'onChange',
    defaultValues: {
      title: feed?.title ?? '',
      link: feed?.link ?? '',
    },
  });

  const modalTitle =
    mode === 'add'
      ? t('homepage.widget.rss.form.addTitle')
      : t('homepage.widget.rss.form.editTitle');

  const handleFormSubmit = (data: RssFeedPayload) => {
    onSubmit({ title: data.title.trim(), link: data.link.trim() });
  };

  return (
    <ModalBeta id="rss-feed-modal" isOpen size="l" onModalClose={onClose}>
      <ModalBeta.Header onModalClose={onClose}>{modalTitle}</ModalBeta.Header>
      <ModalBeta.Body>
        <form
          id={formId}
          className="rss-widget-form"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <FormControl id="rss-feed-title" isRequired>
            <Label>{t('homepage.widget.rss.form.title')}</Label>
            <Input
              type="text"
              size="md"
              maxLength={TITLE_MAX_LENGTH}
              showCounter
              clearable
              data-testid="rss-input-title"
              placeholder={t('homepage.widget.rss.form.title.placeholder')}
              {...register('title', {
                required: true,
                maxLength: TITLE_MAX_LENGTH,
                validate: (value) => value.trim().length > 0,
              })}
            />
          </FormControl>
          <FormControl
            id="rss-feed-link"
            isRequired
            status={errors.link ? 'invalid' : undefined}
          >
            <Label>{t('homepage.widget.rss.form.link')}</Label>
            <Input
              type="text"
              size="md"
              data-testid="rss-input-link"
              placeholder={t('homepage.widget.rss.form.link.placeholder')}
              {...register('link', {
                required: true,
                validate: isValidRssFeedUrl,
              })}
            />
            {errors.link && (
              <FormControl.Text>
                {t('homepage.widget.rss.error')}
              </FormControl.Text>
            )}
          </FormControl>
        </form>
      </ModalBeta.Body>
      <ModalBeta.Footer>
        <Button
          type="button"
          variant="ghost"
          color="tertiary"
          data-testid="rss-button-cancel"
          onClick={onCancel}
        >
          {t('homepage.widget.rss.form.cancel')}
        </Button>
        <Button
          form={formId}
          type="submit"
          isLoading={isSubmitting}
          disabled={!isValid || !isDirty || isSubmitting}
          data-testid="rss-button-save"
        >
          {t('homepage.widget.rss.form.save')}
        </Button>
      </ModalBeta.Footer>
    </ModalBeta>
  );
}
