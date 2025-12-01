import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/infra/public/json/sharing-rights.json', () => {
    return HttpResponse.json({
      read: {
        priority: 0,
        default: true,
        requires: [],
      },
      contrib: {
        priority: 1,
        default: false,
        requires: ['read'],
      },
      publish: {
        priority: 2,
        default: false,
        requires: ['read', 'contrib'],
      },
      manager: {
        priority: 3,
        default: false,
        requires: ['read', 'contrib', 'publish'],
      },
      comment: {
        priority: 4,
        default: true,
        requires: ['read'],
      },
    });
  }),
];
