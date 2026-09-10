import { useState } from 'react';

import { fireEvent, render, screen } from '~/setup';
import ModalBeta from './ModalBeta';

function OpenableModalBeta({
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
        <ModalBeta
          id="test-modal-beta"
          isOpen={isOpen}
          onModalClose={handleClose}
          focusId={focusId}
        >
          <ModalBeta.Header onModalClose={handleClose}>
            Modal title
          </ModalBeta.Header>
          <ModalBeta.Body>
            <button id="action-button">Action</button>
          </ModalBeta.Body>
        </ModalBeta>
      )}
    </>
  );
}

function getCloseButton() {
  return screen.getByTestId('button-beta');
}

describe('ModalBeta', () => {
  it('does not render when isOpen is false', () => {
    render(
      <ModalBeta id="closed-modal-beta" isOpen={false} onModalClose={vi.fn()}>
        <ModalBeta.Body>Content</ModalBeta.Body>
      </ModalBeta>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the dialog with its content when isOpen is true', () => {
    render(<OpenableModalBeta />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Modal title')).toBeInTheDocument();
  });

  it('applies the size class', () => {
    render(
      <ModalBeta id="sized-modal-beta" isOpen size="l" onModalClose={vi.fn()}>
        <ModalBeta.Body>Content</ModalBeta.Body>
      </ModalBeta>,
    );

    expect(screen.getByRole('dialog')).toHaveClass('modal-beta--l');
  });

  it('focuses the close button by default', () => {
    render(<OpenableModalBeta />);

    expect(document.activeElement).toBe(getCloseButton());
  });

  it('focuses the element referenced by focusId instead of the close button', () => {
    render(<OpenableModalBeta focusId="action-button" />);

    expect(document.activeElement).toHaveAttribute('id', 'action-button');
  });

  it('calls onModalClose when the header close button is clicked', async () => {
    const onClose = vi.fn();
    const { user } = render(<OpenableModalBeta onClose={onClose} />);

    await user.click(getCloseButton());

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onModalClose on Escape', () => {
    const onClose = vi.fn();
    render(<OpenableModalBeta onClose={onClose} />);

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onModalClose when clicking outside the dialog', () => {
    const onClose = vi.fn();
    render(<OpenableModalBeta onClose={onClose} />);

    fireEvent.mouseDown(document.body);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders the optional subtitle', () => {
    render(
      <ModalBeta id="subtitle-modal-beta" isOpen onModalClose={vi.fn()}>
        <ModalBeta.Header onModalClose={vi.fn()} subtitle="Subtext">
          Title
        </ModalBeta.Header>
      </ModalBeta>,
    );

    expect(screen.getByText('Subtext')).toBeInTheDocument();
  });

  it('traps focus inside the dialog, wrapping Tab/Shift+Tab between first and last elements', () => {
    render(<OpenableModalBeta />);

    const dialogContent = document.getElementById(
      'test-modal-beta_ref',
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
