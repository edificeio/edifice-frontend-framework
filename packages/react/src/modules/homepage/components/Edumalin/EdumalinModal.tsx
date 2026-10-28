import { useTranslation } from 'react-i18next';
import {
  ButtonBeta as Button,
  ModalBeta as Modal,
} from '../../../../components';
import { useDate } from '../../../../hooks';
import EdumalinBadge from './components/EdumalinBadge';
import EdumalinPicture from './components/EdumalinPicture';
import { EdumalinItem } from './types';
import { getEdumalinType, isHttpUrl } from './utils';

export interface EdumalinModalProps {
  item: EdumalinItem;
  onClose: () => void;
  onEdumalinClick: () => void;
  onActionClick: (url: string) => void;
}

export default function EdumalinModal({
  item,
  onClose,
  onEdumalinClick,
  onActionClick,
}: EdumalinModalProps) {
  const { t } = useTranslation();
  const { formatDate } = useDate();

  const type = getEdumalinType(item.type?.name);
  const hasWebinarInfos =
    type === 'webinar' && (!!item.dateTime || item.duration !== undefined);
  const hasPlace = type === 'rdv' && isHttpUrl(item.googleMap);

  return (
    <Modal id="edumalin-modal" size="m" isOpen onModalClose={onClose}>
      <Modal.Header onModalClose={onClose}>
        {t('homepage.widget.edumalin.title')}
      </Modal.Header>

      <Modal.Body>
        <div className="edumalin-modal">
          <div className="edumalin-modal__top">
            <EdumalinBadge typeName={item.type?.name} />
            <div className="edumalin-modal__heading">
              <EdumalinPicture picture={item.picture} />
              <p className="edumalin-modal__title">{item.title}</p>
            </div>
          </div>

          <div className="edumalin-modal__content">
            {item.description && (
              <p className="edumalin-modal__description">{item.description}</p>
            )}

            {hasWebinarInfos && (
              <div className="edumalin-modal__infos">
                {item.dateTime && (
                  <p className="edumalin-modal__info">
                    {t('homepage.widget.edumalin.modal.date')}{' '}
                    <strong>{formatDate(item.dateTime, 'DD/MM/YYYY')}</strong>
                  </p>
                )}
                {item.duration !== undefined && (
                  <p className="edumalin-modal__info">
                    {t('homepage.widget.edumalin.modal.duration')}{' '}
                    <strong>
                      {t('homepage.widget.edumalin.modal.durationValue', {
                        duration: item.duration,
                      })}
                    </strong>
                  </p>
                )}
              </div>
            )}

            {hasPlace && (
              <div className="edumalin-modal__infos">
                <p className="edumalin-modal__info">
                  {t('homepage.widget.edumalin.modal.place')}{' '}
                  <a
                    className="edumalin-modal__link"
                    href={item.googleMap}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.googleMap}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div>
          <Button
            type="button"
            variant="ghost"
            color="tertiary"
            onClick={onEdumalinClick}
          >
            {t('homepage.widget.edumalin.open')}
          </Button>
          {isHttpUrl(item.buttonLink) && (
            <Button
              type="button"
              onClick={() => onActionClick(item.buttonLink as string)}
            >
              {item.buttonTitle}
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
}
