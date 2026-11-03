import illuScreenTimeError from '@edifice.io/bootstrap/dist/images/homepage/illu-screen-time-error.svg';
import { useTranslation } from 'react-i18next';
import { Image } from '../../../../components';

export interface ScreenTimeErrorProps {
  /** Layout of the error block, which differs in the widget and the modal. */
  className: string;
}

export function ScreenTimeError({ className }: ScreenTimeErrorProps) {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <Image
        src={illuScreenTimeError}
        alt=""
        className="screen-time-error__illu"
      />
      <p className="screen-time-error__message">
        {t('homepage.widget.screenTime.error.connection')}
        <br />
        {t('homepage.widget.screenTime.error.contact')}
      </p>
    </div>
  );
}
