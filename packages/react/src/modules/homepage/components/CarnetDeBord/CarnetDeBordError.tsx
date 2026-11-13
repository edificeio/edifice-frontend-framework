import illuError from '@edifice.io/bootstrap/dist/images/homepage/illu-error-carnetDeBord.svg';
import { useTranslation } from 'react-i18next';
import { Image } from '../../../../components';

export function CarnetDeBordError() {
  const { t } = useTranslation();

  return (
    <div className="carnet-de-bord__error">
      <Image src={illuError} alt="" className="carnet-de-bord__error-illu" />
      <p className="carnet-de-bord__error-message">
        {t('homepage.widget.carnetDeBord.error')}
      </p>
    </div>
  );
}
