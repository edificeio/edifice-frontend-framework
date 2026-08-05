import { Embedder } from '@edifice.io/client';
import { render, screen, waitFor } from '~/setup';
import VideoEmbed from './VideoEmbed';

const { getDefault, getCustom, getProviderFromUrl, getEmbedCodeForProvider } =
  vi.hoisted(() => ({
    getDefault: vi.fn(),
    getCustom: vi.fn(),
    getProviderFromUrl: vi.fn(),
    getEmbedCodeForProvider: vi.fn(),
  }));

vi.mock('@edifice.io/client', () => ({
  odeServices: {
    embedder: () => ({
      getDefault,
      getCustom,
      getProviderFromUrl,
      getEmbedCodeForProvider,
    }),
  },
}));

const youtube = {
  displayName: 'YouTube',
  logo: '/logos/youtube.png',
} as unknown as Embedder;

function setup({ switchType }: { switchType?: () => void } = {}) {
  const onSuccess = vi.fn();

  return {
    ...render(<VideoEmbed onSuccess={onSuccess} switchType={switchType} />),
    onSuccess,
  };
}

const urlField = () =>
  screen.getByPlaceholderText('Insert a Youtube link, Dailymotion, ...');

describe('VideoEmbed', () => {
  beforeEach(() => {
    getDefault.mockResolvedValue([youtube]);
    getCustom.mockResolvedValue([]);
    getProviderFromUrl.mockReturnValue(undefined);
    getEmbedCodeForProvider.mockReturnValue('<iframe src="/embed" />');
  });

  it('asks the platform for its default and custom providers', async () => {
    setup();

    await waitFor(() => expect(getDefault).toHaveBeenCalled());
    expect(getCustom).toHaveBeenCalled();
  });

  it('shows the URL field', async () => {
    setup();
    // Flush the mount-time getDefault()/getCustom() resolution before
    // asserting, so React doesn't warn about it settling afterward.
    await waitFor(() => expect(getDefault).toHaveBeenCalled());

    expect(screen.getByText('Video URL')).toBeInTheDocument();
    expect(urlField()).toBeInTheDocument();
  });

  it('reports the typed URL right away', async () => {
    const { user, onSuccess } = setup();

    await user.type(urlField(), 'https://youtu.be/xyz');

    expect(onSuccess).toHaveBeenLastCalledWith('https://youtu.be/xyz');
  });

  it('reports an empty selection once the field is cleared', async () => {
    const { user, onSuccess } = setup();

    await user.type(urlField(), 'a');
    await user.clear(urlField());

    expect(onSuccess).toHaveBeenLastCalledWith(undefined);
  });

  describe('once the URL is recognised', () => {
    beforeEach(() => {
      getProviderFromUrl.mockReturnValue(youtube);
    });

    it('shows the provider and the embedded preview', async () => {
      const { user } = setup();

      await user.type(urlField(), 'https://youtu.be/xyz');

      expect(await screen.findByText('YouTube')).toBeInTheDocument();
      expect(screen.getByAltText('Logo YouTube')).toHaveAttribute(
        'src',
        '/logos/youtube.png',
      );
      await waitFor(() =>
        expect(
          document.querySelector('.video-embed-preview iframe'),
        ).not.toBeNull(),
      );
    });

    it('reports the embed code rather than the raw URL', async () => {
      const { user, onSuccess } = setup();

      await user.type(urlField(), 'https://youtu.be/xyz');

      await waitFor(() =>
        expect(onSuccess).toHaveBeenLastCalledWith('<iframe src="/embed" />'),
      );
    });

    it('shows the provider without a preview when no embed code is produced', async () => {
      getEmbedCodeForProvider.mockReturnValue('');
      const { user } = setup();

      await user.type(urlField(), 'https://youtu.be/xyz');

      expect(await screen.findByText('YouTube')).toBeInTheDocument();
      expect(document.querySelector('.video-embed-preview')).toBeNull();
    });
  });

  describe('when the URL is not recognised', () => {
    it('explains the preview failed', async () => {
      const { user } = setup();

      await user.type(urlField(), 'https://example.com/video');

      expect(
        await screen.findByText('bbm.video.previewError.title'),
      ).toBeInTheDocument();
    });

    it('reports an empty selection', async () => {
      const { user, onSuccess } = setup();

      await user.type(urlField(), 'https://example.com/video');

      await waitFor(() => expect(onSuccess).toHaveBeenLastCalledWith());
    });

    it('offers to fall back on the embed code', async () => {
      const switchType = vi.fn();
      const { user } = setup({ switchType });

      await user.type(urlField(), 'https://example.com/video');
      await user.click(
        await screen.findByRole('button', {
          name: /Use embed or iframe code/,
        }),
      );

      expect(switchType).toHaveBeenCalledWith('embedder');
    });

    it('offers no fallback when the caller cannot switch', async () => {
      const { user } = setup();

      await user.type(urlField(), 'https://example.com/video');

      await screen.findByText('bbm.video.previewError.title');
      expect(
        screen.queryByRole('button', { name: /Use embed or iframe code/ }),
      ).not.toBeInTheDocument();
    });
  });

  describe('before anything is typed', () => {
    it('offers the embed-code shortcut when the caller can switch', async () => {
      const switchType = vi.fn();
      setup({ switchType });
      await waitFor(() => expect(getDefault).toHaveBeenCalled());

      expect(
        screen.getByRole('button', { name: /Use embed or iframe code/ }),
      ).toBeInTheDocument();
    });

    it('shows nothing else when the caller cannot switch', async () => {
      setup();
      await waitFor(() => expect(getDefault).toHaveBeenCalled());

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });
});
