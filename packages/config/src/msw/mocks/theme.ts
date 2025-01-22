import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/theme', () => {
    return HttpResponse.json({
      template: '/public/template/portal.html',
      logoutCallback: '',
      skin: '/assets/themes/cg77/skins/default/',
      themeName: 'cg77',
      skinName: 'default',
    });
  }),
  http.get('/assets/theme-conf.js', () => {
    return HttpResponse.json({
      overriding: [
        {
          parent: 'theme-open-ent',
          child: 'cg77',
          skins: ['default', 'dyslexic'],
          help: '/help-2d',
          bootstrapVersion: 'ode-bootstrap-one',
          edumedia: {
            uri: 'https://www.edumedia-sciences.com',
            pattern: 'uai-token-hash-[[uai]]',
            ignoreSubjects: ['n-92', 'n-93'],
          },
        },
        {
          parent: 'panda',
          child: 'cg771d',
          skins: [
            'circus',
            'desert',
            'neutre',
            'ocean',
            'panda-food',
            'sparkly',
            'default',
            'monthly',
          ],
          help: '/help-1d',
          bootstrapVersion: 'ode-bootstrap-one',
          edumedia: {
            uri: 'https://junior.edumedia-sciences.com',
            pattern: 'uai-token-hash-[[uai]]',
          },
        },
      ],
    });
  }),
];
