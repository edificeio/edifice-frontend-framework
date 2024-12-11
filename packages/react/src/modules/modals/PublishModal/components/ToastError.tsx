import { useTranslation } from 'react-i18next';

import { FormDataProps } from '../hooks/usePublishModal';

export function ToastError({
  formData,
  errorMessage,
}: {
  formData?: FormDataProps;
  errorMessage?: string;
}) {
  const { t } = useTranslation();

  const regexInput = (value?: string) => {
    return value?.match(/^\s/);
  };

  if (errorMessage === 'CONTENT_TOO_LARGE') {
    return (
      <>
        <h3 className="pt-24">
          {t('bpr.form.publication.response.error.title')}
        </h3>
        <p className="pt-24 pb-24">
          <strong>
            {t('bpr.form.publication.response.error.content_too_large')}
          </strong>
        </p>
      </>
    );
  }

  return (
    <>
      <h3 className="pt-24">
        {t('bpr.form.publication.response.error.title')}
      </h3>
      <p className="pt-24 pb-24">
        <strong>{t('bpr.form.publication.response.error.content')}</strong>
      </p>
      <ul>
        {regexInput(formData?.title) && (
          <li className="pt-2 pb-2">
            <strong>{t('bpr.form.publication.response.empty.title')}</strong>
          </li>
        )}
        {regexInput(formData?.description) && (
          <li className="pt-2 pb-2">
            <strong>
              {t('bpr.form.publication.response.empty.description')}
            </strong>
          </li>
        )}
      </ul>
    </>
  );
}
