import { http, HttpResponse } from 'msw';

// Mocks the homepage "Édumalin" widget backend (app-registry
// EdumalinWidgetController), which relays Édumalin's own response as is:
// `{ success, data }`. Four contents are returned while the widget only shows
// the first three.
export const handlers = [
  http.get('/appregistry/edumalin/widget', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          title: 'Préparer le brevet avec Édumalin',
          description:
            'Un webinaire pour découvrir comment accompagner vos élèves dans leurs révisions du brevet, avec des méthodes de travail adaptées à chacun.',
          type: { name: 'Webinaire' },
          dateTime: '2027-01-18T14:00:00',
          duration: 30,
          buttonTitle: 'S’inscrire',
          buttonLink: 'https://edumalin.fr/webinaires/brevet',
        },
        {
          title: 'Retrouvez-nous au salon Educatech',
          description:
            'L’équipe Édumalin sera présente sur le salon Educatech pour vous présenter ses nouveautés et répondre à vos questions.',
          type: { name: 'RDV' },
          googleMap: 'https://maps.app.goo.gl/XNV5D74URCxvhiff7',
          buttonTitle: 'S’inscrire',
          buttonLink: 'https://edumalin.fr/evenements/educatech',
        },
        {
          title: 'Comment Édumalin a changé ma façon d’enseigner',
          description:
            'Une professeure de mathématiques raconte comment elle utilise Édumalin avec ses classes de quatrième depuis la rentrée.',
          type: { name: 'Temoignage' },
        },
        {
          title: 'Quatrième contenu, au-delà de la limite d’affichage',
          description: 'Ce contenu ne doit pas être affiché par le widget.',
          type: { name: 'Conférence' },
        },
      ],
    });
  }),
];
