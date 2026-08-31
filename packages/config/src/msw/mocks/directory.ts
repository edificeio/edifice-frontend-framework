import { http, HttpResponse } from 'msw';
import { mockChildrenByStructure } from '../data';

// In-memory store for the "Liens utiles" homepage widget mocks.
// IMPULS-6167 (backend CRUD) is not implemented yet: this stands in for it.
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
  http.get('/directory/user/link', () => {
    return HttpResponse.json(usefulLinks);
  }),
  http.post('/directory/user/link', async ({ request }) => {
    const payload = (await request.json()) as { name: string; url: string };
    const link = { id: `${Date.now()}`, ...payload };
    usefulLinks = [...usefulLinks, link];
    return HttpResponse.json(link, { status: 201 });
  }),
  http.put('/directory/user/link/:id', async ({ params, request }) => {
    const payload = (await request.json()) as { name: string; url: string };
    const link = { id: params.id as string, ...payload };
    usefulLinks = usefulLinks.map((l) => (l.id === params.id ? link : l));
    return HttpResponse.json(link);
  }),
  http.delete('/directory/user/link/:id', ({ params }) => {
    usefulLinks = usefulLinks.filter((l) => l.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];
