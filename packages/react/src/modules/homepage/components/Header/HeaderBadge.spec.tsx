import { render, screen } from '~/setup';
import { HeaderBadge } from './HeaderBadge';

describe('HeaderBadge', () => {
  it('displays the counter', () => {
    render(<HeaderBadge>7</HeaderBadge>);

    expect(screen.getByText('7')).toHaveClass('navbar-nav-badge');
  });

  it('renders a dot whose label is only announced to assistive technologies', () => {
    render(<HeaderBadge dot>New notifications</HeaderBadge>);

    const label = screen.getByText('New notifications');
    expect(label).toHaveClass('visually-hidden');
    expect(label.parentElement).toHaveClass('navbar-nav-dot');
    expect(document.querySelector('.navbar-nav-badge')).toBeNull();
  });
});
