import { supportNotification } from '@edifice.io/config';
import { render, screen } from '~/setup';
import {
  notificationAdapter,
  SystemWebNotification,
} from './notificationAdapter';
import SystemNotificationItem from './SystemNotificationItem';

const notification = notificationAdapter(
  supportNotification,
) as SystemWebNotification;

describe('SystemNotification', () => {
  it("links the app icon to the notification's resource URI", () => {
    render(<SystemNotificationItem notification={notification} />);

    const link = screen.getByTestId('notification-item-app-icon');

    // Clicking the app icon navigates to the resolved resource URI.
    expect(link).toHaveAttribute('href', notification.uri);
  });
});
