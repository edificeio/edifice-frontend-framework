import { IWebApp } from '@edifice.io/client';

import { fireEvent, render, screen } from '~/setup';
import AppIcon from './AppIcon';

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

  it('falls back to the sprite placeholder when the connector image fails and no name is available', () => {
    const { container } = render(
      <AppIcon app={{ ...connectorApp, displayName: '' }} />,
    );

    fireEvent.error(screen.getByAltText(''));

    expect(container.querySelector('.app-icon-letter')).not.toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
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
