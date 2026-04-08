import { http, HttpResponse } from 'msw';
import { mockMessages } from '../data';

export const handlers = [
  http.get('/timeline/flashmsg/listuser', () => {
    return HttpResponse.json(mockMessages);
  }),
  http.put('/timeline/flashmsg/:id/markasread', async () => {
    return HttpResponse.json({});
  }),
];
