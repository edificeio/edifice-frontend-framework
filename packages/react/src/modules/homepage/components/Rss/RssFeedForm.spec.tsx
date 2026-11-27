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
    await user.tab();

    expect(await screen.findByText(/URL d’un flux RSS/)).toHaveClass(
      'input-message--invalid',
    );
    expect(screen.queryByText(/flux au format XML/)).not.toBeInTheDocument();
    expect(screen.getByTestId('rss-button-save')).toBeDisabled();
  });

  it.each(['lemonde.fr/rss/une.xml', 'https://lemonde/rss', 'http://x'])(
    'rejects the malformed URL %s',
    async (url) => {
      const { user } = renderForm();

      await user.type(screen.getByTestId('rss-input-title'), 'Le Monde');
      await user.type(screen.getByTestId('rss-input-link'), url);
      await user.tab();

      expect(await screen.findByText(/URL d’un flux RSS/)).toBeInTheDocument();
      expect(screen.getByTestId('rss-button-save')).toBeDisabled();
    },
  );

  it('waits for the link field to be left before showing the error', async () => {
    const { user } = renderForm();

    await user.type(screen.getByTestId('rss-input-link'), 'https://www');

    expect(screen.getByText(/flux au format XML/)).not.toHaveClass(
      'input-message--invalid',
    );
    expect(screen.queryByText(/URL d’un flux RSS/)).not.toBeInTheDocument();
  });

  it('clears the error once the link is fixed', async () => {
    const { user } = renderForm();
    const link = screen.getByTestId('rss-input-link');

    await user.type(screen.getByTestId('rss-input-title'), 'Le Monde');
    await user.type(link, 'https://www.lemonde.fr/index.html');
    await user.tab();
    expect(await screen.findByText(/URL d’un flux RSS/)).toBeInTheDocument();

    await user.clear(link);
    await user.type(link, 'https://www.lemonde.fr/rss/une.xml');

    await waitFor(() =>
      expect(screen.queryByText(/URL d’un flux RSS/)).not.toBeInTheDocument(),
    );
    expect(screen.getByTestId('rss-button-save')).not.toBeDisabled();
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

  it('marks the link input as invalid for assistive technologies', async () => {
    const { user } = renderForm();
    const link = screen.getByTestId('rss-input-link');

    expect(link).toHaveAttribute('aria-invalid', 'false');
    await user.type(link, 'https:lemonde.fr/rss');
    await user.tab();

    await waitFor(() => expect(link).toHaveAttribute('aria-invalid', 'true'));
  });

  it('enables save as soon as a valid link is typed, without leaving it', async () => {
    const { user } = renderForm();

    await user.type(screen.getByTestId('rss-input-title'), 'Le Monde');
    await user.type(
      screen.getByTestId('rss-input-link'),
      'https://www.lemonde.fr/rss/une.xml',
    );

    await waitFor(() =>
      expect(screen.getByTestId('rss-button-save')).not.toBeDisabled(),
    );
  });

  it('flags a stored link that is no longer valid when editing', async () => {
    renderForm({
      mode: 'edit',
      feed: { title: 'Le Monde', link: 'https://www.lemonde.fr/index.html' },
    });

    expect(await screen.findByText(/URL d’un flux RSS/)).toBeInTheDocument();
    expect(screen.getByTestId('rss-input-link')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(screen.getByTestId('rss-button-save')).toBeDisabled();
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
    expect(screen.queryByText(/URL d’un flux RSS/)).not.toBeInTheDocument();
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
