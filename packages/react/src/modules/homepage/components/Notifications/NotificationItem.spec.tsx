import { NotificationModel } from '@edifice.io/client';
import {
  messageNotification,
  supportNotification,
  systemNotificationCollaborativeEditor,
  userNotificationCollaborativeWall,
} from '@edifice.io/config';
import { render } from '~/setup';
import NotificationItem from './NotificationItem';

describe('Notification Item', () => {
  it.each([
    ['collaborative wall', userNotificationCollaborativeWall],
    ['message (MESSAGERIE)', messageNotification],
  ] as [string, NotificationModel][])(
    'renders a notification item of type user with an avatar for %s',
    (_label, notification) => {
      const { container } = render(
        <NotificationItem notification={notification} />,
      );

      // User notifications (with a `sender`) show the sender's avatar.
      expect(
        container.querySelector('.notification-item-avatar'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('.notification-item-app-icon'),
      ).not.toBeInTheDocument();
    },
  );

  it.each([
    ['support', supportNotification],
    ['collaborative editor', systemNotificationCollaborativeEditor],
  ] as [string, NotificationModel][])(
    'renders a notification item of type system with an app icon for %s',
    (_label, notification) => {
      const { container } = render(
        <NotificationItem notification={notification} />,
      );

      // System notifications (no `sender`) show the originating app icon.
      expect(
        container.querySelector('.notification-item-app-icon'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('.notification-item-avatar'),
      ).not.toBeInTheDocument();
    },
  );
});
