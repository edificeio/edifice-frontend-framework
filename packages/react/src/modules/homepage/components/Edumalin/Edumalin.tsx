import illuEdumalinError from '@edifice.io/bootstrap/dist/images/homepage/illu-briefme-error.svg';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  Image,
  Skeleton,
  VisuallyHidden,
} from '../../../../components';
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
  isLoading?: boolean;
}

export default function Edumalin({
  status,
  items,
  error,
  onItemClick,
  onEdumalinClick,
  isLoading = false,
}: EdumalinProps) {
  const { t } = useTranslation();

  const isError = status === 'connectionError' || status === 'loadError';

  if (isLoading) {
    return (
      <HomeCard
        variant="primary"
        className="edumalin edumalin--skeleton"
        role="status"
        aria-busy="true"
      >
        <VisuallyHidden>{t('homepage.widget.loading')}</VisuallyHidden>
        <div className="edumalin__header-skeleton">
          <Skeleton className="edumalin__title-skeleton" />
          <Skeleton
            variant="circle"
            tone="strong"
            className="edumalin__button-skeleton"
          />
        </div>
        <Skeleton variant="block" className="edumalin__content-skeleton" />
      </HomeCard>
    );
  }

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
          <div role="status" aria-busy="true" data-testid="edumalin-loading">
            <VisuallyHidden>{t('homepage.widget.loading')}</VisuallyHidden>
            <Skeleton variant="block" className="edumalin__loading-skeleton" />
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
              message:
                error.message || t('homepage.widget.edumalin.error.noResponse'),
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
