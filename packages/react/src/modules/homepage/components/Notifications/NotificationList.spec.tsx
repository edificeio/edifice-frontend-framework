import { mockNotifications } from '@edifice.io/config';
import { render, screen } from '~/setup';
import NotificationList from './NotificationList';

describe('NotificationList', () => {
  it('displays an empty screen when there are no notifications', () => {
    render(<NotificationList notifications={[]} />);

    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('displays the skeleton instead of the empty screen while loading', () => {
    render(<NotificationList notifications={undefined} isLoading />);

    expect(
      screen.queryByText('homepage.notifications-list.empty.description'),
    ).not.toBeInTheDocument();
    // Placeholders are hidden from assistive technologies.
    expect(screen.getAllByRole('listitem', { hidden: true })).toHaveLength(8);
  });

  it('renders as many items as notifications passed', () => {
    const notifications = mockNotifications.slice(0, 3);

    render(<NotificationList notifications={notifications} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(notifications.length);
  });

  it('shows the options menu of each notification by default', () => {
    const notifications = mockNotifications.slice(0, 3);

    render(<NotificationList notifications={notifications} />);

    expect(
      screen.getAllByTestId('notification-item-options-button'),
    ).toHaveLength(notifications.length);
  });

  it('hides the options menu when notifications cannot be managed', () => {
    render(
      <NotificationList
        notifications={mockNotifications.slice(0, 3)}
        canManageNotifications={false}
      />,
    );

    expect(
      screen.queryByTestId('notification-item-options-button'),
    ).not.toBeInTheDocument();
  });
});
