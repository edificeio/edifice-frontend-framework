import { render, screen } from '~/setup';
import LinkPill from './LinkPill';

describe('LinkPill', () => {
  it('renders as a link opening in a new tab', () => {
    render(<LinkPill href="https://example.com" label="Example" />);

    const link = screen.getByTestId('link-pill');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveTextContent('Example');
  });

  it('renders the default chain icon when no illustration is provided', () => {
    render(<LinkPill href="https://example.com" label="Example" />);

    expect(
      screen.getByTestId('link-pill').querySelector('svg'),
    ).toBeInTheDocument();
  });

  it('renders a custom illustration when provided', () => {
    render(
      <LinkPill
        href="https://example.com"
        label="Example"
        illustration={<span data-testid="custom-illu">i</span>}
      />,
    );

    expect(screen.getByTestId('custom-illu')).toBeInTheDocument();
  });

  it('places the illustration after the label when position is right', () => {
    render(
      <LinkPill
        href="https://example.com"
        label="Example"
        illustrationPosition="right"
      />,
    );

    const link = screen.getByTestId('link-pill');
    expect(link).toHaveClass('link-pill--illustration-right');
    expect(link.firstElementChild).toHaveClass('link-pill-content');
  });

  it('renders an optional subtitle without changing the label markup', () => {
    render(
      <LinkPill href="https://example.com" label="Example" subtitle="Extra" />,
    );

    expect(screen.getByText('Example')).toHaveClass('link-pill-label');
    expect(screen.getByText('Extra')).toHaveClass('link-pill-subtitle');
  });

  it('does not render a subtitle element when none is provided', () => {
    render(<LinkPill href="https://example.com" label="Example" />);

    expect(
      screen.getByTestId('link-pill').querySelector('.link-pill-subtitle'),
    ).not.toBeInTheDocument();
  });

  it('renders the img illustration type without the icon wrapper', () => {
    render(
      <LinkPill
        href="https://example.com"
        label="Example"
        illustrationType="img"
        illustration={<img src="favicon.png" alt="" />}
      />,
    );

    expect(
      screen.getByTestId('link-pill').querySelector('.link-pill-image img'),
    ).toBeInTheDocument();
  });
});
