import { renderHook } from '~/setup';
import useToast from './useToast';

const { toast } = vi.hoisted(() => ({
  toast: {
    custom: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: toast,
}));

describe('useToast', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    ['success', 'success'],
    ['error', 'danger'],
    ['info', 'info'],
    ['warning', 'warning'],
  ])(
    'renders a "%s" toast with the "%s" alert type and default options',
    (method, alertType) => {
      const { result } = renderHook(() => useToast());

      (result.current as any)[method]('Hello');

      const [renderToast, options] = toast.custom.mock.calls[0];
      const element = renderToast({ id: 'toast-id' });

      expect(element.props.type).toBe(alertType);
      expect(element.props.isToast).toBe(true);
      expect(element.props.autoClose).toBe(true);
      expect(element.props.autoCloseDelay).toBe(5000);
      expect(element.props.children).toBe('Hello');
      expect(options).toMatchObject({
        duration: Infinity,
        position: 'top-right',
        id: undefined,
      });
    },
  );

  it('forwards custom options (id, duration, position, isDismissible)', () => {
    const { result } = renderHook(() => useToast());

    result.current.success('Hi', {
      id: 'my-id',
      duration: 1000,
      position: 'bottom-left',
      isDismissible: true,
    });

    const [renderToast, options] = toast.custom.mock.calls[0];
    const element = renderToast({ id: 'my-id' });

    expect(element.props.isDismissible).toBe(true);
    expect(element.props.autoClose).toBe(false);
    expect(element.props.autoCloseDelay).toBe(1000);
    expect(options).toMatchObject({
      id: 'my-id',
      duration: Infinity,
      position: 'bottom-left',
    });
  });

  it('dismisses the underlying toast when the rendered Alert closes', () => {
    const { result } = renderHook(() => useToast());

    result.current.success('Hello');

    const [renderToast] = toast.custom.mock.calls[0];
    const element = renderToast({ id: 'toast-id' });
    element.props.onClose();

    expect(toast.dismiss).toHaveBeenCalledWith('toast-id');
  });

  it('dismisses a toast by id', () => {
    const { result } = renderHook(() => useToast());

    result.current.dismiss('to-dismiss');

    expect(toast.dismiss).toHaveBeenCalledWith('to-dismiss');
  });

  it('removes a toast by id', () => {
    const { result } = renderHook(() => useToast());

    result.current.remove('to-remove');

    expect(toast.remove).toHaveBeenCalledWith('to-remove');
  });

  it('re-exports the loading helper from react-hot-toast', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.loading).toBe(toast.loading);
  });
});
