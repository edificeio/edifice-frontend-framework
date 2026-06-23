import { http, HttpResponse } from 'msw';
import {
  mockMessages,
  mockNotifications,
  mockNotificationTypes,
} from '../data';

export const handlers = [
  http.get('/timeline/flashmsg/listuser', () => {
    return HttpResponse.json(mockMessages);
  }),
  http.put('/timeline/flashmsg/:id/markasread', async () => {
    return HttpResponse.json({});
  }),
  http.get('/timeline/lastNotifications', ({ request }) => {
    const url = new URL(request.url);
    const types = url.searchParams.getAll('type');
    const page = url.searchParams.get('page') || '0';

    // You can customize the response based on the type and page parameters
    const notifications = mockNotifications.filter((msg) =>
      types.includes(msg.type),
    );
    const paginatedNotifications = notifications.slice(
      Number(page) * 10,
      (Number(page) + 1) * 10,
    );

    return HttpResponse.json({
      number: paginatedNotifications.length,
      results: paginatedNotifications,
      status: 'ok',
    });
  }),
  http.get('/timeline/types', () => {
    return HttpResponse.json(mockNotificationTypes);
  }),
];
