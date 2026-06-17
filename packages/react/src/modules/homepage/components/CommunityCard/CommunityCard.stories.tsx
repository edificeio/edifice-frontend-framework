import { Meta, StoryObj } from '@storybook/react';
import CommunityCard from './CommunityCard';

const meta: Meta<typeof CommunityCard> = {
  title: 'Modules/Homepage/CommunityCard',
  component: CommunityCard,
  args: {
    communitiesList: [
      {
        title: 'TS1 Physique-Chimie',
        communityImage:
          'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=',
        onActionClick: () => {},
        nbNotifications: 3,
      },
      {
        title: 'Premiere Specialite Mathematiques',
        communityImage:
          'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=',
        onActionClick: () => {},
        nbNotifications: 0,
      },
      {
        title: 'Seconde Histoire-Geographie',
        communityImage:
          'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=',
        onActionClick: () => {},
        nbNotifications: 0,
      },
      {
        title: 'Terminale SVT',
        communityImage:
          'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=',
        onActionClick: () => {},
        nbNotifications: 0,
      },
    ],
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Ce Storybook documente le composant <code>CommunityCard</code>, utilisé pour afficher une communauté avec son image, son titre et, si besoin, un compteur de notifications.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CommunityCard>;

export const Default: Story = {
  render: (args) => <CommunityCard {...args} />,
  parameters: {
    docs: {
      description: {
        story: `Affichage standard d'une communauté, sans notifications.`,
      },
    },
  },
};

export const WithoutCommunities: Story = {
  render: () => <CommunityCard />,
  parameters: {
    docs: {
      description: {
        story:
          'Affichage sans passer la prop communities (fallback par défaut à une liste vide).',
      },
    },
  },
};

export const WithNotifications: Story = {
  render: (args) => <CommunityCard {...args} />,
  args: {
    communitiesList: [
      {
        title: 'TS1 Physique-Chimie',
        communityImage:
          'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=',
        onActionClick: () => {},
        nbNotifications: 3,
      },
      {
        title: 'Premiere Specialite Mathematiques',
        communityImage:
          'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=',
        onActionClick: () => {},
        nbNotifications: 4,
      },
      {
        title: 'Seconde Histoire-Geographie',
        communityImage:
          'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=',
        onActionClick: () => {},
        nbNotifications: 1,
      },
      {
        title: 'Terminale SVT',
        communityImage:
          'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=',
        onActionClick: () => {},
        nbNotifications: 6,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: `Affichage d'une communauté avec notifications (badge visible et bordure mise en avant).`,
      },
    },
  },
};
