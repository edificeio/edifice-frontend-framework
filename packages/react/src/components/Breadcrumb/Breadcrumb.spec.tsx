import { createRef } from 'react';

import { IWebApp } from '@edifice.io/client';
import { render, screen } from '~/setup';
import Breadcrumb from './Breadcrumb';

const app: IWebApp = {
  address: '/blog',
  icon: '',
  name: 'blog',
  scope: [],
  display: false,
  displayName: 'Blog',
  isExternal: false,
};

describe('Breadcrumb', () => {
  it('renders the app icon link and the app name when no resource name is given', () => {
    render(<Breadcrumb app={app} />);

    const link = screen.getByRole('link', { name: 'Blog' });
    expect(link).toHaveAttribute('href', '/blog');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Blog');
  });

  it('renders the resource name as heading instead of the app name when provided', () => {
    render(<Breadcrumb app={app} name="Mon nouveau blog" />);

    expect(screen.getByRole('link', { name: 'Blog' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Mon nouveau blog',
    );
    expect(
      screen.queryByText('Blog', { selector: 'h1' }),
    ).not.toBeInTheDocument();
  });

  it('forwards a ref to the underlying nav element', () => {
    const ref = createRef<HTMLElement>();
    render(<Breadcrumb app={app} ref={ref} />);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('NAV');
  });
});
