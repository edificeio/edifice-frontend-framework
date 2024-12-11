import { PublishResult } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

export function ToastSuccess({ result }: { result: PublishResult }) {
  const { t } = useTranslation();

  return (
    <>
      <h3 className="pt-24">
        {t('bpr.form.publication.response.success.title')}
      </h3>
      <p className="pt-24">
        {t('bpr.form.publication.response.success.content.1')}
      </p>
      <p className="pt-24">
        {t('bpr.form.publication.response.success.content.2')}
      </p>
      {result.details.front_url && (
        <p className="pt-24 pb-24">
          <a
            className="button right-magnet"
            href={result.details.front_url}
            target="_blank"
            rel="noreferrer"
          >
            {t('bpr.form.publication.response.success.button')}
          </a>
        </p>
      )}
    </>
  );
}
