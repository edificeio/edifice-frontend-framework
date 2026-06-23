import { render, screen } from '~/setup';
import SmartEllipsis from './SmartEllipsis';

/**
 * Helper to fake element dimensions: jsdom always reports 0 for scrollWidth
 * and clientWidth, so we stub them on the prototype to exercise both the
 * "fits" and the "overflows" branches of the component.
 */
function stubWidths(scrollWidth: number, clientWidth: number) {
  const original = {
    scrollWidth: Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'scrollWidth',
    ),
    clientWidth: Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'clientWidth',
    ),
  };

  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
    configurable: true,
    get() {
      return scrollWidth;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get() {
      return clientWidth;
    },
  });

  return () => {
    // Restore the original descriptor when there was one, otherwise delete the
    // stub so it does not leak into later tests (the property may be inherited,
    // in which case getOwnPropertyDescriptor returns undefined).
    if (original.scrollWidth) {
      Object.defineProperty(
        HTMLElement.prototype,
        'scrollWidth',
        original.scrollWidth,
      );
    } else {
      delete (HTMLElement.prototype as { scrollWidth?: number }).scrollWidth;
    }
    if (original.clientWidth) {
      Object.defineProperty(
        HTMLElement.prototype,
        'clientWidth',
        original.clientWidth,
      );
    } else {
      delete (HTMLElement.prototype as { clientWidth?: number }).clientWidth;
    }
  };
}

describe('SmartEllipsis component', () => {
  it('renders the full text inside a span with the expected class', () => {
    const { container } = render(<SmartEllipsis text="Hello world" />);
    const span = container.querySelector('span');

    expect(span).toHaveClass('smart-ellipsis');
    expect(span).toHaveTextContent('Hello world');
  });

  it('keeps the text untouched when it fits the container', () => {
    const restore = stubWidths(50, 100);
    try {
      render(<SmartEllipsis text="Short" />);

      expect(screen.getByText('Short')).toBeInTheDocument();
    } finally {
      restore();
    }
  });

  it('truncates the text with an ellipsis when it overflows', () => {
    const restore = stubWidths(200, 50);
    try {
      const { container } = render(
        <SmartEllipsis text="A very long text that overflows" />,
      );
      const span = container.querySelector('span');

      expect(span?.textContent).toContain('…');
      expect(span?.textContent).not.toBe('A very long text that overflows');
    } finally {
      restore();
    }
  });
});
