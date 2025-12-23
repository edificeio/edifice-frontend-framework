// mocks/handlers/config
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/actualites/conf/public', () => {
    return HttpResponse.json({
      ID_SERVICE: {
        default: 2,
      },
      LIBELLE_SERVICE: {
        default: 'PRODUCTION_COLLABORATIVE',
      },
    });
  }),
  http.get('/blog/conf/public', () => {
    return HttpResponse.json({
      ID_SERVICE: {
        default: 2,
      },
      LIBELLE_SERVICE: {
        default: 'PRODUCTION_COLLABORATIVE',
      },
    });
  }),
  http.get(`/wiki/conf/public`, () => {
    return HttpResponse.json({
      ID_SERVICE: {
        default: 2,
      },
      LIBELLE_SERVICE: {
        default: 'PRODUCTION_COLLABORATIVE',
      },
    });
  }),
];
