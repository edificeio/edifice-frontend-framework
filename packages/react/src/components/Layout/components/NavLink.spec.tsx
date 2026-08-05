import { render, screen } from '~/setup';
import { NavLink } from './NavLink';

describe('NavLink', () => {
  it('renders a link to the given target with the nav-link class', () => {
    render(<NavLink link="/blog">Blog</NavLink>);

    const link = screen.getByRole('link', { name: 'Blog' });
    expect(link).toHaveAttribute('href', '/blog');
    expect(link).toHaveClass('nav-link');
  });

  it('appends the custom classes to the default one', () => {
    render(
      <NavLink link="/blog" className="dropdown-item">
        Blog
      </NavLink>,
    );

    expect(screen.getByRole('link')).toHaveClass('nav-link', 'dropdown-item');
  });

  it('exposes the translated label to assistive technologies only', () => {
    render(
      <NavLink link="/blog" translate="Aller au blog">
        <span aria-hidden="true">icon</span>
      </NavLink>,
    );

    expect(screen.getByRole('link', { name: 'Aller au blog' })).toBeVisible();
  });

  it('renders no hidden label without the translate prop', () => {
    render(<NavLink link="/blog">Blog</NavLink>);

    expect(document.querySelector('.nav-text')).toBeNull();
  });

  it('forwards the remaining props to the anchor', () => {
    render(
      <NavLink link="/blog" button aria-current="page">
        Blog
      </NavLink>,
    );

    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
  });
});
