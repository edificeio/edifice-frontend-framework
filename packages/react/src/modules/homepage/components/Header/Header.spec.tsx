import { render, screen } from '~/setup';

import Header from './Header';

const { useHasNotificationTodayMock } = vi.hoisted(() => ({
  useHasNotificationTodayMock: vi.fn(),
}));

vi.mock('../Notifications/hooks/useNotificationList', () => ({
  useHasNotificationToday: useHasNotificationTodayMock,
}));

describe('Header notification badge', () => {
  it('shows a badge on the notification bell when a notification is dated today', async () => {
    useHasNotificationTodayMock.mockReturnValue(true);

    render(<Header src="/assets" />);

    expect(
      await screen.findByLabelText('Nouvelle notification'),
    ).toBeInTheDocument();
  });

  it('hides the badge when no notification is dated today', async () => {
    useHasNotificationTodayMock.mockReturnValue(false);

    render(<Header src="/assets" />);

    expect(
      screen.queryByLabelText('Nouvelle notification'),
    ).not.toBeInTheDocument();
  });
});
