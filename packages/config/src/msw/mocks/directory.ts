import { http, HttpResponse } from 'msw';
import { mockChildrenByStructure } from '../data';

// In-memory store for the "Liens utiles" homepage widget mocks, mirroring
// the real backend contract (GET/POST/PUT/DELETE /directory/user-links,
// including its error codes/statuses).
const USEFUL_LINKS_NAME_MAX_LENGTH = 80;
const USEFUL_LINKS_LIMIT = 10;

let usefulLinks = [
  { id: '1', name: 'Lumni', url: 'https://www.lumni.fr' },
  {
    id: '2',
    name: "Ministère de l'Éducation Nationale",
    url: 'https://www.education.gouv.fr',
  },
  { id: '3', name: 'ONISEP', url: 'https://www.onisep.fr' },
];

export const handlers = [
  http.get('/directory/user/:userId/children', () => {
    return HttpResponse.json(mockChildrenByStructure);
  }),
  http.get('/directory/userbook/:userId', () => {
    return HttpResponse.json({
      mood: 'default',
      health: '',
      alertSize: false,
      storage: 27683216,
      type: 'USERBOOK',
      userid: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
      picture: '/userbook/avatar/91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
      quota: 104857600,
      motto: '',
      theme: 'default',
      hobbies: [],
    });
  }),
  http.get('/directory/sharebookmark/all', () => {
    return HttpResponse.json([
      {
        id: '_9a1d29c3d2864ed8a3d72198fadf4a96',
        name: 'Parents délégués CE2',
      },
    ]);
  }),
  http.get('/directory/sharebookmark/_9a1d29c3d2864ed8a3d72198fadf4a96', () => {
    return HttpResponse.json({
      id: '_9a1d29c3d2864ed8a3d72198fadf4a96',
      name: 'Parents délégués CE2',
      notVisibleCount: 0,
      groups: [],
      users: [
        {
          displayName: 'CARPENTIER Béatrice',
          profile: 'Relative',
          id: 'c0824335-ab0e-41fb-9ed3-d5c28a93087d',
          activationCode: false,
        },
        {
          displayName: 'ROUSTIN Christophe',
          profile: 'Relative',
          id: '6a7495f8-bec7-4f68-b891-0b05c6e8e0ce',
          activationCode: false,
        },
      ],
    });
  }),
  http.get('/directory/user-links', () => {
    return HttpResponse.json(usefulLinks);
  }),
  http.post('/directory/user-links', async ({ request }) => {
    const payload = (await request.json()) as { name: string; url: string };
    if (payload.name.length > USEFUL_LINKS_NAME_MAX_LENGTH) {
      return HttpResponse.json(
        { error: 'directory.user.link.name.too.long' },
        { status: 400 },
      );
    }
    if (usefulLinks.length >= USEFUL_LINKS_LIMIT) {
      return HttpResponse.json(
        { error: 'directory.user.link.limit.reached' },
        { status: 409 },
      );
    }
    const link = { id: `${Date.now()}`, ...payload };
    usefulLinks = [...usefulLinks, link];
    return HttpResponse.json(link, { status: 200 });
  }),
  http.put('/directory/user-links/:id', async ({ params, request }) => {
    const payload = (await request.json()) as { name: string; url: string };
    if (payload.name.length > USEFUL_LINKS_NAME_MAX_LENGTH) {
      return HttpResponse.json(
        { error: 'directory.user.link.name.too.long' },
        { status: 400 },
      );
    }
    if (!usefulLinks.some((l) => l.id === params.id)) {
      return HttpResponse.json(
        { error: 'directory.user.link.not.found' },
        { status: 400 },
      );
    }
    const link = { id: params.id as string, ...payload };
    usefulLinks = usefulLinks.map((l) => (l.id === params.id ? link : l));
    return HttpResponse.json(link, { status: 200 });
  }),
  http.delete('/directory/user-links/:id', ({ params }) => {
    if (!usefulLinks.some((l) => l.id === params.id)) {
      return HttpResponse.json(
        { error: 'directory.user.link.not.found' },
        { status: 400 },
      );
    }
    usefulLinks = usefulLinks.filter((l) => l.id !== params.id);
    return new HttpResponse(null, { status: 200 });
  }),
];
