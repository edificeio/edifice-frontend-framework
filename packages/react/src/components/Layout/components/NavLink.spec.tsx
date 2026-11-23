import { createRef } from 'react';

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
      <NavLink link="/blog" aria-current="page">
        Blog
      </NavLink>,
    );

    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
  });

  it('forwards its ref to the anchor', () => {
    const ref = createRef<HTMLAnchorElement | HTMLButtonElement>();

    render(
      <NavLink ref={ref} link="/blog">
        Blog
      </NavLink>,
    );

    expect(ref.current).toBe(screen.getByRole('link'));
  });

  describe('without a link', () => {
    it('renders a button with the nav-link class', () => {
      render(<NavLink className="position-relative">Notifications</NavLink>);

      const button = screen.getByRole('button', { name: 'Notifications' });
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveClass('nav-link', 'position-relative');
      expect(button).not.toHaveAttribute('href');
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('calls back on click', async () => {
      const onClick = vi.fn();
      const { user } = render(
        <NavLink onClick={onClick}>Notifications</NavLink>,
      );

      await user.click(screen.getByRole('button'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('exposes the translated label to assistive technologies only', () => {
      render(
        <NavLink translate="Notifications">
          <span aria-hidden="true">icon</span>
        </NavLink>,
      );

      expect(
        screen.getByRole('button', { name: 'Notifications' }),
      ).toBeVisible();
    });

    it('forwards the native button props', () => {
      render(
        <NavLink type="submit" disabled aria-expanded="false">
          Notifications
        </NavLink>,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('forwards its ref to the button', () => {
      const ref = createRef<HTMLAnchorElement | HTMLButtonElement>();

      render(<NavLink ref={ref}>Notifications</NavLink>);

      expect(ref.current).toBe(screen.getByRole('button'));
    });
  });
});
