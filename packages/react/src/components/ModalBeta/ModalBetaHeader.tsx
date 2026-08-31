import { ReactNode, useEffect, useRef } from 'react';

import { useTranslation } from 'react-i18next';

import { IconClose } from '../../modules/icons/components';
import ButtonBeta from '../ButtonBeta/ButtonBeta';
import { useModalBetaContext } from './ModalBetaContext';

export interface ModalBetaHeaderProps {
  /**
   * Method called on modal close
   */
  onModalClose: () => void;
  /**
   * Modal title
   */
  children: ReactNode;
  /**
   * Optional text displayed below the title
   */
  subtitle?: ReactNode;
}

/**
 * ModalBeta Header
 */
const ModalBetaHeader = ({
  onModalClose,
  children,
  subtitle,
}: ModalBetaHeaderProps) => {
  const { ariaLabelId, focusId } = useModalBetaContext();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!focusId) {
      closeButtonRef.current?.focus();
    }
  }, [focusId]);

  return (
    <div className="modal-beta-header">
      <div className="modal-beta-title-row">
        <h2 id={ariaLabelId} className="modal-beta-title" tabIndex={-1}>
          {children}
        </h2>
        <ButtonBeta
          ref={closeButtonRef}
          aria-label={t('close')}
          title={t('close')}
          type="button"
          variant="ghost"
          color="tertiary"
          leftIcon={<IconClose />}
          onClick={onModalClose}
        />
      </div>
      {subtitle && <p className="modal-beta-subtitle">{subtitle}</p>}
    </div>
  );
};

ModalBetaHeader.displayName = 'ModalBeta.Header';

export default ModalBetaHeader;
