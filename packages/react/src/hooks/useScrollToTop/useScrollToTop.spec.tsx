import { fireEvent, render, screen } from '~/setup';
import useScrollToTop from './useScrollToTop';

function HookHost() {
  const scrollToTop = useScrollToTop();

  return (
    <button type="button" onClick={scrollToTop} data-testid="scroll-btn">
      Scroll to top
    </button>
  );
}

describe('useScrollToTop', () => {
  it('returns a function', () => {
    render(<HookHost />);
    expect(screen.getByTestId('scroll-btn')).toBeInTheDocument();
  });

  it('calls scrollIntoView on the html element when invoked', () => {
    const scrollIntoViewMock = vi.fn();
    const htmlElement = document.querySelector('html')!;
    htmlElement.scrollIntoView = scrollIntoViewMock;

    render(<HookHost />);
    fireEvent.click(screen.getByTestId('scroll-btn'));

    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
  });
});
