import { render, screen } from '~/setup';
import ConfirmModal from './ConfirmModal';

describe('ConfirmModal', () => {
  it('renders default yes/no labels for the "yes/no" variant', () => {
    render(<ConfirmModal id="confirm-modal" isOpen={true} />);

    // The "yes"/"no" translation keys are not defined in the test locale,
    // so i18next falls back to returning the key itself as the label.
    expect(screen.getByRole('button', { name: 'yes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'no' })).toBeInTheDocument();
  });

  it('renders ok/cancel labels for the "ok/cancel" variant', () => {
    render(
      <ConfirmModal id="confirm-modal" isOpen={true} variant="ok/cancel" />,
    );

    // "ok" is missing from the test locale (returns the key itself), while
    // "cancel" is defined and resolves to "Cancel".
    expect(screen.getByRole('button', { name: 'ok' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('uses okText/koText translations instead of the variant defaults when provided', () => {
    render(
      <ConfirmModal
        id="confirm-modal"
        isOpen={true}
        okText="cancel"
        koText="search"
      />,
    );

    // "cancel" and "search" are both defined in the test locale, and take
    // over the default "yes"/"no" labels for this variant.
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'yes' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'no' }),
    ).not.toBeInTheDocument();
  });

  it('calls onCancel when the cancel/no button is clicked', async () => {
    const onCancel = vi.fn();
    const { user } = render(
      <ConfirmModal id="confirm-modal" isOpen={true} onCancel={onCancel} />,
    );

    await user.click(screen.getByRole('button', { name: 'no' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onSuccess when the success/yes button is clicked', async () => {
    const onSuccess = vi.fn();
    const { user } = render(
      <ConfirmModal id="confirm-modal" isOpen={true} onSuccess={onSuccess} />,
    );

    await user.click(screen.getByRole('button', { name: 'yes' }));

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('renders the header and body content', () => {
    render(
      <ConfirmModal
        id="confirm-modal"
        isOpen={true}
        header={<span>Confirm header</span>}
        body={<span>Confirm body</span>}
      />,
    );

    expect(screen.getByText('Confirm header')).toBeInTheDocument();
    expect(screen.getByText('Confirm body')).toBeInTheDocument();
  });

  it('does not render the modal content when isOpen is false', () => {
    render(<ConfirmModal id="confirm-modal" isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'yes' }),
    ).not.toBeInTheDocument();
  });
});
