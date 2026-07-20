import { useState } from 'react';

import { fireEvent, render, screen } from '~/setup';
import Modal from './Modal';

function OpenableModal({
  focusId,
  onClose,
}: {
  focusId?: string;
  onClose?: () => void;
} = {}) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <>
      {isOpen && (
        <Modal
          id="test-modal"
          isOpen={isOpen}
          onModalClose={handleClose}
          focusId={focusId}
        >
          <Modal.Header onModalClose={handleClose}>Modal title</Modal.Header>
          <Modal.Body>
            <button id="action-button">Action</button>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

function getCloseButton() {
  return document.querySelector('.btn-close') as HTMLElement;
}

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal id="closed-modal" isOpen={false} onModalClose={vi.fn()}>
        <Modal.Body>Content</Modal.Body>
      </Modal>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the dialog with its content when isOpen is true', () => {
    render(<OpenableModal />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Modal title')).toBeInTheDocument();
  });

  it('focuses the close button by default', () => {
    render(<OpenableModal />);

    expect(document.activeElement).toBe(getCloseButton());
  });

  it('focuses the element referenced by focusId instead of the close button', () => {
    render(<OpenableModal focusId="action-button" />);

    expect(document.activeElement).toHaveAttribute('id', 'action-button');
  });

  it('calls onModalClose when the header close button is clicked', async () => {
    const onClose = vi.fn();
    const { user } = render(<OpenableModal onClose={onClose} />);

    await user.click(getCloseButton());

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onModalClose on Escape', () => {
    const onClose = vi.fn();
    render(<OpenableModal onClose={onClose} />);

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onModalClose when clicking outside the dialog', () => {
    const onClose = vi.fn();
    render(<OpenableModal onClose={onClose} />);

    fireEvent.mouseDown(document.body);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('traps focus inside the dialog, wrapping Tab/Shift+Tab between first and last elements', () => {
    render(<OpenableModal />);

    const dialogContent = document.getElementById(
      'test-modal_ref',
    ) as HTMLElement;
    const closeButton = getCloseButton();
    const actionButton = screen.getByText('Action');

    expect(document.activeElement).toBe(closeButton);

    fireEvent.keyDown(dialogContent, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(actionButton);

    fireEvent.keyDown(dialogContent, { key: 'Tab' });
    expect(document.activeElement).toBe(closeButton);
  });
});
