import illuEdumalinError from '@edifice.io/bootstrap/dist/images/homepage/illu-briefme-error.svg';
import { useTranslation } from 'react-i18next';
import { IconButton, Image, TextSkeleton } from '../../../../components';
import SvgIconExternalLink from '../../../icons/components/IconExternalLink';
import { HomeCard } from '../HomeCard';
import EdumalinBadge from './components/EdumalinBadge';
import EdumalinPicture from './components/EdumalinPicture';
import { EdumalinError, EdumalinItem, EdumalinStatus } from './types';

export interface EdumalinProps {
  status: EdumalinStatus;
  items: EdumalinItem[];
  error?: EdumalinError | null;
  onItemClick: (item: EdumalinItem) => void;
  onEdumalinClick: () => void;
}

export default function Edumalin({
  status,
  items,
  error,
  onItemClick,
  onEdumalinClick,
}: EdumalinProps) {
  const { t } = useTranslation();

  const isError = status === 'connectionError' || status === 'loadError';

  return (
    <HomeCard variant="primary" className="edumalin">
      <div className="edumalin__header">
        <h3 className="edumalin__title">
          {t('homepage.widget.edumalin.title')}
        </h3>
        <IconButton
          aria-label={t('homepage.widget.edumalin.open')}
          onClick={onEdumalinClick}
          icon={<SvgIconExternalLink />}
          variant="ghost"
          color="tertiary"
        />
      </div>

      <HomeCard.Content className="edumalin__body">
        {status === 'loading' && (
          <div className="edumalin__loading" data-testid="edumalin-loading">
            <TextSkeleton size="lg" className="edumalin__loading-item" />
            <TextSkeleton size="lg" className="edumalin__loading-item" />
            <TextSkeleton size="lg" className="edumalin__loading-item" />
          </div>
        )}

        {isError && (
          <div className="edumalin__error">
            <Image src={illuEdumalinError} alt="" className="edumalin__illu" />
            <p className="edumalin__message">
              <span className="edumalin__message-line">
                {status === 'connectionError'
                  ? t('homepage.widget.edumalin.error.connection')
                  : t('homepage.widget.edumalin.error.load')}
              </span>
              <span className="edumalin__message-line">
                {t('homepage.widget.edumalin.error.help')}
              </span>
            </p>
          </div>
        )}

        {isError && error && (
          <p className="edumalin__error-code">
            {t('homepage.widget.edumalin.error.code', {
              code: error.code,
              message: error.message,
            })}
          </p>
        )}

        {status === 'empty' && (
          <div className="edumalin__empty">
            <Image src={illuEdumalinError} alt="" className="edumalin__illu" />
            <p className="edumalin__message">
              {t('homepage.widget.edumalin.empty')}
            </p>
          </div>
        )}

        {status === 'default' && (
          <ul className="edumalin__list">
            {items.map((item, index) => (
              <li key={`${item.title}-${index}`}>
                <button
                  type="button"
                  className="edumalin__item"
                  onClick={() => onItemClick(item)}
                >
                  <span className="edumalin__item-top">
                    <EdumalinBadge typeName={item.type?.name} />
                    <span className="edumalin__item-heading">
                      <EdumalinPicture picture={item.picture} />
                      <span className="edumalin__item-title">{item.title}</span>
                    </span>
                  </span>
                  {item.description && (
                    <span className="edumalin__item-description">
                      {item.description}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </HomeCard.Content>
    </HomeCard>
  );
}
