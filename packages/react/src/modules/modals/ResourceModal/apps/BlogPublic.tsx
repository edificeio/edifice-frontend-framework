import { IResource } from '@edifice.io/client';
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  Button,
  FormControl,
  Heading,
  Input,
} from '../../../../components';
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

      <FormControl
        id="flexSwitchCheckDefault"
        className="form-switch d-flex gap-8 mt-16 mb-8"
      >
        <FormControl.Input
          type="checkbox"
          role="switch"
          defaultChecked={isUpdating ? resource.public : false}
          {...register('enablePublic', {
            disabled: !resourceName,
            onChange: (event) => {
              const checked = event.target.checked;
              onPublicChange(checked);
            },
          })}
          className="form-check-input mt-0"
          size="md"
        />
        <FormControl.Label className="form-check-label mb-0">
          {t('explorer.resource.editModal.access.flexSwitchCheckDefault.label')}
        </FormControl.Label>
      </FormControl>

      {isPublic && (
        <>
          <FormControl id="formSlug" key={slug}>
            <Input
              type="text"
              hidden
              defaultValue={isUpdating ? slug : ''}
              {...register('formSlug')}
              size="sm"
            />
          </FormControl>
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
