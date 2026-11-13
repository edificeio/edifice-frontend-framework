import { http, HttpResponse } from 'msw';

import { mockPronoteStructures } from '../data/carnetDeBord';

export const handlers = [
  http.get('/sso/pronote', () => HttpResponse.json(mockPronoteStructures)),
];
