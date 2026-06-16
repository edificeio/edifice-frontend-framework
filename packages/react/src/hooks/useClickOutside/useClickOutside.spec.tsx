import { fireEvent, render, screen } from '~/setup';
import useClickOutside from './useClickOutside';

function TestComponent({
  handler,
  events,
}: {
  handler: () => void;
  events?: string[] | null;
}) {
  const ref = useClickOutside<HTMLDivElement>(handler, events);
  return (
    <div>
      <div ref={ref} data-testid="inside">
        inside
      </div>
      <div data-testid="outside">outside</div>
    </div>
  );
}

describe('useClickOutside', () => {
  it('calls the handler when clicking outside the referenced element', () => {
    const handler = vi.fn();
    render(<TestComponent handler={handler} />);

    fireEvent.mouseDown(screen.getByTestId('outside'));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call the handler when clicking inside the referenced element', () => {
    const handler = vi.fn();
    render(<TestComponent handler={handler} />);

    fireEvent.mouseDown(screen.getByTestId('inside'));

    expect(handler).not.toHaveBeenCalled();
  });

  it('listens to custom events when provided', () => {
    const handler = vi.fn();
    render(<TestComponent handler={handler} events={['click']} />);

    // Default events (mousedown) should be ignored.
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(handler).not.toHaveBeenCalled();

    // The custom event should trigger the handler.
    fireEvent.click(screen.getByTestId('outside'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('removes its listeners on unmount', () => {
    const handler = vi.fn();
    const { unmount } = render(<TestComponent handler={handler} />);

    unmount();
    fireEvent.mouseDown(document.body);

    expect(handler).not.toHaveBeenCalled();
  });
});
