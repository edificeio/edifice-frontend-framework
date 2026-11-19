import { mockPronoteStructures } from '@edifice.io/config';
import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CarnetDeBord, CarnetDeBordProps } from '../CarnetDeBord';
import { parseEleves } from '../utils';

const avatars = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
];

const eleves = parseEleves(mockPronoteStructures, {}).map((eleve, index) => ({
  ...eleve,
  avatar: avatars[index],
}));

const meta: Meta<typeof CarnetDeBord> = {
  title: 'Modules/Homepage/CarnetDeBord',
  component: CarnetDeBord,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 397 }}>
        <div id="portal" />
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Carnet de bord Pronote d'un ou plusieurs élèves : retards et absences non justifiés, notes, cahier de textes et compétences. « Voir plus » et chaque catégorie non vide ouvrent la modale de détail (sur mobile, les catégories y sont proposées dans une liste déroulante).",
      },
    },
  },
  render: (args: CarnetDeBordProps) => {
    const [currentEleveIndex, setCurrentEleveIndex] = useState(
      args.currentEleveIndex,
    );
    return (
      <CarnetDeBord
        {...args}
        currentEleveIndex={currentEleveIndex}
        onEleveChange={setCurrentEleveIndex}
      />
    );
  },
  args: {
    currentEleveIndex: 0,
    onEleveChange: () => {},
  },
};

export default meta;

type Story = StoryObj<typeof CarnetDeBord>;

export const WithContentMultiKids: Story = {
  args: { status: 'default', eleves, isRelative: true },
};

export const WithContentSingleKid: Story = {
  args: { status: 'default', eleves: [eleves[0]], isRelative: true },
};

export const StudentView: Story = {
  args: { status: 'default', eleves: [eleves[0]], isRelative: false },
  parameters: {
    docs: {
      description: {
        story:
          "Vue élève : le titre de la modale n'affiche pas le nom de l'élève.",
      },
    },
  },
};

export const WithEmptyCategories: Story = {
  args: { status: 'default', eleves: [eleves[2]] },
};

export const Loading: Story = {
  args: { status: 'loading', eleves: [] },
};

export const Empty: Story = {
  args: { status: 'empty', eleves: [] },
};

export const Error: Story = {
  args: { status: 'error', eleves: [] },
};

export const Skeleton: Story = {
  args: { ...WithContentMultiKids.args, isLoading: true },
};

export const SkeletonAboveTheLoadedCard: Story = {
  args: WithContentMultiKids.args,
  render: (args) => (
    <div className="skeleton-overlay-stack">
      <CarnetDeBord {...args} isLoading />
      <CarnetDeBord {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The skeleton card shown while the widget loads, stacked on top of the loaded card. Its content block is sized to this loaded card, so any difference in height is the layout shift the user would see.',
      },
    },
  },
};

export const SkeletonSuperimposedOnTheLoadedCard: Story = {
  args: WithContentMultiKids.args,
  render: (args) => (
    <div className="skeleton-overlay">
      <CarnetDeBord {...args} />
      <div className="skeleton-overlay-top">
        <CarnetDeBord {...args} isLoading />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The skeleton card superimposed on the loaded card, at partial opacity. The header and the content block should cover the loaded header and content exactly.',
      },
    },
  },
};
