import { act, renderHook, waitFor } from '~/setup';
import useZendeskGuide from './useZendeskGuide';

const {
  get,
  useHasWorkflow,
  useEdificeClient,
  useEdificeTheme,
  useIsAdml,
  useUser,
} = vi.hoisted(() => ({
  get: vi.fn(),
  useHasWorkflow: vi.fn(),
  useEdificeClient: vi.fn(),
  useEdificeTheme: vi.fn(),
  useIsAdml: vi.fn(),
  useUser: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: { http: () => ({ get }) },
}));

vi.mock('..', () => ({ useIsAdml, useUser }));

vi.mock('../useHasWorkflow', () => ({ useHasWorkflow }));

vi.mock(
  '../../providers/EdificeClientProvider/EdificeClientProvider.hook',
  () => ({ useEdificeClient }),
);

vi.mock(
  '../../providers/EdificeThemeProvider/EdificeThemeProvider.hook',
  () => ({
    useEdificeTheme,
  }),
);

type ZendeskMock = ReturnType<typeof vi.fn> & {
  setLocale: ReturnType<typeof vi.fn>;
};

let zE: ZendeskMock;
const initialInnerWidth = window.innerWidth;

const snippet = () =>
  document.getElementById('ze-snippet') as HTMLScriptElement | null;

/** Calls to `zE('webWidget', 'updateSettings', payload)`, payloads only. */
const settings = () =>
  zE.mock.calls
    .filter(
      ([target, action]) =>
        target === 'webWidget' && action === 'updateSettings',
    )
    .map(([, , payload]) => payload);

/** Payloads pushed to the help-center suggestions API. */
const suggestions = () =>
  zE.mock.calls
    .filter(
      ([target, action]) =>
        target === 'webWidget' && action === 'helpCenter:setSuggestions',
    )
    .map(([, , payload]) => payload);

/** Handler registered through `zE('webWidget:on', <event>, handler)`. */
const widgetHandler = (event: string) =>
  zE.mock.calls.find(
    ([target, name]) => target === 'webWidget:on' && name === event,
  )?.[2] as ((...args: unknown[]) => void) | undefined;

function config(overrides: Record<string, unknown> = {}) {
  return {
    key: 'zendesk-key',
    color: '#123456',
    module: { labels: {}, default: 'help', profile: [] },
    ...overrides,
  };
}

/** Renders the hook, then plays the snippet load the browser would trigger. */
async function mountAndLoad({
  response = config(),
  pathname = '/',
}: { response?: unknown; pathname?: string } = {}) {
  get.mockResolvedValue(response);
  window.history.pushState({}, '', pathname);

  renderHook(() => useZendeskGuide());

  const script = await waitFor(() => {
    const element = snippet();
    expect(element).not.toBeNull();
    return element as HTMLScriptElement;
  });

  await act(async () => {
    script.onload?.(new Event('load'));
  });

  return script;
}

