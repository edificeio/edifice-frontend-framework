import { Meta, StoryObj } from '@storybook/react-vite';

import Edumalin from '../Edumalin';
import { EdumalinItem } from '../types';

const meta: Meta<typeof Edumalin> = {
  title: 'Modules/Homepage/Edumalin/Widget',
  component: Edumalin,
  decorators: [
    (Story) => <div style={{ maxWidth: 400, width: '100%' }}>{Story()}</div>,
  ],
  args: {
    onItemClick: (item: EdumalinItem) => alert(`Ouvrir « ${item.title} »`),
    onEdumalinClick: () => alert('Accéder à Édumalin'),
  },
  parameters: {
    docs: {
      description: {
        component:
          'Widget « Édumalin » — affiche les 3 premiers contenus publiés par Édumalin (webinaires, RDV, annonces…) selon le profil, et donne accès à Édumalin via le GAR.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Edumalin>;

const items: EdumalinItem[] = [
  {
    // Title and description longer than 2 lines: both are truncated.
    title:
      'Accompagner les élèves à besoins éducatifs particuliers dans leurs apprentissages grâce aux stratégies métacognitives',
    description:
      'Rejoignez notre équipe pédagogique pour une heure d’échanges autour des stratégies d’apprentissage : planification du travail personnel, mémorisation active et retour réflexif. Le webinaire se termine par un temps de questions-réponses avec une enseignante de collège.',
    type: { name: 'Webinaire' },
  },
  {
    // Short title and description: a single line each.
    title: 'Ma classe de 4e en autonomie',
    description: 'Retour d’expérience d’une professeure de SVT.',
    type: { name: 'Temoignage' },
  },
  {
    // Title wrapping on 2 lines, no description.
    title: 'Retrouvez-nous au salon Educatech Expo à Paris',
    type: { name: 'RDV' },
  },
];

const allTypes: EdumalinItem[] = [
  'Webinaire',
  'Annonce',
  'Actualité',
  'RDV',
  'Témoignage',
  'Replay',
  'Podcast',
  'Tutoriel',
  'Conférence',
].map((name) => ({
  title: `Un contenu de type « ${name} »`,
  description: 'Une description courte.',
  type: { name },
}));

const error = { code: 400, message: 'edumalin.widget.missing' };

export const WithContent: Story = {
  args: { status: 'default', items },
  parameters: {
    docs: {
      description: {
        story:
          'Titres et descriptions limités à 2 lignes : un contenu long (tronqué), un contenu court (1 ligne) et un contenu sans description.',
      },
    },
  },
};

export const AllTypes: Story = {
  args: { status: 'default', items: allTypes },
  parameters: {
    docs: {
      description: {
        story:
          'Les 9 types et leurs couleurs. Un type inconnu (« Conférence ») est affiché comme « Autre ». En réel, le widget n’affiche que 3 contenus.',
      },
    },
  },
};

export const Loading: Story = {
  args: { status: 'loading', items: [] },
};

export const Empty: Story = {
  args: { status: 'empty', items: [] },
  parameters: {
    docs: {
      description: {
        story: 'Édumalin ne renvoie aucun contenu.',
      },
    },
  },
};

export const ConnectionError: Story = {
  args: {
    status: 'connectionError',
    items: [],
    error: { code: 400, message: 'edumalin.widget.unauthorized' },
  },
  parameters: {
    docs: {
      description: {
        story: "L'ENT n'arrive pas à s'authentifier auprès d'Édumalin.",
      },
    },
  },
};

export const LoadingError: Story = {
  args: { status: 'loadError', items: [], error },
  parameters: {
    docs: {
      description: {
        story:
          "L'ENT est authentifié mais n'arrive pas à récupérer les contenus Édumalin.",
      },
    },
  },
};
