import { renderHook } from '~/setup';
import useHttpErrorToast from './useHttpErrorToast';

const { subscribe, revoke, toastError } = vi.hoisted(() => ({
  subscribe: vi.fn(),
  revoke: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  LAYER_NAME: { TRANSPORT: 'TRANSPORT' },
  odeServices: {
    notify: () => ({
      events: () => ({ subscribe }),
    }),
  },
}));

vi.mock('../..', () => ({
  useToast: () => ({ error: toastError }),
}));

/** Returns the transport-error callback captured by the mocked subscribe(). */
function capturedCallback() {
  return subscribe.mock.calls[0][1] as (event: any) => void;
}

describe('useHttpErrorToast', () => {
  beforeEach(() => {
    subscribe.mockReturnValue({ revoke });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('subscribes to transport errors on mount and revokes on unmount', () => {
    const { unmount } = renderHook(() => useHttpErrorToast({}));

    expect(subscribe).toHaveBeenCalledWith('TRANSPORT', expect.any(Function));

    unmount();
    expect(revoke).toHaveBeenCalled();
  });

  it('does not subscribe when inactive', () => {
    renderHook(() => useHttpErrorToast({ active: false }));

    expect(subscribe).not.toHaveBeenCalled();
  });

  it('maps a known HTTP status to an eXXX i18n key', () => {
    renderHook(() => useHttpErrorToast({}));

    capturedCallback()({ data: { response: { status: 404 } } });

    const [element] = toastError.mock.calls[0];
    expect(element.props.children).toEqual(['e404']);
  });

  it('prefers the payload error key over the status code', () => {
    renderHook(() => useHttpErrorToast({}));

    capturedCallback()({
      data: { response: { status: 404 }, payload: { error: 'custom.error' } },
    });

    const [element] = toastError.mock.calls[0];
    expect(element.props.children).toEqual(['custom.error']);
  });

  it('falls back to the statusText for an unknown status', () => {
    renderHook(() => useHttpErrorToast({}));

    capturedCallback()({
      data: { response: { status: 418, statusText: 'I am a teapot' } },
    });

    const [element] = toastError.mock.calls[0];
    expect(element.props.children).toEqual(['I am a teapot']);
  });

  it('does not toast when there is no usable message', () => {
    renderHook(() => useHttpErrorToast({}));

    capturedCallback()({ data: { response: { status: 418 } } });

    expect(toastError).not.toHaveBeenCalled();
  });

  it('ignores events without data', () => {
    renderHook(() => useHttpErrorToast({}));

    capturedCallback()({});

    expect(toastError).not.toHaveBeenCalled();
  });
});
