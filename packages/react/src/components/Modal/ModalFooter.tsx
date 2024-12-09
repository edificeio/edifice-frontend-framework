import { ReactNode } from 'react';

export interface ModalFooterProps {
  children: ReactNode;
}
/**
 * Modal Footer
 */
const ModalFooter = (props: ModalFooterProps) => (
  <div className="modal-footer">{props.children}</div>
);

ModalFooter.displayName = 'Modal.Footer';

export default ModalFooter;
