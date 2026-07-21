import { createRef } from 'react';

import { render, screen } from '~/setup';
import Badge, { BadgeRef } from './Badge';

describe('Badge component', () => {
  it('renders notification variant with default classes', () => {
    render(<Badge data-testid="badge">Updates</Badge>);
    const badge = screen.getByTestId('badge');

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Updates');
    expect(badge).toHaveClass(
      'badge',
      'rounded-pill',
      'badge-notification',
      'bg-info',
      'text-light',
      'border',
      'border-0',
    );
  });

  it('renders content variant classes with and without background', () => {
    const { rerender } = render(
      <Badge
        data-testid="badge"
        variant={{ type: 'content', level: 'success' }}
      />,
    );
    const badge = screen.getByTestId('badge');

    expect(badge).toHaveClass('text-success', 'border', 'border-0');
    expect(badge).not.toHaveClass('bg-gray-200');

    rerender(
      <Badge
        data-testid="badge"
        variant={{ type: 'content', level: 'danger', background: true }}
      />,
    );

    expect(badge).toHaveClass('text-danger', 'bg-gray-200');
    expect(badge).not.toHaveClass('border', 'border-0');
  });

  it('renders user variant classes with profile mapping', () => {
    render(
      <Badge
        data-testid="badge"
        variant={{ type: 'user', profile: 'Teacher', background: true }}
      >
        Teacher
      </Badge>,
    );

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('badge-profile-teacher', 'bg-gray-200');
    expect(badge).toHaveTextContent('Teacher');
  });

  it('renders link variant class', () => {
    render(
      <Badge data-testid="badge" variant={{ type: 'link' }}>
        Docs
      </Badge>,
    );

    expect(screen.getByTestId('badge')).toHaveClass(
      'badge-link',
      'border',
      'border-0',
    );
  });

  it('renders chip variant in its dedicated wrapper', () => {
    const { container } = render(
      <Badge data-testid="badge" variant={{ type: 'chip' }}>
        Chip value
      </Badge>,
    );
    const badge = screen.getByTestId('badge');
    const chipContent = container.querySelector(
      'div.d-flex.fw-800.align-items-center',
    );

    expect(badge).toHaveClass('bg-gray-200');
    expect(chipContent).toBeInTheDocument();
    expect(chipContent).toHaveTextContent('Chip value');
  });

  it('renders appVersion default label and app color classes', () => {
    render(
      <Badge
        data-testid="badge"
        variant={{
          type: 'appVersion',
          app: { icon: 'blog-large' } as never,
        }}
      />,
    );

    const badge = screen.getByTestId('badge');

    expect(badge).toHaveTextContent('BÊTA');
    expect(badge).toHaveClass(
      'color-app-blog',
      'bg-light-blog',
      'border-app-blog',
    );
  });

  it('renders appVersion children when provided', () => {
    render(
      <Badge data-testid="badge" variant={{ type: 'appVersion' }}>
        NEW
      </Badge>,
    );

    expect(screen.getByTestId('badge')).toHaveTextContent('NEW');
  });

  it('forwards className, extra props and ref', () => {
    const ref = createRef<BadgeRef>();

    render(
      <Badge
        ref={ref}
        data-testid="badge"
        className="custom-class"
        aria-label="badge label"
      >
        Content
      </Badge>,
    );

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('custom-class');
    expect(badge).toHaveAttribute('aria-label', 'badge label');
    expect(ref.current).toBe(badge);
  });
});
