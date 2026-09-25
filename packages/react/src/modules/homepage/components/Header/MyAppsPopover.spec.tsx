import { IWebApp } from '@edifice.io/client';
import { render, screen } from '~/setup';
import { MyAppsPopoverBody, MyAppsPopoverFooter } from './MyAppsPopover';

function makeApp(partial: Partial<IWebApp> & { name: string }): IWebApp {
  return {
    address: `/${partial.name.toLowerCase()}`,
    display: true,
    displayName: partial.name,
    icon: '',
    isExternal: false,
    prefix: '',
    scope: [],
    target: '',
    ...partial,
  } as unknown as IWebApp;
}

describe('MyAppsPopoverFooter', () => {
  it('links to the whole application list', () => {
    render(<MyAppsPopoverFooter />);

    expect(screen.getByTestId('header-my-apps-popover-more')).toHaveAttribute(
      'href',
      '/welcome',
    );
  });
});

describe('MyAppsPopoverBody', () => {
  it('invites the user to bookmark apps when none is bookmarked', () => {
    render(<MyAppsPopoverBody bookmarkedApps={[]} />);

    expect(
      screen.getByText('Ajoutez et retrouvez ici vos apps favorites !'),
    ).toBeInTheDocument();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('invites the user to bookmark apps when bookmarkedApps is undefined', () => {
    render(<MyAppsPopoverBody bookmarkedApps={undefined} />);

    expect(
      screen.getByText('Ajoutez et retrouvez ici vos apps favorites !'),
    ).toBeInTheDocument();
  });

  it('renders one link per bookmarked app, pointing at its address', () => {
    render(
      <MyAppsPopoverBody
        bookmarkedApps={[makeApp({ name: 'Blog' }), makeApp({ name: 'Wiki' })]}
      />,
    );

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/blog');
    expect(screen.getByTitle('Blog')).toBeInTheDocument();
  });

  it('caps the grid at ten apps (2 rows of 5)', () => {
    render(
      <MyAppsPopoverBody
        bookmarkedApps={Array.from({ length: 13 }, (_, index) =>
          makeApp({ name: `App${index}` }),
        )}
      />,
    );

    expect(screen.getAllByRole('link')).toHaveLength(10);
  });

  it('prefers the prefix over the display name for the title', () => {
    render(
      <MyAppsPopoverBody
        bookmarkedApps={[makeApp({ name: 'Blog', prefix: '/blog-prefix' })]}
      />,
    );

    expect(screen.getByTitle('blog-prefix')).toBeInTheDocument();
  });

  it('opens an external app in a new tab', () => {
    render(
      <MyAppsPopoverBody
        bookmarkedApps={[makeApp({ name: 'Library', isExternal: true })]}
      />,
    );

    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  });

  it('keeps an internal app in the current tab', () => {
    render(<MyAppsPopoverBody bookmarkedApps={[makeApp({ name: 'Blog' })]} />);

    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });
});
