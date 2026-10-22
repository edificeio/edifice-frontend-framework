import { IResource } from '@edifice.io/client';
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Alert, Button, Heading, Switch } from '../../../../components';
import { IconCopy } from '../../../icons/components';
import { useSlug } from '../hooks/useSlug';
import { FormInputs } from '../ResourceModal';

interface BlogPublicProps {
  appCode: string;
  isUpdating: boolean;
  resource: IResource;
  watch: UseFormWatch<FormInputs>;
  register: UseFormRegister<FormInputs>;
  setValue: UseFormSetValue<FormInputs>;
}

const BlogPublic = ({
  appCode,
  isUpdating,
  resource,
  watch,
  register,
  setValue,
}: BlogPublicProps) => {
  const { t } = useTranslation();

  const { slug, isPublic, resourceName, onPublicChange, onCopyToClipBoard } =
    useSlug({
      watch,
      setValue,
      selectedResource: isUpdating ? resource : undefined,
    });

  return (
    <>
      <Heading headingStyle="h4" level="h3" className="mb-16">
        {t('explorer.resource.editModal.heading.access')}
        {appCode}
      </Heading>

      <Alert type="info">{t('explorer.resource.editModal.access.alert')}</Alert>

      <Switch
        id="flexSwitchCheckDefault"
        role="switch"
        className="mt-16 mb-8"
        label={t(
          'explorer.resource.editModal.access.flexSwitchCheckDefault.label',
        )}
        defaultChecked={isUpdating ? resource.public : false}
        {...register('enablePublic', {
          disabled: !resourceName,
          onChange: (event) => {
            const checked = event.target.checked;
            onPublicChange(checked);
          },
        })}
      />

      {isPublic && (
        <>
          {/* Native input: `Input` would leave its visible wrapper behind. */}
          <input
            type="hidden"
            key={slug}
            defaultValue={isUpdating ? slug : ''}
            {...register('formSlug')}
          />
          <div className="d-flex flex-wrap align-items-center gap-4">
            <p className="text-break">
              {window.location.origin}/blog/pub/{slug}
            </p>
            <Button
              color="primary"
              disabled={!isPublic}
              onClick={() => onCopyToClipBoard('/blog')}
              type="button"
              leftIcon={<IconCopy />}
              variant="ghost"
              className="text-nowrap"
            >
              {t('explorer.resource.editModal.access.url.button')}
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default BlogPublic;
