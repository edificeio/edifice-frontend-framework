import { NotificationModel } from '@edifice.io/client';
import {
  messageNotification,
  supportNotification,
  systemNotificationCollaborativeEditor,
  userNotificationCollaborativeWall,
} from '@edifice.io/config';
import { render } from '~/setup';
import Notification from '../Notification';

describe('Notification', () => {
  it.each([
    ['collaborative wall', userNotificationCollaborativeWall],
    ['message (MESSAGERIE)', messageNotification],
  ] as [string, NotificationModel][])(
    'renders a notification of type user with an avatar for %s',
    (_label, notification) => {
      const { container } = render(
        <Notification notification={notification} />,
      );

      // User notifications (with a `sender`) show the sender's avatar.
      expect(
        container.querySelector('.notification-avatar'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('.notification-app-icon'),
      ).not.toBeInTheDocument();
    },
  );

  it.each([
    ['support', supportNotification],
    ['collaborative editor', systemNotificationCollaborativeEditor],
  ] as [string, NotificationModel][])(
    'renders a notification of type system with an app icon for %s',
    (_label, notification) => {
      const { container } = render(
        <Notification notification={notification} />,
      );

      // System notifications (no `sender`) show the originating app icon.
      expect(
        container.querySelector('.notification-app-icon'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('.notification-avatar'),
      ).not.toBeInTheDocument();
    },
  );
});
