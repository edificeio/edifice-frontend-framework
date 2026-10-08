import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Rss } from './Rss';
import { RssArticle, RssFeed } from './types';

const meta: Meta<typeof Rss> = {
  title: 'Modules/Homepage/Rss/Widget',
  component: Rss,
  decorators: [
    (Story) => <div style={{ maxWidth: 400, width: '100%' }}>{Story()}</div>,
  ],
  args: {
    onEditClick: () => alert('Gérer les flux RSS'),
  },
  parameters: {
    docs: {
      description: {
        component:
          'Widget « RSS » : un sélecteur de flux (un seul actif à la fois) et les 3 derniers articles du flux sélectionné.',
      },
    },
  },
  // Keeps the feed selector interactive in every story.
  render: (args) => {
    const [selectedIndex, setSelectedIndex] = useState(args.selectedIndex);
    return (
      <Rss
        {...args}
        selectedIndex={selectedIndex}
        onSelectFeed={setSelectedIndex}
      />
    );
  },
};

export default meta;
type Story = StoryObj<typeof Rss>;

const mockFeeds: RssFeed[] = [
  { title: 'Le Monde', link: 'https://www.lemonde.fr/rss/une.xml' },
  { title: 'Le Parisien', link: 'https://feeds.leparisien.fr/leparisien/rss' },
  { title: 'Eduscol', link: 'https://eduscol.education.fr/rss.xml' },
  { title: 'France Info', link: 'https://www.francetvinfo.fr/titres.rss' },
  {
    title: 'Le Figaro',
    link: 'https://www.lefigaro.fr/rss/figaro_actualites.xml',
  },
];

const mockArticles: RssArticle[] = [
  {
    title: 'Face aux Etats-Unis, l’Iran parie sur une guerre d’usure',
    link: 'https://www.lemonde.fr/international/article/iran-guerre-usure',
    description:
      'Alors que les frappes américaines se poursuivent en Iran, le pouvoir iranien évite, pour l’instant, une confrontation totale. Son calcul repose sur la menace de provoquer une perturbation énergétique mondiale pour contraindre Washington à revoir sa stratégie.',
    pubDate: 'Tue, 21 Jul 2026 08:00:00 +0200',
  },
  {
    title:
      'Le projet de loi d’urgence agricole adopté dans la cacophonie par une Assemblée nationale fracturée sur la question des pesticides',
    link: 'https://www.lemonde.fr/politique/article/loi-urgence-agricole',
    description:
      'Le gouvernement craignait que la mesure permettant la réautorisation dérogatoire de deux néonicotinoïdes, ajoutée par le Sénat, ne conduise au rejet du texte. Le projet de loi a finalement été largement adopté par les députés dans la nuit de lundi à mardi par 296 voix pour, majoritairement issues de la droite et de l’extrême droite et 224 contre.',
    pubDate: 'Tue, 21 Jul 2026 07:00:00 +0200',
  },
  {
    title:
      'Ebola en RDC : posez vos questions à nos journalistes Morgane Le Cam et Philémon Barbier, de retour de reportage dans l’épicentre de l’épidémie',
    link: 'https://www.lemonde.fr/afrique/article/ebola-rdc-questions',
    description:
      'Notre reporter s’est rendue pour « Le Monde Afrique » avec le photographe Philémon Barbier à Mongbwalu, dans l’est de la République démocratique du Congo, où l’épidémie d’Ebola due à la souche Bundibugyo s’est déclarée et progresse rapidement. Posez-leur vos questions à partir de 11 heures.',
    pubDate: 'Tue, 21 Jul 2026 06:00:00 +0200',
  },
];

export const WithArticles: Story = {
  args: {
    feeds: mockFeeds,
    selectedIndex: 0,
    articles: mockArticles,
    articlesStatus: 'success',
  },
};

export const Empty: Story = {
  args: {
    feeds: [],
    selectedIndex: 0,
    articles: [],
    articlesStatus: 'success',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Aucun flux ajouté : le bouton « Ajouter » ouvre la modale de gestion des flux.',
      },
    },
  },
};

export const NoArticles: Story = {
  args: {
    feeds: mockFeeds,
    selectedIndex: 0,
    articles: [],
    articlesStatus: 'success',
  },
};

export const FeedError: Story = {
  args: {
    feeds: mockFeeds,
    selectedIndex: 0,
    articles: [],
    articlesStatus: 'error',
  },
  parameters: {
    docs: {
      description: {
        story: "L'URL du flux sélectionné ne renvoie pas un flux RSS lisible.",
      },
    },
  },
};

export const LoadingArticles: Story = {
  args: {
    feeds: mockFeeds,
    selectedIndex: 0,
    articles: [],
    articlesStatus: 'loading',
  },
};

export const LoadingFeeds: Story = {
  args: {
    feeds: [],
    isLoading: true,
    selectedIndex: 0,
    articles: [],
    articlesStatus: 'loading',
  },
};
