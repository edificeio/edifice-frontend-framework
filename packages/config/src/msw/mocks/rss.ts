import { http, HttpResponse } from 'msw';

// In-memory store for the homepage "RSS" widget mocks, mirroring the legacy
// rss backend module contract: one channel per user holding the whole feeds
// array (GET /rss/channels, POST /rss/channel, PUT /rss/channel/:id), and
// GET /rss/feed/items whose body carries the feed fetch `status`.
const LE_MONDE = 'https://www.lemonde.fr/rss/une.xml';
const LE_PARISIEN = 'https://feeds.leparisien.fr/leparisien/rss';
const EDUSCOL = 'https://eduscol.education.fr/rss.xml';
const BROKEN = 'https://www.example.com/not-a-feed.xml';
const FRANCE_INFO = 'https://www.francetvinfo.fr/titres.rss';
const LE_FIGARO = 'https://www.lefigaro.fr/rss/figaro_actualites.xml';

let channel = {
  _id: 'rss-channel-1',
  feeds: [
    { title: 'Le Monde', link: LE_MONDE, show: 3 },
    { title: 'Le Parisien', link: LE_PARISIEN, show: 3 },
    { title: 'Eduscol', link: EDUSCOL, show: 3 },
    { title: 'Flux invalide', link: BROKEN, show: 3 },
    { title: 'France Info', link: FRANCE_INFO, show: 3 },
    { title: 'Le Figaro', link: LE_FIGARO, show: 3 },
  ],
  owner: {
    userId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
    displayName: 'User',
  },
  created: { $date: 1784620800000 },
  modified: { $date: 1784620800000 },
};

const itemsByUrl: Record<
  string,
  { title: string; link: string; description: string; pubDate: string }[]
> = {
  [LE_MONDE]: [
    {
      title: 'Face aux Etats-Unis, l’Iran parie sur une guerre d’usure',
      link: 'https://www.lemonde.fr/international/article/iran-guerre-usure',
      description:
        '<p>Alors que les frappes américaines se poursuivent en Iran, le pouvoir iranien évite, pour l’instant, une confrontation totale. Son calcul repose sur la menace de provoquer une perturbation énergétique mondiale pour contraindre Washington à revoir sa stratégie.</p>',
      pubDate: 'Tue, 21 Jul 2026 08:00:00 +0200',
    },
    {
      title:
        'Le projet de loi d’urgence agricole adopté dans la cacophonie par une Assemblée nationale fracturée sur la question des pesticides',
      link: 'https://www.lemonde.fr/politique/article/loi-urgence-agricole',
      description:
        'Le gouvernement craignait que la mesure permettant la réautorisation dérogatoire de deux néonicotinoïdes, ajoutée par le Sénat, ne conduise au rejet du texte. Le projet de loi a finalement été largement adopté par les députés dans la nuit de lundi à mardi.',
      pubDate: 'Tue, 21 Jul 2026 07:00:00 +0200',
    },
    {
      title:
        'Ebola en RDC : posez vos questions à nos journalistes Morgane Le Cam et Philémon Barbier, de retour de reportage dans l’épicentre de l’épidémie',
      link: 'https://www.lemonde.fr/afrique/article/ebola-rdc-questions',
      description:
        'Notre reporter s’est rendue pour « Le Monde Afrique » avec le photographe Philémon Barbier à Mongbwalu, dans l’est de la République démocratique du Congo, où l’épidémie d’Ebola due à la souche Bundibugyo s’est déclarée et progresse rapidement.',
      pubDate: 'Tue, 21 Jul 2026 06:00:00 +0200',
    },
    {
      title: 'Quatrième article, au-delà de la limite d’affichage',
      link: 'https://www.lemonde.fr/article/quatrieme',
      description: 'Cet article ne doit pas être affiché par le widget.',
      pubDate: 'Mon, 20 Jul 2026 18:00:00 +0200',
    },
  ],
  [LE_PARISIEN]: [
    {
      title: 'Canicule : les conseils pour bien dormir malgré la chaleur',
      link: 'https://www.leparisien.fr/societe/canicule-conseils-sommeil',
      description: 'Ventilateur, volets fermés, douche tiède : nos astuces.',
      pubDate: 'Tue, 21 Jul 2026 09:30:00 +0200',
    },
  ],
  [EDUSCOL]: [],
  [FRANCE_INFO]: [
    {
      title: 'Rentrée scolaire : ce qui change cette année',
      link: 'https://www.francetvinfo.fr/societe/education/rentree',
      description: 'Calendrier, programmes, fournitures : le point complet.',
      pubDate: 'Tue, 21 Jul 2026 10:00:00 +0200',
    },
  ],
  [LE_FIGARO]: [
    {
      title: 'Les nouveautés du baccalauréat 2027',
      link: 'https://www.lefigaro.fr/actualite-france/bac-2027',
      description: 'Épreuves, coefficients et calendrier dévoilés.',
      pubDate: 'Mon, 20 Jul 2026 12:00:00 +0200',
    },
  ],
};

export const handlers = [
  http.get('/rss/channels', () => {
    return HttpResponse.json([channel]);
  }),
  http.post('/rss/channel', async ({ request }) => {
    const { feeds } = (await request.json()) as typeof channel;
    channel = { ...channel, feeds };
    return HttpResponse.json({ _id: channel._id });
  }),
  http.put('/rss/channel/:id', async ({ params, request }) => {
    if (params.id !== channel._id) {
      return new HttpResponse(null, { status: 401 });
    }
    const { feeds } = (await request.json()) as typeof channel;
    channel = { ...channel, feeds };
    return HttpResponse.json({ number: 1 });
  }),
  http.get('/rss/feed/items', ({ request }) => {
    const url = new URL(request.url).searchParams.get('url') ?? '';
    const items = itemsByUrl[url];
    // Unknown feeds (e.g. a page that isn't RSS) can't be parsed.
    if (!items) {
      return HttpResponse.json({ status: 500 });
    }
    return HttpResponse.json({
      title: '',
      link: url,
      description: '',
      language: 'fr',
      Items: items,
      status: 200,
    });
  }),
];
