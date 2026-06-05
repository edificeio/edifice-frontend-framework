import { userNotificationCollaborativeWall } from '@edifice.io/config';
import { render, screen } from '~/setup';
import {
  notificationAdapter,
  UserWebNotification,
} from './notificationAdapter';
import UserNotification from './UserNotification';

const { getUserbookURL, getAvatarURL } = vi.hoisted(() => ({
  getUserbookURL: vi.fn((userId: string) => `/userbook/${userId}`),
  getAvatarURL: vi.fn((userId: string) => `/avatar/${userId}`),
}));

vi.mock('../../../../..', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../..')>();
  return {
    ...actual,
    useDirectory: () => ({ getUserbookURL, getAvatarURL }),
  };
});

const notification = notificationAdapter(
  userNotificationCollaborativeWall,
) as UserWebNotification;

describe('UserNotification', () => {
  it("wraps the avatar in a link to the sender's userbook URL", () => {
    render(<UserNotification notification={notification} />);
    // The link target is resolved from the directory hook with the sender's id.
    expect(getUserbookURL).toHaveBeenCalledWith(
      notification.params.userId,
      'user',
    );

    // Clicking the avatar navigates to that resolved userbook URL.
    const link = screen.getByTestId('notification-avatar');

    expect(link).toHaveAttribute(
      'href',
      `/userbook/${notification.params.userId}`,
    );
  });
});
