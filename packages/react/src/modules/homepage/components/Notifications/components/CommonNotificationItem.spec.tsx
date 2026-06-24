import { render, screen } from '~/setup';
import CommonNotificationItem from './CommonNotificationItem';

describe('NotificationItem', () => {
  it('links the content to the provided uri', () => {
    const uri = '/support#/ticket/168';

    render(
      <CommonNotificationItem
        uri={uri}
        message="Hello"
        date={new Date('2026-03-26T08:07:02.483Z')}
        picture={<span>picture</span>}
      />,
    );

    // Clicking the content navigates to the notification's uri.
    const link = screen.getByTestId('notification-item-content');
    expect(link).toHaveAttribute('href', uri);
  });
});
