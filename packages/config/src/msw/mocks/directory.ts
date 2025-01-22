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
];
