import { type IWebApp } from '@edifice.io/client';
import { render, screen } from '~/setup';
import { Favorites } from './Favorites';

const makeApp = (name: string): IWebApp => ({
  name,
  displayName: `${name} App`,
  address: `/${name.toLowerCase()}`,
  icon: `${name.toLowerCase()}-large`,
  isExternal: false,
  display: true,
  scope: [''],
});

describe('Favorites', () => {
  it('shows the empty state illustration and message when no apps', () => {
    const { container } = render(<Favorites apps={[]} />);

    expect(container.querySelector('img')).toBeInTheDocument();
    expect(
      screen.getByText(/Ajouter des applications à vos favoris/),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders a link for each app when apps are provided', () => {
    const apps = [makeApp('Mindmap'), makeApp('Blog'), makeApp('Wiki')];
    render(<Favorites apps={apps} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute('href', '/mindmap');
    expect(links[0]).toHaveAttribute('aria-label', 'Mindmap App');
  });
});
