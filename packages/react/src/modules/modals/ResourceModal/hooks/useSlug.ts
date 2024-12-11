import { useEffect, useId, useState } from 'react';

import { IResource } from '@edifice.io/client';
import { hash } from 'ohash';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import slugify from 'react-slugify';

import { useToast } from '../../../../hooks';
import { FormInputs } from '../ResourceModal';

interface UseSlugProps {
  watch: UseFormWatch<FormInputs>;
  setValue: UseFormSetValue<FormInputs>;
  selectedResource?: IResource;
}

export const useSlug = ({
  watch,
  setValue,
  selectedResource,
}: UseSlugProps) => {
  const [slug, setSlug] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(
    selectedResource?.public || false,
  );

  const uniqueId = useId();
  const resourceName = watch('title');

  const { t } = useTranslation();
  const toast = useToast();

  useEffect(() => {
    if (isPublic) {
      let slug = '';

      if (selectedResource) {
        slug = selectedResource.slug
          ? selectedResource.slug
          : `${hash({
              foo: `${resourceName}${uniqueId}`,
            })}-${slugify(resourceName)}`;
      } else {
        slug = `${hash({
          foo: `${resourceName}${uniqueId}`,
        })}-${slugify(resourceName)}`;
      }

      setValue('formSlug', slug);
      setSlug(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPublic, resourceName]);

  function onPublicChange(value: boolean) {
    setIsPublic(value);
  }

  function onCopyToClipBoard(pathname: string) {
    navigator.clipboard.writeText(
      `${window.location.origin}${
        pathname ? pathname : window.location.pathname
      }/pub/${slug}`,
    );
    toast.success(t('explorer.copy.clipboard'));
  }

  return {
    slug,
    uniqueId,
    isPublic,
    resourceName,
    onPublicChange,
    onCopyToClipBoard,
  };
};
