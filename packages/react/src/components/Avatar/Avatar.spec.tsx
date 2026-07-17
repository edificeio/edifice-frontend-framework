import { createRef } from 'react';

import { fireEvent, render, screen } from '~/setup';
import Avatar from './Avatar';

describe('Avatar', () => {
  it('renders the image from src', () => {
    render(<Avatar src="/user.png" alt="Jane Doe" />);

    expect(screen.getByAltText('Jane Doe')).toHaveAttribute('src', '/user.png');
  });

  it('falls back to a placeholder image when no src is given', () => {
    render(<Avatar alt="Jane Doe" />);

    const img = screen.getByAltText('Jane Doe');
    expect(img.getAttribute('src')).toBeTruthy();
    expect(img.getAttribute('src')).not.toBe('/user.png');
  });

  it('swaps to the placeholder when the image fails to load', () => {
    render(<Avatar src="/broken.png" alt="Jane Doe" />);

    const img = screen.getByAltText('Jane Doe');
    fireEvent.error(img);

    expect(img.getAttribute('src')).not.toBe('/broken.png');
  });

  it('applies size and variant classes', () => {
    const { container } = render(
      <Avatar alt="Jane Doe" size="lg" variant="circle" />,
    );

    expect(container.firstChild).toHaveClass(
      'avatar',
      'avatar-lg',
      'rounded-circle',
    );
  });

  it('renders cover content and the avatar-with-cover class', () => {
    const { container } = render(
      <Avatar alt="Jane Doe" cover={<span>online</span>} />,
    );

    expect(container.firstChild).toHaveClass('avatar-with-cover');
    expect(screen.getByText('online')).toBeInTheDocument();
  });

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Avatar ref={ref} alt="Jane Doe" />);

    expect(ref.current).not.toBeNull();
    expect(ref.current).toHaveClass('avatar');
  });

  it('applies inner and outer border styles', () => {
    render(
      <Avatar
        alt="Jane Doe"
        innerBorderColor="primary"
        innerBorderWidth={2}
        outerBorderColor="secondary"
        outerBorderWidth={3}
        outerBorderOffset={1}
      />,
    );

    const avatar = screen.getByAltText('Jane Doe').parentElement;
    expect(avatar).toHaveStyle({
      border: '2px solid var(--edifice-primary)',
      outline: '3px solid var(--edifice-secondary)',
    });
  });
});
