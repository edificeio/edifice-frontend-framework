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
