import { render, screen } from '~/setup';
import NotificationItem from './NotificationItem';

describe('NotificationItem', () => {
  it('links the content to the provided uri', () => {
    const uri = '/support#/ticket/168';

    render(
      <NotificationItem
        uri={uri}
        message="Hello"
        date={new Date('2026-03-26T08:07:02.483Z')}
        picture={<span>picture</span>}
      />,
    );

    // Clicking the content navigates to the notification's uri.
    const link = screen.getByTestId('notification-content');
    expect(link).toHaveAttribute('href', uri);
  });
});
