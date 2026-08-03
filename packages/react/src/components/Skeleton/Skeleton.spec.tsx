import { createRef } from 'react';

import { render } from '~/setup';
import Skeleton from './Skeleton';

// The stylesheet lives in @edifice.io/bootstrap and is not loaded under jsdom,
// so these assert the class contract the CSS keys off. The class-to-appearance
// mapping is covered visually by Chromatic.
describe('Skeleton', () => {
  it.each([
    ['text', 'skeleton-text'],
    ['circle', 'skeleton-circle'],
    ['pill', 'skeleton-pill'],
    ['block', 'skeleton-block'],
  ] as const)('maps the %s variant to its shape class', (variant, expected) => {
    const { container } = render(<Skeleton variant={variant} />);

    expect(container.firstChild).toHaveClass('skeleton', expected);
  });

  it('falls back to the text variant', () => {
    const { container } = render(<Skeleton />);

    expect(container.firstChild).toHaveClass('skeleton-text');
  });

  it('marks the strong tone and leaves the default one unmarked', () => {
    const { container: strong } = render(<Skeleton tone="strong" />);
    const { container: base } = render(<Skeleton />);

    expect(strong.firstChild).toHaveClass('skeleton-strong');
    expect(base.firstChild).not.toHaveClass('skeleton-strong');
  });

  it('reads numeric dimensions as pixels', () => {
    const { container } = render(<Skeleton width={276} height={20} />);

    expect(container.firstChild).toHaveStyle({
      width: '276px',
      height: '20px',
    });
  });

  it('keeps string dimensions verbatim', () => {
    const { container } = render(<Skeleton width="79%" />);

    expect(container.firstChild).toHaveStyle({ width: '79%' });
  });

  // The full-width fallback lives in the stylesheet, so an unsized block must
  // carry no style attribute at all — that is what lets a component variant
  // size its blocks entirely through classes.
  it('carries no inline style when it is given no dimension', () => {
    const { container } = render(<Skeleton />);

    expect(container.firstChild).not.toHaveAttribute('style');
  });

  it('inlines only the axis it was given', () => {
    const { container } = render(<Skeleton variant="circle" height={32} />);

    expect(container.firstChild).toHaveStyle({ height: '32px' });
    expect((container.firstChild as HTMLElement).style.width).toBe('');
  });

  it('applies no animation class when static', () => {
    const { container } = render(<Skeleton animation="static" />);

    expect((container.firstChild as HTMLElement).className).not.toMatch(
      /skeleton-(pulse|shimmer)/,
    );
  });

  it.each(['pulse', 'shimmer'] as const)(
    'applies the %s animation class',
    (animation) => {
      const { container } = render(<Skeleton animation={animation} />);

      expect(container.firstChild).toHaveClass(`skeleton-${animation}`);
    },
  );

  it('hides itself from assistive technologies', () => {
    const { container } = render(<Skeleton />);

    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards a ref and merges className and style', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Skeleton ref={ref} className="custom-class" style={{ marginTop: 8 }} />,
    );

    expect(ref.current).toBe(container.firstChild);
    expect(ref.current).toHaveClass('skeleton', 'custom-class');
    expect(ref.current).toHaveStyle({ marginTop: '8px' });
  });
});
