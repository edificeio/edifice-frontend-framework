import { render } from '~/setup';
import AppIcon from './AppIcon';

describe('AppIcon component', () => {
  it('renders with default size, square variant and contain fit', () => {
    const { container } = render(<AppIcon app="blog" />);
    const icon = container.querySelector('.app-icon');

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('icon-xs', 'square', 'icon-contain');
    expect(icon).toHaveStyle({ width: '24px', height: '24px' });
  });

  it('exposes the size through the --app-icon-size CSS variable', () => {
    const { container } = render(<AppIcon app="blog" size="48" />);
    const icon = container.querySelector<HTMLElement>('.app-icon');

    expect(icon?.style.getPropertyValue('--app-icon-size')).toBe('48px');
    expect(icon).toHaveStyle({ width: '48px', height: '48px' });
  });

  it.each([
    ['24', 'icon-xs'],
    ['40', 'icon-sm'],
    ['48', 'icon-md'],
    ['80', 'icon-lg'],
    ['160', 'icon-xl'],
  ])('maps predefined size "%s" to its legacy padding class', (size, klass) => {
    const { container } = render(<AppIcon app="blog" size={size} />);
    const icon = container.querySelector('.app-icon');

    expect(icon).toHaveClass(klass);
  });

  it('does not add a legacy padding class for size "32"', () => {
    const { container } = render(<AppIcon app="blog" size="32" />);
    const icon = container.querySelector<HTMLElement>('.app-icon');

    // Size 32 has no legacy class: padding is computed from --app-icon-size.
    expect(icon).not.toHaveClass(
      'icon-xs',
      'icon-sm',
      'icon-md',
      'icon-lg',
      'icon-xl',
    );
    expect(icon?.style.getPropertyValue('--app-icon-size')).toBe('32px');
  });

  it('accepts a custom size without any legacy padding class', () => {
    const { container } = render(<AppIcon app="blog" size="20" />);
    const icon = container.querySelector<HTMLElement>('.app-icon');

    expect(icon).not.toHaveClass(
      'icon-xs',
      'icon-sm',
      'icon-md',
      'icon-lg',
      'icon-xl',
    );
    expect(icon?.style.getPropertyValue('--app-icon-size')).toBe('20px');
    expect(icon).toHaveStyle({ width: '20px', height: '20px' });
  });

  it('applies the ratio fit and variant classes', () => {
    const { container } = render(
      <AppIcon app="blog" iconFit="ratio" variant="circle" />,
    );
    const icon = container.querySelector('.app-icon');

    expect(icon).toHaveClass('icon-ratio', 'rounded-circle');
  });

  it('applies a custom className', () => {
    const { container } = render(
      <AppIcon app="blog" className="my-custom-class" />,
    );

    expect(container.querySelector('.app-icon')).toHaveClass('my-custom-class');
  });

  it('renders an image when the icon is a URL', () => {
    const { container } = render(
      <AppIcon
        app={{
          address: '/form',
          icon: 'https://example.org/logo.svg',
          name: 'Formulaire',
          scope: [],
          display: false,
          displayName: 'Formulaire',
          isExternal: false,
        }}
        size="80"
      />,
    );

    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.org/logo.svg');
    expect(container.querySelector('.app-icon')).not.toBeInTheDocument();
  });
});
