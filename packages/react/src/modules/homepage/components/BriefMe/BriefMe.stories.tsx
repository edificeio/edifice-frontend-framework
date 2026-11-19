import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import BriefMe, { BriefMeProps } from './BriefMe';
import { BriefMeArticle } from './types';

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

const loadedProps: BriefMeProps = {
  handleActionClick: openBriefMe,
  status: 'default',
  category: 'briefme',
  onCategoryChange: () => {},
  articles: mockArticles,
};

const loadingProps: BriefMeProps = { ...loadedProps, isLoading: true };

export const Skeleton: Story = {
  render: () => <BriefMe {...loadingProps} />,
};

export const SkeletonAboveTheLoadedCard: Story = {
  render: () => (
    <div className="skeleton-overlay-stack" style={{ maxWidth: 397 }}>
      <BriefMe {...loadingProps} />
      <BriefMe {...loadedProps} />
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
  render: () => (
    <div className="skeleton-overlay" style={{ maxWidth: 397 }}>
      <BriefMe {...loadedProps} />
      <div className="skeleton-overlay-top">
        <BriefMe {...loadingProps} />
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
