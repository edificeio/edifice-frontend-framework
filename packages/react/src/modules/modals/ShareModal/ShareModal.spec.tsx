import { forwardRef, useImperativeHandle } from 'react';

import { render, screen } from '~/setup';
import ShareResourceModal from './ShareModal';
import type { ShareOptions, ShareResourcesRef } from './ShareResources';

// Stub out ShareResources entirely: ShareResources.tsx has its own dedicated
// spec, so here we only want to exercise ShareModal.tsx's own wiring (the
// Cancel/Share buttons, the isSaving state, and the children slot).
const { handleShare } = vi.hoisted(() => ({
  handleShare: vi.fn(),
}));

vi.mock('./ShareResources', () => ({
  default: forwardRef<
    ShareResourcesRef,
    { onSubmit?: (isSubmitting: boolean) => void }
  >(({ onSubmit }, ref) => {
    useImperativeHandle(ref, () => ({ handleShare }));
    return (
      <div data-testid="share-resources-stub">
        <button
          type="button"
          data-testid="stub-submit-true"
          onClick={() => onSubmit?.(true)}
        >
          submit true
        </button>
        <button
          type="button"
          data-testid="stub-submit-false"
          onClick={() => onSubmit?.(false)}
        >
          submit false
        </button>
      </div>
    );
  }),
}));

const shareOptions: ShareOptions = {
  resourceId: 'resource-1',
  resourceRights: [],
  resourceCreatorId: 'creator-id',
};

describe('ShareModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls onCancel when the Cancel button is clicked', async () => {
    const onCancel = vi.fn();
    const onSuccess = vi.fn();

    const { user } = render(
      <ShareResourceModal
        isOpen
        shareOptions={shareOptions}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'explorer.cancel' }));

    expect(onCancel).toHaveBeenCalled();
  });

  it('calls the stubbed ShareResources handleShare when the Share button is clicked', async () => {
    const onCancel = vi.fn();
    const onSuccess = vi.fn();

    const { user } = render(
      <ShareResourceModal
        isOpen
        shareOptions={shareOptions}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'share' }));

    expect(handleShare).toHaveBeenCalled();
  });

  it('disables both footer buttons while isSaving is true, driven by the onSubmit callback', async () => {
    const onCancel = vi.fn();
    const onSuccess = vi.fn();

    const { user } = render(
      <ShareResourceModal
        isOpen
        shareOptions={shareOptions}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />,
    );

    const cancelButton = screen.getByRole('button', {
      name: 'explorer.cancel',
    });
    const shareButton = screen.getByRole('button', { name: 'share' });

    expect(cancelButton).toBeEnabled();
    expect(shareButton).toBeEnabled();

    await user.click(screen.getByTestId('stub-submit-true'));

    expect(cancelButton).toBeDisabled();
    expect(shareButton).toBeDisabled();

    await user.click(screen.getByTestId('stub-submit-false'));

    expect(cancelButton).toBeEnabled();
    expect(shareButton).toBeEnabled();
  });

  it('renders children inside the modal body, after ShareResources', () => {
    render(
      <ShareResourceModal
        isOpen
        shareOptions={shareOptions}
        onSuccess={vi.fn()}
        onCancel={vi.fn()}
      >
        <div data-testid="app-specific-child">Extra app content</div>
      </ShareResourceModal>,
    );

    expect(screen.getByTestId('app-specific-child')).toBeInTheDocument();
    expect(screen.getByTestId('share-resources-stub')).toBeInTheDocument();
  });
});
