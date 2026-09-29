import { fireEvent, render, screen, waitFor } from '~/setup';
import { LinkForm } from './LinkForm';

describe('LinkForm', () => {
  it('shows an https:// example as a placeholder, unfilled, in add mode', () => {
    render(
      <LinkForm
        mode="add"
        isSubmitting={false}
        onCancel={vi.fn()}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const urlInput = screen.getByTestId('usefullinks-input-url');
    expect(urlInput).toHaveValue('');
    expect(urlInput).toHaveAttribute('placeholder', 'https://example.fr');
  });

  it('clears the name field via the clear (×) button', async () => {
    const { user } = render(
      <LinkForm
        mode="add"
        isSubmitting={false}
        onCancel={vi.fn()}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const nameInput = screen.getByTestId('usefullinks-input-name');
    await user.type(nameInput, 'Lumni');
    expect(nameInput).toHaveValue('Lumni');

    await user.click(screen.getByLabelText('clear'));

    expect(nameInput).toHaveValue('');
  });

  it('rejects a URL without an http(s):// scheme', async () => {
    const { user } = render(
      <LinkForm
        mode="add"
        isSubmitting={false}
        onCancel={vi.fn()}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    await user.type(screen.getByTestId('usefullinks-input-name'), 'Lumni');
    const urlInput = screen.getByTestId('usefullinks-input-url');
    await user.clear(urlInput);
    await user.type(urlInput, 'lumni.fr');

    expect(
      await screen.findByText(
        "L'adresse doit être une URL valide (ex. https://exemple.fr)",
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId('usefullinks-button-save')).toBeDisabled();
  });

  it('accepts an http:// URL', async () => {
    const { user } = render(
      <LinkForm
        mode="add"
        isSubmitting={false}
        onCancel={vi.fn()}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    await user.type(screen.getByTestId('usefullinks-input-name'), 'Lumni');
    const urlInput = screen.getByTestId('usefullinks-input-url');
    await user.clear(urlInput);
    await user.type(urlInput, 'http://lumni.fr');

    const save = screen.getByTestId('usefullinks-button-save');
    await waitFor(() => expect(save).not.toBeDisabled());
  });

  it('prefills the fields with the link being edited', () => {
    render(
      <LinkForm
        mode="edit"
        link={{ id: '1', name: 'Lumni', url: 'https://lumni.fr' }}
        isSubmitting={false}
        onCancel={vi.fn()}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByTestId('usefullinks-input-name')).toHaveValue('Lumni');
    expect(screen.getByTestId('usefullinks-input-url')).toHaveValue(
      'https://lumni.fr',
    );
  });

  it('disables save until the form is dirty and valid', async () => {
    const { user } = render(
      <LinkForm
        mode="add"
        isSubmitting={false}
        onCancel={vi.fn()}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const save = screen.getByTestId('usefullinks-button-save');
    expect(save).toBeDisabled();

    await user.type(screen.getByTestId('usefullinks-input-name'), 'Lumni');
    await user.clear(screen.getByTestId('usefullinks-input-url'));
    await user.type(
      screen.getByTestId('usefullinks-input-url'),
      'https://lumni.fr',
    );

    await waitFor(() => expect(save).not.toBeDisabled());
  });

  it('calls onCancel without submitting when Annuler is clicked', async () => {
    const onCancel = vi.fn();
    const onSubmit = vi.fn();
    const { user } = render(
      <LinkForm
        mode="add"
        isSubmitting={false}
        onCancel={onCancel}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByTestId('usefullinks-button-cancel'));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the trimmed form values', async () => {
    const onSubmit = vi.fn();
    const { user } = render(
      <LinkForm
        mode="add"
        isSubmitting={false}
        onCancel={vi.fn()}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.type(screen.getByTestId('usefullinks-input-name'), '  Lumni  ');
    await user.clear(screen.getByTestId('usefullinks-input-url'));
    // No leading whitespace here: the URL pattern requires the field to
    // start with http(s):// to stay valid (and the save button enabled).
    await user.type(
      screen.getByTestId('usefullinks-input-url'),
      'https://lumni.fr  ',
    );

    const save = screen.getByTestId('usefullinks-button-save');
    await waitFor(() => expect(save).not.toBeDisabled());
    fireEvent.submit(document.getElementById('useful-link-form')!);

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Lumni',
        url: 'https://lumni.fr',
      }),
    );
  });
});
