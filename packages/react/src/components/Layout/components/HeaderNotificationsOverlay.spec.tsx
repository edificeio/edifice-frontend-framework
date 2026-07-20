import { act, render, screen } from '~/setup';

import { useOverlayStore } from '../../PageLayout/store/overlayStore';
import HeaderNotificationsOverlay from './HeaderNotificationsOverlay';

vi.mock(
  '../../../modules/homepage/components/Notifications/NotificationListContainer',
  () => ({
    NotificationListContainer: ({
      onCloseNotifications,
    }: {
      onCloseNotifications?: () => void;
    }) => (
      <div data-testid="notification-list-container">
        <button onClick={onCloseNotifications}>close-from-list</button>
      </div>
    ),
  }),
);

afterEach(() => {
  act(() => useOverlayStore.setState({ overlayOpen: false }));
});

describe('HeaderNotificationsOverlay', () => {
  it('does not mount NotificationListContainer while the overlay is closed', () => {
    render(<HeaderNotificationsOverlay />);

    expect(
      screen.queryByTestId('notification-list-container'),
    ).not.toBeInTheDocument();
  });

  it('mounts NotificationListContainer once the overlay is open', () => {
    act(() => useOverlayStore.setState({ overlayOpen: true }));

    render(<HeaderNotificationsOverlay />);

    expect(
      screen.getByTestId('notification-list-container'),
    ).toBeInTheDocument();
  });

  it('closes the overlay when NotificationListContainer requests it', async () => {
    act(() => useOverlayStore.setState({ overlayOpen: true }));
    const { user } = render(<HeaderNotificationsOverlay />);

    await user.click(screen.getByText('close-from-list'));

    expect(useOverlayStore.getState().overlayOpen).toBe(false);
  });
});
