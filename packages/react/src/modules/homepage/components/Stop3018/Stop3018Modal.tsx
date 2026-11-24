import logo3018 from '@edifice.io/bootstrap/dist/images/homepage/logo-3018.png';
import qrCodeApp3018 from '@edifice.io/bootstrap/dist/images/homepage/qrcode-app-3018.png';
import { Trans, useTranslation } from 'react-i18next';
import { ButtonBeta as Button } from '../../../../components/ButtonBeta/index';
import { Image } from '../../../../components/Image/index';
import { ModalBeta as Modal } from '../../../../components/ModalBeta/index';
import { IconExternalLink } from '../../../icons/components';
import { Stop3018Audience, Stop3018Link } from './types';
import { APP_3018_URL } from './utils';

export interface Stop3018ModalProps {
  isOpen: boolean;
  /** Students and relatives get messages and advice of their own. */
  audience: Stop3018Audience;
  onClose: () => void;
  /** Opens an external resource of the e-Enfance association. */
  onLinkClick: (link: Stop3018Link) => void;
}

// Tags allowed in the translated messages.
const MESSAGE_COMPONENTS = { strong: <strong />, br: <br /> };

export function Stop3018Modal({
  isOpen,
  audience,
  onClose,
  onLinkClick,
}: Stop3018ModalProps) {
  const { t } = useTranslation();
  const isStudent = audience === 'student';

  return (
    <Modal id="stop-3018-modal" isOpen={isOpen} size="l" onModalClose={onClose}>
      <Modal.Header onModalClose={onClose}>
        {t('homepage.widget.stop3018.title')}
      </Modal.Header>
      <Modal.Body>
        <div className="stop-3018-modal">
          <div className="stop-3018-modal__message">
            <p className="stop-3018-modal__text">
              {isStudent ? (
                <Trans
                  i18nKey="homepage.widget.stop3018.student.modal.message"
                  components={MESSAGE_COMPONENTS}
                />
              ) : (
                <Trans
                  i18nKey="homepage.widget.stop3018.relative.modal.message"
                  components={MESSAGE_COMPONENTS}
                />
              )}
            </p>
            <p className="stop-3018-modal__call-to-action">
              {isStudent
                ? t('homepage.widget.stop3018.student.modal.callToAction')
                : t('homepage.widget.stop3018.relative.modal.callToAction')}
            </p>
          </div>
          <div className="stop-3018-modal__aside">
            <div className="stop-3018-modal__links">
              <Button
                variant="outline"
                rightIcon={<IconExternalLink />}
                onClick={() => onLinkClick('harassment')}
              >
                {t('homepage.widget.stop3018.modal.harassment')}
              </Button>
              <Button
                variant="outline"
                rightIcon={<IconExternalLink />}
                onClick={() => onLinkClick('faq')}
              >
                {isStudent
                  ? t('homepage.widget.stop3018.student.modal.faq')
                  : t('homepage.widget.stop3018.relative.modal.faq')}
              </Button>
              {isStudent && (
                <Button
                  rightIcon={<IconExternalLink />}
                  onClick={() => onLinkClick('quiz')}
                >
                  {t('homepage.widget.stop3018.student.modal.quiz')}
                </Button>
              )}
            </div>
            <div className="stop-3018-modal__app">
              <p className="stop-3018-modal__text">
                {t('homepage.widget.stop3018.modal.helpline')}
              </p>
              <p className="stop-3018-modal__text">
                {t('homepage.widget.stop3018.modal.app')}
              </p>
              <div className="stop-3018-modal__app-images">
                <a
                  href={APP_3018_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stop-3018-modal__app-link"
                  data-testid="stop-3018-app-link"
                >
                  <Image
                    src={qrCodeApp3018}
                    alt={t('homepage.widget.stop3018.modal.qrCode')}
                    width={60}
                    height={60}
                  />
                </a>
                <Image
                  src={logo3018}
                  alt=""
                  aria-hidden="true"
                  width={60}
                  height={60}
                />
              </div>
              <p className="stop-3018-modal__caption">
                {t('homepage.widget.stop3018.modal.operator')}
              </p>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

Stop3018Modal.displayName = 'Stop3018Modal';
