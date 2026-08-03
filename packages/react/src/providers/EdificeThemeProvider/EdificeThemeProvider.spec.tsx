import { render, screen, waitFor } from '~/setup';
import { useEdificeTheme } from './EdificeThemeProvider.hook';
import { EdificeThemeProvider } from './EdificeThemeProvider';

const { useConf, useEdificeClient } = vi.hoisted(() => ({
  useConf: vi.fn(),
  useEdificeClient: vi.fn(),
}));

vi.mock('../../hooks/useConf', () => ({ useConf }));

vi.mock('../EdificeClientProvider/EdificeClientProvider.hook', () => ({
  useEdificeClient,
}));

vi.mock('../AntThemeProvider/AntProvider', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

function ThemeConsumer() {
  const { theme } = useEdificeTheme();
  return <span data-testid="skin">{theme?.skinName ?? 'no-theme'}</span>;
}

const html = () => document.querySelector('html') as HTMLElement;
const favicon = () => document.getElementById('favicon') as HTMLAnchorElement;

function mockConf(theme?: Record<string, unknown>) {
  useConf.mockReturnValue(theme ? { data: { theme } } : { data: undefined });
}

function renderProvider(defaultTheme?: string) {
  return render(
    <EdificeThemeProvider defaultTheme={defaultTheme}>
      <ThemeConsumer />
    </EdificeThemeProvider>,
  );
}

describe('EdificeThemeProvider', () => {
  beforeEach(() => {
    useEdificeClient.mockReturnValue({ appCode: 'blog' });

    // The provider writes into a #favicon link the host page is expected to own.
    const link = document.createElement('a');
    link.id = 'favicon';
    document.body.appendChild(link);
  });

  afterEach(() => {
    favicon()?.remove();
    ['data-skin', 'data-theme', 'data-product'].forEach((attribute) =>
      html().removeAttribute(attribute),
    );
  });

  it('queries the configuration of the current application', () => {
    mockConf({ skinName: 'default' });

    renderProvider();

    expect(useConf).toHaveBeenCalledWith({ appCode: 'blog' });
  });

  it('exposes the theme to its consumers', async () => {
    mockConf({ skinName: 'cursus' });

    renderProvider();

    expect(await screen.findByTestId('skin')).toHaveTextContent('cursus');
  });

  it('exposes no theme while the configuration is loading', () => {
    mockConf(undefined);

    renderProvider();

    expect(screen.getByTestId('skin')).toHaveTextContent('no-theme');
  });

  it('points the favicon at the theme base path', async () => {
    mockConf({ basePath: '/assets/themes/cursus' });

    renderProvider();

    await waitFor(() =>
      expect(favicon().href).toContain(
        '/assets/themes/cursus/img/illustrations/favicon.ico',
      ),
    );
  });

  it('writes the skin and theme names on the html element', async () => {
    mockConf({ skinName: 'cursus', themeName: 'cursus-theme' });

    renderProvider();

    await waitFor(() => {
      expect(html()).toHaveAttribute('data-skin', 'cursus');
      expect(html()).toHaveAttribute('data-theme', 'cursus-theme');
    });
  });

  it('prefers the npm theme over the theme name', async () => {
    mockConf({ themeName: 'cursus-theme', npmTheme: 'npm-theme' });

    renderProvider();

    await waitFor(() =>
      expect(html()).toHaveAttribute('data-theme', 'npm-theme'),
    );
  });

  it('derives the product from the last segment of the bootstrap version', async () => {
    mockConf({ bootstrapVersion: 'ode-bootstrap-neo' });

    renderProvider();

    await waitFor(() => expect(html()).toHaveAttribute('data-product', 'neo'));
  });

  it('lets an explicit default theme win over the bootstrap version', async () => {
    mockConf({ bootstrapVersion: 'ode-bootstrap-neo' });

    renderProvider('one');

    await waitFor(() => expect(html()).toHaveAttribute('data-product', 'one'));
  });

  it('empties the product for the "none" default theme', async () => {
    mockConf({ bootstrapVersion: 'ode-bootstrap-neo' });

    renderProvider('none');

    await waitFor(() => expect(html()).toHaveAttribute('data-product', ''));
  });

  // Nothing guards the undefined case, so the attribute is set to the string
  // "undefined" rather than left out.
  it('writes a literal "undefined" product without a bootstrap version', async () => {
    mockConf({ skinName: 'default' });

    renderProvider();

    await waitFor(() =>
      expect(html()).toHaveAttribute('data-product', 'undefined'),
    );
  });
});
