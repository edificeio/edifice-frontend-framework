import { mockNotifications } from '@edifice.io/config';
import { render, screen } from '~/setup';
import NotificationList from './NotificationList';

describe('NotificationList', () => {
  it('displays an empty screen when there are no notifications', () => {
    render(<NotificationList notifications={[]} />);

    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renders as many items as notifications passed', () => {
    const notifications = mockNotifications.slice(0, 3);

    render(<NotificationList notifications={notifications} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(notifications.length);
  });
});
