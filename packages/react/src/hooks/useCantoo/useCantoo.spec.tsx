import { renderHook, waitFor } from '~/setup';
import useCantoo from './useCantoo';

const { get, useHasWorkflow } = vi.hoisted(() => ({
  get: vi.fn(),
  useHasWorkflow: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: { http: () => ({ get }) },
}));

vi.mock('../useHasWorkflow', () => ({ useHasWorkflow }));

const CANTOO_WORKFLOW =
  'org.entcore.portal.controllers.PortalController|optionalFeatureCantoo';

const script = () =>
  document.getElementById('cantoo-edifice-script') as HTMLScriptElement | null;

describe('useCantoo', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('checks the Cantoo optional-feature workflow', () => {
    useHasWorkflow.mockReturnValue(false);

    renderHook(() => useCantoo());

    expect(useHasWorkflow).toHaveBeenCalledWith(CANTOO_WORKFLOW);
  });

  it('injects the Cantoo script when the workflow is granted', async () => {
    useHasWorkflow.mockReturnValue(true);
    get.mockResolvedValue({ scriptPath: 'https://cantoo.test/script.js' });

    renderHook(() => useCantoo());

    await waitFor(() => expect(script()).not.toBeNull());
    expect(get).toHaveBeenCalledWith('/optionalFeature/cantoo');
    expect(script()?.src).toBe('https://cantoo.test/script.js');
    expect(script()?.async).toBe(true);
  });

  it('does nothing without the workflow', () => {
    useHasWorkflow.mockReturnValue(false);

    renderHook(() => useCantoo());

    expect(get).not.toHaveBeenCalled();
    expect(script()).toBeNull();
  });

  it('does nothing while the workflow right is still unresolved', () => {
    useHasWorkflow.mockReturnValue(undefined);

    renderHook(() => useCantoo());

    expect(get).not.toHaveBeenCalled();
  });

  it('does not inject the script twice', async () => {
    useHasWorkflow.mockReturnValue(true);
    get.mockResolvedValue({ scriptPath: 'https://cantoo.test/script.js' });

    const { unmount } = renderHook(() => useCantoo());
    await waitFor(() => expect(script()).not.toBeNull());
    unmount();

    renderHook(() => useCantoo());

    expect(get).toHaveBeenCalledTimes(1);
    expect(document.querySelectorAll('#cantoo-edifice-script')).toHaveLength(1);
  });

  it('injects nothing when the configuration carries no script path', async () => {
    useHasWorkflow.mockReturnValue(true);
    get.mockResolvedValue({});

    renderHook(() => useCantoo());

    await waitFor(() => expect(get).toHaveBeenCalled());
    expect(script()).toBeNull();
  });

  it('injects nothing when the configuration call resolves empty', async () => {
    useHasWorkflow.mockReturnValue(true);
    get.mockResolvedValue(undefined);

    renderHook(() => useCantoo());

    await waitFor(() => expect(get).toHaveBeenCalled());
    expect(script()).toBeNull();
  });

  it('returns nothing to render', () => {
    useHasWorkflow.mockReturnValue(false);

    const { result } = renderHook(() => useCantoo());

    expect(result.current).toBeNull();
  });
});
