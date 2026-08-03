import { render, renderHook } from '~/setup';
import { useAutosizeTextarea } from './useAutosizeTextarea';

/** jsdom always reports a zero scrollHeight, so it is faked per test. */
function stubScrollHeight(value: number) {
  const descriptor = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'scrollHeight',
  );

  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get: () => value,
  });

  return () => {
    if (descriptor) {
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', descriptor);
    }
  };
}

function Textarea({
  autoFocus,
  defaultValue = '',
}: {
  autoFocus?: boolean;
  defaultValue?: string;
}) {
  const [ref, onFocus, resize] = useAutosizeTextarea(autoFocus);

  return (
    <textarea
      ref={ref}
      defaultValue={defaultValue}
      onFocus={onFocus}
      onChange={resize}
      data-testid="textarea"
    />
  );
}

describe('useAutosizeTextarea', () => {
  it('grows the textarea to its content height', () => {
    const restore = stubScrollHeight(120);

    const { getByTestId } = render(<Textarea />);

    expect(getByTestId('textarea')).toHaveStyle({ height: '120px' });
    restore();
  });

  it('recomputes the height when the content changes', async () => {
    const restore = stubScrollHeight(60);
    const { getByTestId, user } = render(<Textarea />);

    expect(getByTestId('textarea')).toHaveStyle({ height: '60px' });

    restore();
    const grown = stubScrollHeight(180);
    await user.type(getByTestId('textarea'), 'a longer content');

    expect(getByTestId('textarea')).toHaveStyle({ height: '180px' });
    grown();
  });

  it('focuses the textarea when asked to', () => {
    const { getByTestId } = render(<Textarea autoFocus />);

    expect(getByTestId('textarea')).toHaveFocus();
  });

  it('leaves the focus alone by default', () => {
    const { getByTestId } = render(<Textarea />);

    expect(getByTestId('textarea')).not.toHaveFocus();
  });

  it('places the caret at the end of the existing content on focus', async () => {
    const { getByTestId, user } = render(<Textarea defaultValue="bonjour" />);
    const textarea = getByTestId('textarea') as HTMLTextAreaElement;

    await user.click(textarea);

    expect(textarea.selectionStart).toBe('bonjour'.length);
    expect(textarea.selectionEnd).toBe('bonjour'.length);
  });

  it('does nothing when no element is attached to the ref', () => {
    const { result } = renderHook(() => useAutosizeTextarea());
    const [ref, , resize] = result.current;

    expect(ref.current).toBeNull();
    expect(() => resize()).not.toThrow();
  });
});