describe('useZendeskGuide', () => {
  beforeEach(() => {
    zE = vi.fn() as ZendeskMock;
    zE.setLocale = vi.fn();
    (window as unknown as { zE: ZendeskMock }).zE = zE;

    useHasWorkflow.mockReturnValue(true);
    useEdificeClient.mockReturnValue({ currentLanguage: 'fr' });
    useUser.mockReturnValue({ userDescription: { profiles: ['Teacher'] } });
    useIsAdml.mockReturnValue({ isAdml: false });
    useEdificeTheme.mockReturnValue({ theme: { is1d: false } });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    window.history.pushState({}, '', '/');
    window.innerWidth = initialInnerWidth;
    delete (window as unknown as { zE?: ZendeskMock }).zE;
  });

  describe('snippet injection', () => {
    it('checks the support workflow before doing anything', () => {
      useHasWorkflow.mockReturnValue(undefined);

      renderHook(() => useZendeskGuide());

      expect(useHasWorkflow).toHaveBeenCalledWith(
        'net.atos.entng.support.controllers.DisplayController|view',
      );
      expect(get).not.toHaveBeenCalled();
    });

    it('injects the snippet built from the configuration key', async () => {
      const script = await mountAndLoad();

      expect(get).toHaveBeenCalledWith('/zendeskGuide/config');
      expect(script.src).toBe(
        'https://static.zdassets.com/ekr/snippet.js?key=zendesk-key',
      );
    });

    it('injects nothing when the configuration carries no key', async () => {
      get.mockResolvedValue(config({ key: '' }));

      renderHook(() => useZendeskGuide());

      await waitFor(() => expect(get).toHaveBeenCalled());
      expect(snippet()).toBeNull();
    });

    it('injects nothing when the configuration call resolves empty', async () => {
      get.mockResolvedValue(undefined);

      renderHook(() => useZendeskGuide());

      await waitFor(() => expect(get).toHaveBeenCalled());
      expect(snippet()).toBeNull();
    });

    it('does not fetch the configuration when the snippet is already there', () => {
      const existing = document.createElement('script');
      existing.id = 'ze-snippet';
      document.body.appendChild(existing);

      renderHook(() => useZendeskGuide());

      expect(get).not.toHaveBeenCalled();
    });

    it('returns nothing to render', () => {
      useHasWorkflow.mockReturnValue(undefined);

      const { result } = renderHook(() => useZendeskGuide());

      expect(result.current).toBeNull();
    });
  });

  describe('widget setup on load', () => {
    it('shows the widget', async () => {
      await mountAndLoad();

      expect(zE).toHaveBeenCalledWith('webWidget', 'show');
    });

    it('sets the French locale by default', async () => {
      await mountAndLoad();

      const localeCallback = zE.mock.calls.find(
        ([arg]) => typeof arg === 'function',
      )?.[0] as () => void;
      localeCallback();

      expect(zE.setLocale).toHaveBeenCalledWith('fr');
    });

    it('sets the Latin-American Spanish locale for a Spanish session', async () => {
      useEdificeClient.mockReturnValue({ currentLanguage: 'es' });

      await mountAndLoad();

      const localeCallback = zE.mock.calls.find(
        ([arg]) => typeof arg === 'function',
      )?.[0] as () => void;
      localeCallback();

      expect(zE.setLocale).toHaveBeenCalledWith('es-419');
    });

    it('applies the configured theme color', async () => {
      await mountAndLoad();

      expect(settings()[0]).toMatchObject({
        webWidget: { color: { theme: '#123456' }, zIndex: 3 },
      });
    });

    it('falls back to the Edifice yellow when no color is configured', async () => {
      await mountAndLoad({ response: config({ color: undefined }) });

      expect(settings()[0]).toMatchObject({
        webWidget: { color: { theme: '#ffc400' } },
      });
    });

    it('opens the contact form when the support workflow is granted', async () => {
      await mountAndLoad();

      expect(settings()[0]).toMatchObject({
        webWidget: { contactForm: { suppress: false } },
      });
    });

    it('suppresses the contact form without the support workflow', async () => {
      useHasWorkflow.mockReturnValue(false);

      await mountAndLoad();

      expect(settings()[0]).toMatchObject({
        webWidget: { contactForm: { suppress: true } },
      });
    });

    it('keeps the original-article button by default', async () => {
      await mountAndLoad();

      expect(settings()[0]).toMatchObject({
        webWidget: { helpCenter: { originalArticleButton: true } },
      });
    });

    it('honors an explicitly disabled original-article button', async () => {
      await mountAndLoad({
        response: config({ articleRedirectButton: false }),
      });

      expect(settings()[0]).toMatchObject({
        webWidget: { helpCenter: { originalArticleButton: false } },
      });
    });
  });

  describe('widget events', () => {
    it('hides the mobile launcher label once the page is scrolled', async () => {
      await mountAndLoad();
      const before = settings().length;

      Object.defineProperty(window, 'scrollY', {
        value: 40,
        configurable: true,
      });
      window.dispatchEvent(new Event('scroll'));

      expect(settings()[before]).toMatchObject({
        webWidget: { launcher: { mobile: { labelVisible: false } } },
      });

      Object.defineProperty(window, 'scrollY', {
        value: 0,
        configurable: true,
      });
    });

    it('re-opens the contact form when the widget opens with the workflow', async () => {
      await mountAndLoad();
      const before = settings().length;

      widgetHandler('open')?.();

      expect(settings()[before]).toMatchObject({
        webWidget: { contactForm: { suppress: false } },
      });
    });

    it('leaves the contact form alone when the widget opens without the workflow', async () => {
      useHasWorkflow.mockReturnValue(false);
      await mountAndLoad();
      const before = settings().length;

      widgetHandler('open')?.();

      expect(settings()).toHaveLength(before);
    });

    it('redirects the contact form to the support module', async () => {
      const open = vi.spyOn(window, 'open').mockImplementation(() => null);
      await mountAndLoad();
      const before = settings().length;

      widgetHandler('userEvent')?.({
        category: 'Zendesk Web Widget',
        action: 'Contact Form Shown',
        properties: { name: 'contact-form' },
      });

      expect(settings()[before]).toMatchObject({
        webWidget: { contactForm: { suppress: true } },
      });
      expect(zE).toHaveBeenCalledWith('webWidget', 'close');
      expect(open).toHaveBeenCalledWith('/support/tickets/new', '_blank');
    });

    it('ignores an unrelated widget user event', async () => {
      const open = vi.spyOn(window, 'open').mockImplementation(() => null);
      await mountAndLoad();

      widgetHandler('userEvent')?.({
        category: 'Zendesk Web Widget',
        action: 'Something Else',
        properties: { name: 'contact-form' },
      });

      expect(open).not.toHaveBeenCalled();
      expect(zE).not.toHaveBeenCalledWith('webWidget', 'close');
    });

    it('ignores the contact form event without the support workflow', async () => {
      useHasWorkflow.mockReturnValue(false);
      const open = vi.spyOn(window, 'open').mockImplementation(() => null);
      await mountAndLoad();

      widgetHandler('userEvent')?.({
        category: 'Zendesk Web Widget',
        action: 'Contact Form Shown',
        properties: { name: 'contact-form' },
      });

      expect(open).not.toHaveBeenCalled();
    });
  });

  describe('help-center suggestions', () => {
    it('suggests the label mapped to the current module', async () => {
      await mountAndLoad({
        response: config({
          module: { labels: { blog: 'blog-help' }, default: 'help' },
        }),
        pathname: '/blog/123',
      });

      expect(suggestions()[0]).toEqual({ labels: ['blog-help'] });
    });

    it('joins the pathname segments and drops the numeric ones', async () => {
      await mountAndLoad({
        response: config({
          module: {
            labels: { 'blog/edit': 'blog-edit-help' },
            default: 'help',
          },
        }),
        pathname: '/blog/42/edit',
      });

      expect(suggestions()[0]).toEqual({ labels: ['blog-edit-help'] });
    });

    it('falls back to the default label for an unmapped module', async () => {
      await mountAndLoad({
        response: config({
          module: { labels: { blog: 'blog-help' }, default: 'help' },
        }),
        pathname: '/unmapped',
      });

      expect(suggestions()[0]).toEqual({ labels: ['help'] });
    });

    it('suggests nothing when the configuration exposes no module data', async () => {
      await mountAndLoad({ response: config({ module: {} }) });

      expect(suggestions()).toHaveLength(0);
    });

    it('resolves the adml tag for a local administrator', async () => {
      useIsAdml.mockReturnValue({ isAdml: true });

      await mountAndLoad({
        response: config({
          module: { labels: { blog: 'blog/${adml}' }, default: 'help' },
        }),
        pathname: '/blog',
      });

      expect(suggestions()[0]).toEqual({ labels: ['blog/adml'] });
    });

    it('strips the adml segment for a regular user', async () => {
      await mountAndLoad({
        response: config({
          module: { labels: { blog: 'blog/${adml}' }, default: 'help' },
        }),
        pathname: '/blog',
      });

      expect(suggestions()[0]).toEqual({ labels: ['blog'] });
    });

    it('resolves the profile tag in lower case', async () => {
      await mountAndLoad({
        response: config({
          module: { labels: { blog: 'blog/${profile}' }, default: 'help' },
        }),
        pathname: '/blog',
      });

      expect(suggestions()[0]).toEqual({ labels: ['blog/teacher'] });
    });

    it('resolves the theme tag to 2D by default', async () => {
      await mountAndLoad({
        response: config({
          module: { labels: { blog: 'blog/${theme}' }, default: 'help' },
        }),
        pathname: '/blog',
      });

      expect(suggestions()[0]).toEqual({ labels: ['blog/2D'] });
    });

    it('resolves the theme tag to 1D on a first-degree theme', async () => {
      useEdificeTheme.mockReturnValue({ theme: { is1d: true } });

      await mountAndLoad({
        response: config({
          module: { labels: { blog: 'blog/${theme}' }, default: 'help' },
        }),
        pathname: '/blog',
      });

      expect(suggestions()[0]).toEqual({ labels: ['blog/1D'] });
    });

    it('hides the widget on a collaborative wall opened on a small screen', async () => {
      window.innerWidth = 500;

      await mountAndLoad({
        response: config({
          module: {
            labels: { 'collaborativewall/id': 'cw-help' },
            default: 'help',
          },
        }),
        pathname: '/collaborativewall/id/1',
      });

      expect(zE).toHaveBeenCalledWith('webWidget', 'hide');
      expect(suggestions()[0]).toEqual({ labels: ['cw-help'] });
    });

    it('keeps the widget visible on a collaborative wall on a desktop screen', async () => {
      window.innerWidth = 1440;

      await mountAndLoad({
        response: config({
          module: {
            labels: { 'collaborativewall/id': 'cw-help' },
            default: 'help',
          },
        }),
        pathname: '/collaborativewall/id/1',
      });

      expect(zE).not.toHaveBeenCalledWith('webWidget', 'hide');
    });
  });
});
