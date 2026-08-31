import { ReactNode } from 'react';

import clsx from 'clsx';

import { useModalBetaContext } from './ModalBetaContext';

export interface ModalBetaBodyProps {
  /**
   * Children
   */
  children: ReactNode;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

/**
 * ModalBeta Body
 */
const ModalBetaBody = ({ children, className }: ModalBetaBodyProps) => {
  const { ariaDescriptionId } = useModalBetaContext();

  return (
    <div id={ariaDescriptionId} className={clsx('modal-beta-body', className)}>
      {children}
    </div>
  );
};

ModalBetaBody.displayName = 'ModalBeta.Body';

export default ModalBetaBody;
