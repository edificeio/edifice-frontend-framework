import { Meta, StoryObj } from '@storybook/react-vite';

import { mockLastInfos } from '@edifice.io/config/src/msw/mocks/actualites';
import { LastInfosProps } from './LastInfos';
import { LastInfosList, LastInfosListProps } from './LastInfosList';

const meta: Meta<typeof LastInfosList> = {
  title: 'Modules/Homepage/LastInfos',
  component: LastInfosList,
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#000', padding: '4rem' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Ce storybook documente les composants <code>LastInfosList</code> et <code>LastInfos</code>, pour afficher des dernières actualités au format Card.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LastInfosList>;

const renderWithProps = (props: LastInfosListProps) => () => {
  function handleInfoClick(_threadId: number | string, id: number | string) {
    alert(`Info ID=${id} was clicked`);
  }

  function handleSeeMoreClick() {
    alert(`See more was clicked`);
  }

  return (
    <div style={{ maxWidth: 397 }}>
      <LastInfosList
        {...props}
        onSeeMoreClick={handleSeeMoreClick}
        onInfoClick={handleInfoClick}
      />
    </div>
  );
};

export const Default: Story = {
  render: renderWithProps({
    infos: mockLastInfos.map(
      (
        {
          content,
          title,
          username,
          thread,
          id,
          modifiedDate,
          headline: isHeadline,
        },
        index,
      ) =>
        ({
          id,
          content:
            index === 0
              ? `${content} <img src="https://picsum.photos/id/1015/300/180" alt="img 1" />`
              : index === 1
                ? `${content} <img src="https://picsum.photos/id/1015/300/180" alt="img 1" /> <img src="https://picsum.photos/id/1016/300/180" alt="img 2" />`
                : index === 2
                  ? `${content} <img src="https://picsum.photos/id/1015/300/180" alt="img 1" /> <img src="https://picsum.photos/id/1016/300/180" alt="img 2" /> <img src="https://picsum.photos/id/1024/300/180" alt="img 3" />`
                  : index === 3
                    ? `${content} <img src="https://picsum.photos/id/1015/300/180" alt="img 1" /> <img src="https://picsum.photos/id/1016/300/180" alt="img 2" /> <img src="https://picsum.photos/id/1024/300/180" alt="img 3" /> <img src="https://picsum.photos/id/1036/300/180" alt="img 4" />`
                    : content,
          title,
          username,
          icon: thread.icon || '',
          threadId: thread.id,
          threadName: thread.title,
          publicationDate: modifiedDate,
          isHeadline,
        }) satisfies LastInfosProps,
    ),
  }),
  parameters: {
    docs: {
      description: {
        story: `Rendu de quelques actualités (cards)`,
      },
    },
  },
};

export const Empty: Story = {
  render: renderWithProps({ infos: [] }),
  parameters: {
    docs: {
      description: {
        story: `État vide (aucune actualités)`,
      },
    },
  },
};

export const Loading: Story = {
  render: renderWithProps({ infos: [], isLoading: true }),
  parameters: {
    docs: {
      description: {
        story: `État de chargement : l'en-tête reste affiché, les cards sont remplacées par des skeletons`,
      },
    },
  },
};

const IMAGES =
  '<img src="https://picsum.photos/id/1015/300/180" alt="img 1" /> <img src="https://picsum.photos/id/1016/300/180" alt="img 2" />';
const LONG_TEXT =
  'La sortie au musée prévue jeudi est reportée à la semaine prochaine, les autorisations signées restent valables pour la nouvelle date.';

const loadedInfos: LastInfosProps[] = mockLastInfos
  .slice(0, 4)
  .map(({ username, thread, id, modifiedDate, headline }, index) => ({
    id,
    title: LONG_TEXT,
    content: index % 2 === 0 ? `<p>${LONG_TEXT}</p> ${IMAGES}` : LONG_TEXT,
    username,
    icon: thread.icon || '',
    threadId: thread.id,
    threadName: thread.title,
    publicationDate: modifiedDate,
    isHeadline: headline,
  }));

export const SkeletonAboveTheLoadedList: Story = {
  render: () => (
    <div className="skeleton-overlay-stack" style={{ maxWidth: 397 }}>
      <LastInfosList infos={[]} isLoading />
      <LastInfosList infos={loadedInfos} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The loading state stacked on top of the loaded list. Any difference in height between the two is the layout shift the user would see when the infos arrive.',
      },
    },
  },
};

export const SkeletonSuperimposedOnTheLoadedList: Story = {
  render: () => (
    <div className="skeleton-overlay" style={{ maxWidth: 397 }}>
      <LastInfosList infos={loadedInfos} />
      <div className="skeleton-overlay-top">
        <LastInfosList infos={[]} isLoading />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The loading state superimposed on the loaded list, at partial opacity. Each grey block should sit over the content it replaces; the image row keeps the two centred tiles of the mockup.',
      },
    },
  },
};
