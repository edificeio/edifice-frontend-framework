import { render, screen } from '~/setup';
import { Status } from '../../../types';
import UploadCard, { UploadItemProps } from './UploadCard';

function item(partial: Partial<UploadItemProps> = {}): UploadItemProps {
  return {
    src: '/workspace/document/image-id',
    name: 'photo.png',
    info: { type: 'image/png', weight: '1,2 Mo' },
    ...partial,
  };
}

function setup({
  status = 'idle' as Status,
  ...overrides
}: { status?: Status; item?: UploadItemProps } = {}) {
  const onDelete = vi.fn();
  const onEdit = vi.fn();
  const onRetry = vi.fn();

  return {
    ...render(
      <UploadCard
        item={overrides.item ?? item()}
        status={status}
        onDelete={onDelete}
        onEdit={onEdit}
        onRetry={onRetry}
      />,
    ),
    onDelete,
    onEdit,
    onRetry,
  };
}

const deleteButton = () => screen.getByRole('button', { name: 'Delete file' });
const editButton = () => screen.getByRole('button', { name: 'Loading' });

describe('UploadCard', () => {
  it('shows the file name', () => {
    setup();

    expect(screen.getByText('photo.png')).toBeInTheDocument();
  });

  describe('idle', () => {
    it('offers no action at all', () => {
      setup();

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('shows the placeholder image', () => {
      const { container } = setup();

      expect(container.querySelector('.card-image img')).not.toBeNull();
    });
  });

  describe('loading', () => {
    it('shows a spinner and offers to delete', () => {
      setup({ status: 'loading' });

      expect(deleteButton()).toBeInTheDocument();
      expect(document.querySelector('.text-secondary')).not.toBeNull();
    });

    it('keeps the edit action disabled', () => {
      setup({ status: 'loading' });

      expect(editButton()).toBeDisabled();
    });
  });

  describe('success', () => {
    it('shows the uploaded image and its type and weight', () => {
      setup({ status: 'success' });

      expect(screen.getByText(/image\/png/)).toBeInTheDocument();
      expect(screen.getByText(/1,2 Mo/)).toBeInTheDocument();
    });

    it('enables the edit action on an image', async () => {
      const { user, onEdit } = setup({ status: 'success' });

      await user.click(editButton());

      expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it('offers no edit action on a document', () => {
      setup({
        status: 'success',
        item: item({ info: { type: 'application/pdf', weight: '2 Mo' } }),
      });

      expect(
        screen.queryByRole('button', { name: 'Loading' }),
      ).not.toBeInTheDocument();
    });

    it('shows the type alone when the weight is unknown', () => {
      setup({
        status: 'success',
        item: item({ info: { type: 'image/png', weight: '' } }),
      });

      expect(screen.getByText('image/png')).toBeInTheDocument();
    });

    it('offers no edit action without any file info', () => {
      setup({ status: 'success', item: item({ info: undefined }) });

      expect(
        screen.queryByRole('button', { name: 'Loading' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('error', () => {
    it('explains the upload failed and offers to retry', async () => {
      const { user, onRetry } = setup({ status: 'error' });

      expect(screen.getByText('Error during upload')).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'Retry' }));

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('keeps the edit action disabled', () => {
      setup({ status: 'error' });

      expect(editButton()).toBeDisabled();
    });
  });

  it('deletes the file on demand', async () => {
    const { user, onDelete } = setup({ status: 'success' });

    await user.click(deleteButton());

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('treats the warning status like the idle one', () => {
    setup({ status: 'warning' });

    // Warning shares the default mapping, but the action bar is shown.
    expect(deleteButton()).toBeInTheDocument();
    expect(screen.queryByText('Error during upload')).not.toBeInTheDocument();
  });
});
