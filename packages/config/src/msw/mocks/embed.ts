import { http, HttpResponse } from 'msw';

const defaultEmbedders = [
  {
    name: 'youtube',
    displayName: 'YouTube',
    url: [
      'https://www.youtube.com/watch?v={id}',
      'https://youtu.be/{id}',
    ],
    logo: 'https://www.youtube.com/s/desktop/d7401f66/img/favicon_96x96.png',
    embed:
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/{id}" frameborder="0" allowfullscreen></iframe>',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    name: 'vimeo',
    displayName: 'Vimeo',
    url: ['https://vimeo.com/{id}', 'https://player.vimeo.com/video/{id}'],
    logo: 'https://vimeo.com/favicon.ico',
    embed:
      '<iframe src="https://player.vimeo.com/video/{id}" width="640" height="360" frameborder="0" allowfullscreen></iframe>',
    example: 'https://vimeo.com/123456789',
  },
];

const customEmbedders: typeof defaultEmbedders = [];

export const handlers = [
  http.get('/infra/embed/default', () => {
    return HttpResponse.json(defaultEmbedders);
  }),

  http.get('/infra/embed/custom', () => {
    return HttpResponse.json(customEmbedders);
  }),
];
