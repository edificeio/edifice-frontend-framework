import { http, HttpResponse } from 'msw';

export const ONBOARDING_MODAL_PREFERENCE_IDENTIFIER = 'onboarding-modal';
export const handlers = [
  http.get(`/userbook/preference/${ONBOARDING_MODAL_PREFERENCE_IDENTIFIER}`, () => {
    return HttpResponse.json({
      preference: 'false',
    });
  }),
  http.get('/userbook/api/person', () => {
    return HttpResponse.json({
      status: 'ok',
      result: [
        {
          id: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
          login: 'John Doe',
          displayName: 'John Doe',
          type: ['Student'],
          visibleInfos: [],
          schools: [
            {
              exports: null,
              classes: [],
              name: 'School',
              id: 'bfaac2c1',
              UAI: null,
            },
          ],
          relatedName: null,
          relatedId: null,
          relatedType: null,
          userId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
          motto: '',
          photo: '/userbook/avatar/91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
          mood: 'default',
          health: '',
          address: '',
          email: '',
          tel: null,
          mobile: '',
          birthdate: '2023-09-25',
          hobbies: [],
        },
      ],
    });
  }),
  http.get(
    '/userbook/avatar/91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
    ({ request }) => {
      const url = new URL(request.url);
      const thumbnail = url.searchParams.get('thumbnail');

      if (thumbnail !== '100x100') {
        return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
      }

      return HttpResponse.text(
        'https://mdbcdn.b-cdn.net/img/new/avatars/2.webp',
      );
    },
  ),
  http.get(
    '/userbook/avatar/91c22b66-ba1b-4fde-a3fe-95219cc18d4b',
    ({ request }) => {
      const url = new URL(request.url);
      const thumbnail = url.searchParams.get('thumbnail');

      if (thumbnail !== '100x100') {
        return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
      }

      return HttpResponse.text(
        'https://mdbcdn.b-cdn.net/img/new/avatars/4.webp',
      );
    },
  ),
  http.get('/userbook/avatar/:id', ({ request }) => {
    const url = new URL(request.url);
    const thumbnail = url.searchParams.get('thumbnail');

    if (thumbnail !== '100x100') {
      return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    return HttpResponse.text('https://mdbcdn.b-cdn.net/img/new/avatars/1.webp');
  }),
  http.get('/userbook/preference/rgpdCookies', () => {
    return HttpResponse.json({ preference: '{"showInfoTip":false}' });
  }),
  http.get('/userbook/preference/language', () => {
    return HttpResponse.json({
      preference: { 'default-domaine': 'en' },
    });
  }),
  http.get('/userbook/preference/apps', () => {
    return HttpResponse.json({
      preference: '{"bookmarks":[],"applications":["Blog"]}',
    });
  }),
];
