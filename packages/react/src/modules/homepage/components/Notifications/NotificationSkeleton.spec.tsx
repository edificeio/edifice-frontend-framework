import { createRef } from 'react';

import { render, screen } from '~/setup';
import NotificationSkeleton from './NotificationSkeleton';

describe('NotificationSkeleton', () => {
  it('exposes the row as a busy status region', () => {
    render(<NotificationSkeleton />);

    const status = screen.getByRole('status');

    expect(status).toHaveAttribute('aria-busy', 'true');
    expect(status).toHaveClass('notification-item');
  });

  it('announces the loading state once, not once per block', () => {
    render(<NotificationSkeleton />);

    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(
      screen.getByText('Chargement des notifications'),
    ).toBeInTheDocument();
  });

  it('reuses the layout classes of the loaded row', () => {
    const { container } = render(<NotificationSkeleton />);

    expect(container.querySelector('.notification-item-picture')).toBeTruthy();
    expect(container.querySelector('.notification-item-message')).toBeTruthy();
  });

  const messageLines = (container: HTMLElement) =>
    Array.from(
      container.querySelectorAll('.notification-item-message .skeleton'),
    ) as HTMLElement[];

  it.each([1, 2, 3, 4])('draws %i message lines when asked to', (lines) => {
    const { container } = render(<NotificationSkeleton lines={lines} />);

    expect(messageLines(container)).toHaveLength(lines);
  });

  it('draws two lines by default', () => {
    const { container } = render(<NotificationSkeleton />);

    expect(messageLines(container)).toHaveLength(2);
  });

  // Sizing every block through a class is what keeps the geometry in the
  // stylesheet, next to the component dimensions it is derived from. The
  // resulting box is checked by the browser measurement of the overlay story,
  // which jsdom cannot do since it loads no stylesheet.
  it('sizes every block through a class rather than inline', () => {
    const { container } = render(<NotificationSkeleton lines={3} />);
    const blocks = Array.from(
      container.querySelectorAll('.skeleton'),
    ) as HTMLElement[];

    expect(blocks).not.toHaveLength(0);
    blocks.forEach((block) => {
      expect(block).not.toHaveAttribute('style');
      expect(block.className).toMatch(
        /notification-item-(avatar|skeleton-(line|chip|date))/,
      );
    });
  });

  it('forwards a ref, which NotificationList uses as its scroll sentinel', () => {
    const ref = createRef<HTMLDivElement>();
    render(<NotificationSkeleton ref={ref} />);

    expect(ref.current).toHaveClass('notification-item');
  });
});
