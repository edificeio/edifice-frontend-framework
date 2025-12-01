import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/directory/userbook/91c22b66-ba1b-4fde-a3fe-95219cc18d4a', () => {
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
];
