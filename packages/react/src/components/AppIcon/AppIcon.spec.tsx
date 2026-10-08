import { IWebApp } from '@edifice.io/client';

import { fireEvent, render, screen } from '~/setup';
import AppIcon, { AppIconSize } from './AppIcon';

const baseApp: IWebApp = {
  address: '/blog',
  icon: 'blog',
  name: 'blog',
  scope: [],
  display: true,
  displayName: 'Blog',
  isExternal: false,
};

const connectorApp: IWebApp = {
  address: 'https://connecteur-externe.example/app',
  icon: 'https://connecteur-externe.example/icon.png',
  name: 'connecteur-externe',
  scope: [],
  display: true,
  displayName: 'Connecteur Externe',
  isExternal: true,
};

describe('AppIcon', () => {
  it('renders the sprite icon when the icon is not a URL', () => {
    const { container } = render(<AppIcon app={baseApp} />);

    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('renders the image when the icon is a URL', () => {
    render(<AppIcon app={connectorApp} />);

    const img = screen.getByAltText('Connecteur Externe');
    expect(img).toHaveAttribute(
      'src',
      'https://connecteur-externe.example/icon.png',
    );
  });

  it('falls back to a letter avatar when the connector image fails to load', () => {
    render(<AppIcon app={connectorApp} />);

    fireEvent.error(screen.getByAltText('Connecteur Externe'));

    expect(screen.queryByAltText('Connecteur Externe')).not.toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('falls back to app.name for the letter when displayName is empty', () => {
    render(
      <AppIcon
        app={{ ...connectorApp, displayName: '', name: 'Formulaire' }}
      />,
    );

    fireEvent.error(screen.getByAltText('Formulaire'));

    expect(screen.getByText('F')).toBeInTheDocument();
  });

  it('retries loading the image when the icon prop changes after a failure', () => {
    const { rerender } = render(<AppIcon app={connectorApp} />);
    fireEvent.error(screen.getByAltText('Connecteur Externe'));
    expect(screen.getByText('C')).toBeInTheDocument();

    const otherConnector: IWebApp = {
      ...connectorApp,
      icon: 'https://connecteur-externe.example/other-icon.png',
      displayName: 'Autre Connecteur',
    };
    rerender(<AppIcon app={otherConnector} />);

    expect(screen.queryByText('C')).not.toBeInTheDocument();
    expect(screen.getByAltText('Autre Connecteur')).toHaveAttribute(
      'src',
      'https://connecteur-externe.example/other-icon.png',
    );
  });
});

describe('AppIcon sizing and variants', () => {
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
  ] as const)(
    'maps predefined size "%s" to its legacy padding class',
    (size, klass) => {
      const { container } = render(<AppIcon app="blog" size={size} />);
      const icon = container.querySelector('.app-icon');

      expect(icon).toHaveClass(klass);
    },
  );

  it('only accepts numeric string sizes at the type level', () => {
    // The component appends `px` to the size, so a value carrying a unit
    // would render an invalid CSS length (e.g. `24pxpx`).
    // @ts-expect-error units are not accepted
    const withUnit: AppIconSize = '24px';
    const numeric: AppIconSize = '16';

    expect([withUnit, numeric]).toHaveLength(2);
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

  it('renders a bare image, without the app-icon wrapper, when the icon is a URL', () => {
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
