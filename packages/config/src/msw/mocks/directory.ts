import { http, HttpResponse } from 'msw';
import { mockChildrenByStructure } from '../data';

// In-memory store for the "Liens utiles" homepage widget mocks, mirroring
// the real backend contract (GET/POST/PUT/DELETE
// /bookmark/api/v2/bookmarks, including its error codes/statuses — see
// IMPULS-6167).
const USEFUL_LINKS_LIMIT = 10;

let usefulLinks = [
  { _id: '1', name: 'Lumni', url: 'https://www.lumni.fr' },
  {
    _id: '2',
    name: "Ministère de l'Éducation Nationale",
    url: 'https://www.education.gouv.fr',
  },
  { _id: '3', name: 'ONISEP', url: 'https://www.onisep.fr' },
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
  http.get('/bookmark/api/v2/bookmarks', () => {
    return HttpResponse.json({
      _id: 'owner-doc',
      owner: { userId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a', displayName: 'User' },
      bookmarks: usefulLinks,
      created: { $date: '2026-09-09T09:59:26.347Z' },
      modified: { $date: '2026-09-09T09:59:26.347Z' },
    });
  }),
  http.post('/bookmark/api/v2/bookmarks', async ({ request }) => {
    const payload = (await request.json()) as { name: string; url: string };
    if (usefulLinks.length >= USEFUL_LINKS_LIMIT) {
      return HttpResponse.json(
        { error: 'bookmark.widget.bad.request.limit.reached' },
        { status: 400 },
      );
    }
    const link = { _id: `${Date.now()}`, ...payload };
    usefulLinks = [...usefulLinks, link];
    return HttpResponse.json({ _id: link._id }, { status: 200 });
  }),
  http.put('/bookmark/api/v2/bookmarks/:id', async ({ params, request }) => {
    const payload = (await request.json()) as { name: string; url: string };
    if (!usefulLinks.some((l) => l._id === params.id)) {
      return new HttpResponse(null, { status: 401 });
    }
    usefulLinks = usefulLinks.map((l) =>
      l._id === params.id ? { _id: l._id, ...payload } : l,
    );
    return HttpResponse.json({ _id: params.id }, { status: 200 });
  }),
  http.delete('/bookmark/api/v2/bookmarks/:id', ({ params }) => {
    if (!usefulLinks.some((l) => l._id === params.id)) {
      return new HttpResponse(null, { status: 404 });
    }
    usefulLinks = usefulLinks.filter((l) => l._id !== params.id);
    return HttpResponse.json({ number: 1 }, { status: 200 });
  }),
];
