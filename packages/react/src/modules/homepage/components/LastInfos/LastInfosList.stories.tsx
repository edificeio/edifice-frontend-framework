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

const threadIconInfo = mockLastInfos[0];
const threadIconBaseProps = {
  content: threadIconInfo.content,
  username: threadIconInfo.username,
  threadId: threadIconInfo.thread.id,
  publicationDate: threadIconInfo.modifiedDate,
  isHeadline: false,
} satisfies Partial<LastInfosProps>;

export const ThreadIcon: Story = {
  render: renderWithProps({
    infos: [
      {
        ...threadIconBaseProps,
        id: 'thread-icon-ok',
        icon: threadIconInfo.thread.icon || '',
        threadName: 'Fil avec un picto',
        title: 'Le picto du fil est affiché',
      },
      {
        ...threadIconBaseProps,
        id: 'thread-icon-missing',
        icon: '',
        threadName: 'Fil sans picto',
        title: 'Aucun picto : icône Actualités par défaut',
      },
      {
        ...threadIconBaseProps,
        id: 'thread-icon-broken',
        // This URL is not mocked and returns a 404.
        icon: '/thread-icon-not-found.png',
        threadName:
          'Parcours égalité filles-garçons et lutte contre les discriminations',
        title: 'Picto en erreur (404) : icône Actualités par défaut',
      },
    ],
  }),
  parameters: {
    docs: {
      description: {
        story: `Le picto du fil est purement décoratif (<code>alt=""</code>) : le nom du fil est déjà affiché juste à côté. Si le fil n'a pas de picto, ou si son chargement échoue (404…), l'icône Actualités est affichée à la place.`,
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
