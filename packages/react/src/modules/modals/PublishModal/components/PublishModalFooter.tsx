import { useTranslation } from 'react-i18next';
import { Alert } from '../../../../components';

import creativeCommons from '@edifice.io/bootstrap/dist/images/common/image-creative-commons.png';

export const PublishModalFooter = () => {
  const { t } = useTranslation();
  return (
    <>
      <ul className="mb-12">
        <li>
          {t('bpr.form.publication.licence.text.1')}
          <img
            className="ms-8 d-inline-block"
            src={creativeCommons}
            alt="licence creative commons"
          />
        </li>
        <li>{t('bpr.form.publication.licence.text.2')}</li>
      </ul>

      <Alert type="info" className="mb-12">
        {t('bpr.form.publication.licence.text.3')}
      </Alert>

      <Alert type="warning">{t('bpr.form.publication.licence.text.4')}</Alert>
    </>
  );
};
