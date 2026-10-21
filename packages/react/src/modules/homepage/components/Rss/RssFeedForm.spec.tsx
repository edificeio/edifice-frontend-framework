import { fireEvent, render, screen, waitFor } from '~/setup';
import { RssFeedForm, RssFeedFormProps } from './RssFeedForm';

const renderForm = (props: Partial<RssFeedFormProps> = {}) =>
  render(
    <RssFeedForm
      mode="add"
      isSubmitting={false}
      onCancel={vi.fn()}
      onClose={vi.fn()}
      onSubmit={vi.fn()}
      {...props}
    />,
  );

describe('RssFeedForm', () => {
  it('rejects a URL that does not look like an RSS feed', async () => {
    const { user } = renderForm();

    await user.type(screen.getByTestId('rss-input-title'), 'Le Monde');
    await user.type(
      screen.getByTestId('rss-input-link'),
      'https://www.lemonde.fr/index.html',
    );

    expect(
      await screen.findByText(/ne semble pas être un flux RSS valide/),
    ).toBeInTheDocument();
    expect(screen.getByTestId('rss-button-save')).toBeDisabled();
  });

  it('keeps save disabled when the name only contains spaces', async () => {
    const { user } = renderForm();

    await user.type(screen.getByTestId('rss-input-title'), '   ');
    await user.type(
      screen.getByTestId('rss-input-link'),
      'https://www.lemonde.fr/rss/une.xml',
    );

    await waitFor(() =>
      expect(screen.getByTestId('rss-button-save')).toBeDisabled(),
    );
  });

  it('disables save until the form is dirty and valid', async () => {
    const { user } = renderForm();

    const save = screen.getByTestId('rss-button-save');
    expect(save).toBeDisabled();

    await user.type(screen.getByTestId('rss-input-title'), 'Le Monde');
    await user.type(
      screen.getByTestId('rss-input-link'),
      'https://www.lemonde.fr/rss/une.xml',
    );

    await waitFor(() => expect(save).not.toBeDisabled());
  });

  it('prefills the fields with the feed being edited', async () => {
    renderForm({
      mode: 'edit',
      feed: { title: 'Le Monde', link: 'https://www.lemonde.fr/rss/une.xml' },
    });

    expect(screen.getByTestId('rss-input-title')).toHaveValue('Le Monde');
    expect(screen.getByTestId('rss-input-link')).toHaveValue(
      'https://www.lemonde.fr/rss/une.xml',
    );
    // Unchanged values: nothing to save yet.
    await waitFor(() =>
      expect(screen.getByTestId('rss-button-save')).toBeDisabled(),
    );
  });

  it('calls onCancel without submitting when Annuler is clicked', async () => {
    const onCancel = vi.fn();
    const onSubmit = vi.fn();
    const { user } = renderForm({ onCancel, onSubmit });

    await user.click(screen.getByTestId('rss-button-cancel'));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the trimmed form values', async () => {
    const onSubmit = vi.fn();
    const { user } = renderForm({ onSubmit });

    await user.type(screen.getByTestId('rss-input-title'), '  Le Monde  ');
    await user.type(
      screen.getByTestId('rss-input-link'),
      '  https://www.lemonde.fr/rss/une.xml  ',
    );

    const save = screen.getByTestId('rss-button-save');
    await waitFor(() => expect(save).not.toBeDisabled());
    fireEvent.submit(document.getElementById('rss-feed-form')!);

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Le Monde',
        link: 'https://www.lemonde.fr/rss/une.xml',
      }),
    );
  });
});
