import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/resources-applications', () => {
    return HttpResponse.json(['blog', 'wiki']);
  }),

  http.get('/locale', () => {
    return HttpResponse.json({ locale: 'en' });
  }),

  http.get('/applications-list', () => {
    return HttpResponse.json({
      apps: [
        {
          name: 'Blog',
          address: '/blog',
          icon: 'blog-large',
          target: '',
          displayName: 'blog',
          display: true,
          prefix: '/blog',
          casType: null,
          scope: [''],
          isExternal: false,
        },
        {
          name: 'Wiki',
          address: '/wiki',
          icon: 'wiki-large',
          target: '',
          displayName: 'wiki',
          display: true,
          prefix: '/wiki',
          casType: null,
          scope: [''],
          isExternal: false,
        },
      ],
    });
  }),

  http.get('/test', () => {
    return HttpResponse.json({ data: 'Success' });
  }),
  http.get('/test-error', () => {
    return new HttpResponse(null, { status: 404 });
  }),
];
