import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Modal } from '../..';

export interface HelpProps {
  isHelpOpen: boolean;
  parsedHeadline: any;
  parsedContent: any;
  error: boolean;
  setIsHelpOpen: (state: boolean) => void;
}

export default function Help({
  isHelpOpen,
  setIsHelpOpen,
  parsedHeadline,
  parsedContent,
  error,
}: HelpProps): JSX.Element | null {
  const { t } = useTranslation();

  const handleHelpOpen = () => {
    setIsHelpOpen(false);
  };

  return isHelpOpen
    ? createPortal(
        <Modal
          id="help-modal"
          isOpen={isHelpOpen}
          onModalClose={handleHelpOpen}
          scrollable
          size="lg"
        >
          <Modal.Header onModalClose={handleHelpOpen}>
            {t('navbar.help')}
          </Modal.Header>
          <Modal.Subtitle>
            {error ? t('help.notfound.title') : parsedHeadline}
          </Modal.Subtitle>
          <Modal.Body className={error ? 'd-flex' : null}>
            {error ? t('help.notfound.text') : parsedContent}
          </Modal.Body>
        </Modal>,
        document.getElementById('portal') as HTMLElement,
      )
    : null;
}
