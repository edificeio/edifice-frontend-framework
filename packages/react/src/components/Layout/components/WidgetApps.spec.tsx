import { IWebApp } from '@edifice.io/client';
import { render, screen } from '~/setup';
import WidgetApps, { WidgetAppsBody, WidgetAppsFooter } from './WidgetApps';

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

describe('WidgetApps', () => {
  it('renders its children inside the applications widget', () => {
    render(
      <WidgetApps>
        <span>widget content</span>
      </WidgetApps>,
    );

    expect(screen.getByText('widget content')).toBeInTheDocument();
  });
});

describe('WidgetAppsFooter', () => {
  it('links to the whole application list', () => {
    render(<WidgetAppsFooter />);

    expect(screen.getByRole('link', { name: 'plus' })).toHaveAttribute(
      'href',
      '/welcome',
    );
  });
});

describe('WidgetAppsBody', () => {
  it('invites the user to bookmark apps when none is bookmarked', () => {
    render(<WidgetAppsBody bookmarkedApps={[]} />);

    expect(screen.getByText('navbar.myapps.more')).toBeInTheDocument();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('renders one link per bookmarked app, pointing at its address', () => {
    render(
      <WidgetAppsBody
        bookmarkedApps={[makeApp({ name: 'Blog' }), makeApp({ name: 'Wiki' })]}
      />,
    );

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/blog');
    expect(screen.getByTitle('Blog')).toBeInTheDocument();
  });

  it('caps the list at six apps', () => {
    render(
      <WidgetAppsBody
        bookmarkedApps={Array.from({ length: 9 }, (_, index) =>
          makeApp({ name: `App${index}` }),
        )}
      />,
    );

    expect(screen.getAllByRole('link')).toHaveLength(6);
  });

  it('prefers the prefix over the display name for the title', () => {
    render(
      <WidgetAppsBody
        bookmarkedApps={[makeApp({ name: 'Blog', prefix: '/blog-prefix' })]}
      />,
    );

    expect(screen.getByTitle('blog-prefix')).toBeInTheDocument();
  });

  it('ignores a prefix too short to carry a translation key', () => {
    render(
      <WidgetAppsBody
        bookmarkedApps={[makeApp({ name: 'Blog', prefix: '/' })]}
      />,
    );

    expect(screen.getByTitle('Blog')).toBeInTheDocument();
  });

  it('opens the administration app in a new tab', () => {
    render(
      <WidgetAppsBody bookmarkedApps={[makeApp({ name: 'Administration' })]} />,
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('opens an external app in a new tab', () => {
    render(
      <WidgetAppsBody
        bookmarkedApps={[makeApp({ name: 'Library', isExternal: true })]}
      />,
    );

    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  });

  it('honors an app already targeting a new tab', () => {
    render(
      <WidgetAppsBody
        bookmarkedApps={[makeApp({ name: 'Blog', target: '_blank' })]}
      />,
    );

    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  });

  it('keeps an internal app in the current tab', () => {
    render(<WidgetAppsBody bookmarkedApps={[makeApp({ name: 'Blog' })]} />);

    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });
});
