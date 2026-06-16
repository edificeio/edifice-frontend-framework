import { fireEvent, render, screen } from '~/setup';
import useTrapFocus from './useTrapFocus';

function TestComponent({ isActive }: { isActive?: boolean }) {
  const ref = useTrapFocus(isActive);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} data-testid="container">
      <button>first</button>
      <button>last</button>
    </div>
  );
}

describe('useTrapFocus', () => {
  it('wraps focus from the last to the first element on Tab', () => {
    render(<TestComponent isActive />);
    const container = screen.getByTestId('container');
    const first = screen.getByText('first');
    const last = screen.getByText('last');

    last.focus();
    expect(document.activeElement).toBe(last);

    fireEvent.keyDown(container, { key: 'Tab' });

    expect(document.activeElement).toBe(first);
  });

  it('wraps focus from the first to the last element on Shift+Tab', () => {
    render(<TestComponent isActive />);
    const container = screen.getByTestId('container');
    const first = screen.getByText('first');
    const last = screen.getByText('last');

    first.focus();
    expect(document.activeElement).toBe(first);

    fireEvent.keyDown(container, { key: 'Tab', shiftKey: true });

    expect(document.activeElement).toBe(last);
  });

  it('does not trap focus when inactive', () => {
    render(<TestComponent isActive={false} />);
    const container = screen.getByTestId('container');
    const last = screen.getByText('last');

    last.focus();
    fireEvent.keyDown(container, { key: 'Tab' });

    // Focus is left untouched because the listener is not attached.
    expect(document.activeElement).toBe(last);
  });

  it('ignores keys other than Tab', () => {
    render(<TestComponent isActive />);
    const container = screen.getByTestId('container');
    const last = screen.getByText('last');

    last.focus();
    fireEvent.keyDown(container, { key: 'Enter' });

    expect(document.activeElement).toBe(last);
  });
});
