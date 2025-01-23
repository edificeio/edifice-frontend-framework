import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/blog/linker', () => {
    return HttpResponse.json(null);
  }),
];
