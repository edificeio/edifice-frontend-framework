import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import BriefMe, { BriefMeArticle, BriefMeProps } from './BriefMe';

const meta: Meta<typeof BriefMe> = {
  title: 'Modules/Homepage/BriefMe',
  component: BriefMe,
  decorators: [
    (Story) => (
      <div style={{ height: '35em' }}>
        <div id="portal" />
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Brief.me',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BriefMe>;

const mockArticles: BriefMeArticle[] = [
  {
    id: '1',
    date: '8 juin 2026',
    title:
      'La france en retard sur la transparence salariale | Retour du rhinocéros noir | Bernadette Chirac',
    url: 'https://brief.me',
  },
  {
    id: '2',
    date: '6 juin 2026',
    title: 'L’immigration irrégulière dans l’UE  Chlordécone  Série espagnoles',
    url: 'https://brief.me',
  },
  {
    id: '3',
    date: '5 juin 2026',
    title:
      'Dysfonctionnements judiciaires | Anthropic alerte sur les risques de l’IA | Quiz spécial bac d’histoire',
    url: 'https://brief.me',
  },
];

function openBriefMe() {
  window.open('https://brief.me', '_blank', 'noopener,noreferrer');
}

const RenderWithState = (props: BriefMeProps) => {
  const [category, setCategory] = useState(props.category);

  return (
    <div style={{ maxWidth: 397 }}>
      <BriefMe {...props} category={category} onCategoryChange={setCategory} />
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <RenderWithState
      handleActionClick={openBriefMe}
      status="default"
      category="briefme"
      onCategoryChange={() => {}}
      articles={mockArticles}
    />
  ),
};

export const Chargement: Story = {
  render: () => (
    <RenderWithState
      handleActionClick={openBriefMe}
      status="loading"
      category="briefme"
      onCategoryChange={() => {}}
      articles={[]}
    />
  ),
};

export const Vide: Story = {
  render: () => (
    <RenderWithState
      handleActionClick={openBriefMe}
      status="empty"
      category="brief-eco"
      onCategoryChange={() => {}}
      articles={[]}
    />
  ),
};

export const Erreur: Story = {
  render: () => (
    <RenderWithState
      handleActionClick={openBriefMe}
      status="error"
      category="briefme"
      onCategoryChange={() => {}}
      articles={[]}
    />
  ),
};
