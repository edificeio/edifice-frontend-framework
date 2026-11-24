import logoEEnfance from '@edifice.io/bootstrap/dist/images/homepage/logo-e-enfance-3018.jpg';
import { useTranslation } from 'react-i18next';
import { ButtonBeta as Button } from '../../../../components/ButtonBeta/index';
import { Image } from '../../../../components/Image/index';
import { IconFullScreen } from '../../../icons/components';
import { HomeCard } from '../HomeCard';
import { Stop3018Audience, Stop3018Link } from './types';

export interface Stop3018Props {
  /** Students also get the quiz; relatives get messages of their own. */
  audience: Stop3018Audience;
  /** Opens the modal telling more about harassment and the 3018, from the
   * full screen button or « En savoir plus ». */
  onLearnMoreClick: () => void;
  /** Opens an external resource of the e-Enfance association. */
  onLinkClick: (link: Stop3018Link) => void;
}

const Stop3018 = ({
  audience,
  onLearnMoreClick,
  onLinkClick,
}: Stop3018Props) => {
  const { t } = useTranslation();

  return (
    <HomeCard variant="primary" className="stop-3018">
      <HomeCard.Header
        title={t('homepage.widget.stop3018.title')}
        actionLeftIcon={<IconFullScreen />}
        onActionClick={onLearnMoreClick}
        actionProps={{
          'aria-label': t('homepage.widget.stop3018.open'),
          'data-testid': 'stop-3018-open',
        }}
      />
      <HomeCard.Content className="stop-3018__content">
        <div className="stop-3018__intro">
          <Image
            src={logoEEnfance}
            alt={t('homepage.widget.stop3018.logo')}
            className="stop-3018__logo"
          />
          <p className="stop-3018__text">
            {audience === 'student'
              ? t('homepage.widget.stop3018.student.description')
              : t('homepage.widget.stop3018.relative.description')}
          </p>
          <p className="stop-3018__text">
            {t('homepage.widget.stop3018.service')}
            <br />
            {t('homepage.widget.stop3018.hours')}
          </p>
        </div>
        <div className="stop-3018__actions">
          <Button variant="outline" onClick={onLearnMoreClick}>
            {t('homepage.widget.stop3018.learnMore')}
          </Button>
          {audience === 'student' && (
            <Button onClick={() => onLinkClick('quiz')}>
              {t('homepage.widget.stop3018.quiz')}
            </Button>
          )}
        </div>
      </HomeCard.Content>
    </HomeCard>
  );
};

Stop3018.displayName = 'Stop3018';

export default Stop3018;
