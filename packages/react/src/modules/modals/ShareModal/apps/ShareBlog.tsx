import { ChangeEvent, useEffect, useState } from 'react';

import {
  BlogResource,
  BlogUpdate,
  ID,
  UpdateParameters,
  UpdateResult,
  odeServices,
} from '@edifice.io/client';
import { UseMutationResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Heading, Radio } from '../../../../components';
import { useResource } from '../../../../hooks/useResource';
import { useEdificeClient } from '../../../../providers/EdificeClientProvider/EdificeClientProvider.hook';

export type PublicationType = 'RESTRAINT' | 'IMMEDIATE' | undefined;

export interface ShareBlogProps {
  resourceId: ID;
  updateResource?: UseMutationResult<
    UpdateResult,
    unknown,
    UpdateParameters,
    unknown
  >;
}

export default function ShareBlog({
  resourceId,
  updateResource,
}: ShareBlogProps) {
  const { appCode } = useEdificeClient();
  const { t } = useTranslation(appCode);

  const resource = useResource('blog', resourceId) as BlogResource;
  const publishType = resource && resource['publish-type'];

  const [radioPublicationValue, setRadioPublicationValue] =
    useState<PublicationType>(publishType ?? 'RESTRAINT');

  useEffect(() => {
    if (publishType) {
      setRadioPublicationValue(publishType);
    }
  }, [publishType]);

  const handleRadioPublicationChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value as PublicationType;
    const params = {
      'description': resource.description || '',
      'entId': resource.assetId,
      'name': resource.name,
      'public': !!resource.public,
      'slug': resource.slug || '',
      'thumbnail': resource.thumbnail,
      'trashed': resource.trashed,
      'publish-type': value,
    } as BlogUpdate;

    if (updateResource) {
      await updateResource.mutateAsync(params);
    } else {
      await odeServices.resource('blog').update(params);
    }

    setRadioPublicationValue(value);
  };

  return (
    <>
      <hr />

      <Heading headingStyle="h4" level="h3" className="mb-16">
        {t('explorer.publication.steps')}
      </Heading>
      <Radio
        label={t('explorer.immediat.publication')}
        id="publication-now"
        name="publication"
        value={'IMMEDIATE' as PublicationType}
        model={radioPublicationValue as string}
        checked={radioPublicationValue === 'IMMEDIATE'}
        onChange={handleRadioPublicationChange}
      />
      <Radio
        label={t('explorer.validate.publication')}
        id="publication-validate"
        name="publication"
        value={'RESTRAINT' as PublicationType}
        checked={radioPublicationValue === 'RESTRAINT'}
        model={radioPublicationValue as string}
        onChange={handleRadioPublicationChange}
      />
    </>
  );
}
