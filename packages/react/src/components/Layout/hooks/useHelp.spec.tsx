import { render, renderHook, screen, waitFor } from '~/setup';
import { useHelp } from './useHelp';

const { useEdificeClient, useEdificeTheme } = vi.hoisted(() => ({
  useEdificeClient: vi.fn(),
  useEdificeTheme: vi.fn(),
}));

vi.mock(
  '../../../providers/EdificeClientProvider/EdificeClientProvider.hook',
  () => ({ useEdificeClient }),
);

vi.mock(
  '../../../providers/EdificeThemeProvider/EdificeThemeProvider.hook',
  () => ({ useEdificeTheme }),
);

const fetchMock = vi.fn();

// Minimal help page: a headline, a table of contents and two sections.
// Two constraints come from how the hook reads the parsed tree: the string must
// start on the `<html>` tag (a leading text node would make the parser return an
// array, which the hook does not look into), and `<html>` needs a second child
// besides `<body>` — the hook calls `.find()` on its children, which is only an
// array when there are several.
const helpPage =
  '<html><head><title>Aide</title></head><body>' +
  '<p>Aide en ligne</p>' +
  '<div id="TOC"><ul>' +
  '<li><a href="#présentation">Présentation</a></li>' +
  '<li><a href="#creation">Création</a></li>' +
  '</ul></div>' +
  '<div class="section level2" id="présentation">' +
  '<h2>Titre présentation</h2><img src="images/screen.png" />' +
  '</div>' +
  '<div class="section level2" id="creation"><h2>Titre création</h2></div>' +
  '</body></html>';

function mockFetch({
  status = 200,
  html = helpPage,
}: { status?: number; html?: string } = {}) {
  fetchMock.mockResolvedValue({ status, text: async () => html });
}

function HelpContent({
  workflow = true,
}: {
  workflow?: boolean | Record<string, boolean>;
}) {
  const { parsedContent, parsedHeadline, error } = useHelp(workflow);

  return (
    <div>
      {error && <span>help-error</span>}
      {parsedHeadline && <span data-testid="headline">{parsedHeadline}</span>}
      {parsedContent}
    </div>
  );
}

