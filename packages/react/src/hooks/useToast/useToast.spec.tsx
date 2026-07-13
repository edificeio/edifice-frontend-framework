import { renderHook } from '~/setup';
import useToast from './useToast';

const { toast } = vi.hoisted(() => ({
  toast: {
    custom: vi.fn(() => 'toast-id'),
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

      const [element, options] = toast.custom.mock.calls[0];
      expect(element.props.type).toBe(alertType);
      expect(element.props.isToast).toBe(true);
      expect(element.props.children).toBe('Hello');
      expect(options).toMatchObject({
        duration: 5000,
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

    const [element, options] = toast.custom.mock.calls[0];
    expect(element.props.isDismissible).toBe(true);
    expect(options).toMatchObject({
      id: 'my-id',
      duration: 1000,
      position: 'bottom-left',
    });
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
