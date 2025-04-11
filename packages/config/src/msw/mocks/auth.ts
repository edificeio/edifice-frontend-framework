import { http, HttpResponse } from 'msw';
import { userInfo } from '../data/userinfo';

export const handlers = [
  http.get('/auth/oauth2/userinfo', () => {
    return HttpResponse.json(userInfo);
  }),
];
