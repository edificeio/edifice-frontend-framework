import { IWebApp } from '@edifice.io/client';
import { renderHook } from '~/setup';
import useLibraryUrl from './useLibraryUrl';

const { useEdificeClient } = vi.hoisted(() => ({
  useEdificeClient: vi.fn(),
}));

vi.mock(
  '../../providers/EdificeClientProvider/EdificeClientProvider.hook',
  () => ({ useEdificeClient }),
);

function libraryApp(address: string): IWebApp {
  return {
    name: 'Library',
    address,
    icon: '',
    target: '',
    displayName: 'Library',
    display: true,
    prefix: '',
    casType: '',
    scope: [],
    isExternal: true,
  } as unknown as IWebApp;
}

function mockClient({
  apps = [libraryApp('https://library.edifice.io?platformURL=https://ent.fr')],
  appCode = 'blog',
}: { apps?: IWebApp[]; appCode?: string } = {}) {
  useEdificeClient.mockReturnValue({ user: { apps }, appCode });
}

describe('useLibraryUrl', () => {
  it('builds the search URL for the current app code', () => {
    mockClient();

    const { result } = renderHook(() => useLibraryUrl());

    expect(result.current).toBe(
      'https://library.edifice.io/search/?platformURL=https://ent.fr&application%5B0%5D=Blog&page=1&sort_field=views&sort_order=desc',
    );
  });

  it('honors an explicit app code over the ambient one', () => {
    mockClient({ appCode: 'blog' });

    const { result } = renderHook(() => useLibraryUrl('mindmap'));

    expect(result.current).toContain('application%5B0%5D=MindMap');
  });

  it('leaves the application name empty for an app absent from the map', () => {
    mockClient({ appCode: 'unmapped' });

    const { result } = renderHook(() => useLibraryUrl());

    expect(result.current).toContain('application%5B0%5D=undefined');
  });

  it('does not double the slash when the library host already ends with one', () => {
    mockClient({
      apps: [
        libraryApp('https://library.edifice.io/?platformURL=https://ent.fr'),
      ],
    });

    const { result } = renderHook(() => useLibraryUrl());

    expect(result.current).toContain('https://library.edifice.io/search/?');
  });

  it('returns null when no external library app is exposed', () => {
    mockClient({
      apps: [
        {
          ...libraryApp('https://blog.edifice.io?platformURL=https://ent.fr'),
        },
      ],
    });

    const { result } = renderHook(() => useLibraryUrl());

    expect(result.current).toBeNull();
  });

  it('returns null when the library app is not flagged as external', () => {
    mockClient({
      apps: [
        {
          ...libraryApp(
            'https://library.edifice.io?platformURL=https://ent.fr',
          ),
          isExternal: false,
        } as IWebApp,
      ],
    });

    const { result } = renderHook(() => useLibraryUrl());

    expect(result.current).toBeNull();
  });

  it('returns null when the library address carries no platform URL', () => {
    mockClient({ apps: [libraryApp('https://library.edifice.io')] });

    const { result } = renderHook(() => useLibraryUrl());

    expect(result.current).toBeNull();
  });

  it('returns null when the user has no app at all', () => {
    mockClient({ apps: [] });

    const { result } = renderHook(() => useLibraryUrl());

    expect(result.current).toBeNull();
  });

  it('returns null while the user is not loaded yet', () => {
    useEdificeClient.mockReturnValue({ user: undefined, appCode: 'blog' });

    const { result } = renderHook(() => useLibraryUrl());

    expect(result.current).toBeNull();
  });
});
