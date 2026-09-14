import { ReactNode } from 'react';

export interface ModalBetaFooterProps {
  children: ReactNode;
}

/**
 * ModalBeta Footer — right-aligns its children, typically two ButtonBeta
 * (a ghost/tertiary action followed by the primary filled action).
 */
const ModalBetaFooter = ({ children }: ModalBetaFooterProps) => (
  <div className="modal-beta-footer">{children}</div>
);

ModalBetaFooter.displayName = 'ModalBeta.Footer';

export default ModalBetaFooter;
