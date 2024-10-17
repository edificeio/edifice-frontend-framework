import { ReactNode } from 'react';

export interface ModalSubtitleProps {
  children: ReactNode;
}
/**
 * Modal Subtitle
 */
const ModalSubtitle = (props: ModalSubtitleProps) => (
  <p className="modal-subtitle">{props.children}</p>
);

ModalSubtitle.displayName = 'Modal.Subtitle';

export default ModalSubtitle;