describe('useHelp', () => {
  beforeEach(() => {
    useEdificeClient.mockReturnValue({ appCode: 'blog' });
    useEdificeTheme.mockReturnValue({ theme: { is1d: false } });
    vi.stubGlobal('fetch', fetchMock);
    mockFetch();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.history.pushState({}, '', '/');
  });

  describe('help URL resolution', () => {
    it('does not fetch anything without the legacy help workflow', () => {
      renderHook(() => useHelp(false));

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('targets the help page of the current application', async () => {
      renderHook(() => useHelp(true));

      await waitFor(() =>
        expect(fetchMock).toHaveBeenCalledWith('/help-2d/application/blog/'),
      );
    });

    it('targets the first-degree help path on a 1D theme', async () => {
      useEdificeTheme.mockReturnValue({ theme: { is1d: true } });

      renderHook(() => useHelp(true));

      await waitFor(() =>
        expect(fetchMock).toHaveBeenCalledWith('/help-1d/application/blog/'),
      );
    });

    it('falls back to the portal help page without an application code', async () => {
      useEdificeClient.mockReturnValue({ appCode: '' });

      renderHook(() => useHelp(true));

      await waitFor(() =>
        expect(fetchMock).toHaveBeenCalledWith('/help-2d/application/portal/'),
      );
    });

    it('reads the application from the eliot parameter on the adapter route', async () => {
      window.history.pushState({}, '', '/adapter?eliot=mon-appli&other=1');

      renderHook(() => useHelp(true));

      await waitFor(() =>
        expect(fetchMock).toHaveBeenCalledWith(
          '/help-2d/application/mon-appli/',
        ),
      );
    });

    it('maps the class administration route to its own help page', async () => {
      window.history.pushState({}, '', '/directory/class-admin/1234');

      renderHook(() => useHelp(true));

      await waitFor(() =>
        expect(fetchMock).toHaveBeenCalledWith(
          '/help-2d/application/parametrage-de-la-classe/',
        ),
      );
    });

    it.each([
      '/userbook/mon-compte',
      '/timeline/preferencesView',
      '/timeline/historyView',
    ])('maps %s to the userbook help page', async (pathname) => {
      window.history.pushState({}, '', pathname);

      renderHook(() => useHelp(true));

      await waitFor(() =>
        expect(fetchMock).toHaveBeenCalledWith(
          '/help-2d/application/userbook/',
        ),
      );
    });

    // hasOldHelpEnableWorkflow comes from useHasWorkflow, which starts
    // undefined and resolves asynchronously — the effect must depend on it
    // so the fetch still fires once the right is confirmed.
    it('refetches once the workflow flag resolves to true', async () => {
      const { rerender } = renderHook(
        ({ workflow }: { workflow: boolean }) => useHelp(workflow),
        { initialProps: { workflow: false } },
      );

      expect(fetchMock).not.toHaveBeenCalled();

      rerender({ workflow: true });

      await waitFor(() =>
        expect(fetchMock).toHaveBeenCalledWith('/help-2d/application/blog/'),
      );
    });
  });

  describe('error handling', () => {
    it('flags an error on a missing help page', async () => {
      mockFetch({ status: 404, html: 'not found' });

      const { result } = renderHook(() => useHelp(true));

      await waitFor(() => expect(result.current.error).toBe(true));
      expect(result.current.html).toBe('');
    });

    it('flags an error when the request fails', async () => {
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      fetchMock.mockRejectedValue(new Error('network down'));

      const { result } = renderHook(() => useHelp(true));

      await waitFor(() => expect(result.current.error).toBe(true));
      expect(consoleError).toHaveBeenCalled();
    });

    it('clears the error flag on a successful fetch', async () => {
      const { result } = renderHook(() => useHelp(true));

      await waitFor(() => expect(result.current.html).not.toBe(''));
      expect(result.current.error).toBe(false);
    });
  });

  describe('parsed content', () => {
    it('extracts the headline from the first paragraph of the body', async () => {
      render(<HelpContent />);

      expect(await screen.findByTestId('headline')).toHaveTextContent(
        'Aide en ligne',
      );
    });

    // A hidden section is out of the accessibility tree, so the assertions go
    // through the DOM rather than through a role query.
    it('shows the active section and hides the others', async () => {
      render(<HelpContent />);

      await screen.findByRole('heading', { name: 'Titre présentation' });

      expect(document.getElementById('présentation')).not.toHaveAttribute(
        'hidden',
      );
      expect(document.getElementById('creation')).toHaveAttribute('hidden');
    });

    it('rewrites the section images against the help path', async () => {
      render(<HelpContent />);

      await waitFor(() =>
        expect(document.querySelector('img')).toHaveAttribute(
          'src',
          '/help-2d/images/screen.png',
        ),
      );
    });

    it('switches the visible section when a table-of-contents entry is clicked', async () => {
      const { user } = render(<HelpContent />);

      const entry = await screen.findByText('Création');
      await user.click(entry);

      expect(document.getElementById('creation')).not.toHaveAttribute('hidden');
      expect(document.getElementById('présentation')).toHaveAttribute('hidden');
    });

    it('collapses the table of contents through its burger button', async () => {
      const { user } = render(<HelpContent />);

      await screen.findByText('Création');
      const list = document.getElementById('TOC-list');
      expect(list).toHaveStyle({ display: 'block' });

      await user.click(screen.getByRole('button'));

      expect(document.getElementById('TOC-list')).toHaveStyle({
        display: 'none',
      });
    });

    it('exposes no parsed content before the page is loaded', () => {
      const { result } = renderHook(() => useHelp(false));

      expect(result.current.html).toBe('');
      expect(result.current.parsedContent).toBeUndefined();
      expect(result.current.parsedHeadline).toBeUndefined();
    });
  });

  describe('modal state', () => {
    it('starts closed and opens on demand', async () => {
      const { result } = renderHook(() => useHelp(false));

      expect(result.current.isModalOpen).toBe(false);

      await waitFor(() => {
        result.current.setIsModalOpen(true);
      });

      expect(result.current.isModalOpen).toBe(true);
    });
  });
});
