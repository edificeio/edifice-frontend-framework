import { Meta, StoryObj } from '@storybook/react';

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
  function handleInfoClick(threadId: number | string, id: number | string) {
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
      ({ content, title, username, thread, id, modifiedDate }, index) =>
        ({
          id,
          content:
            index === 0
              ? `${content} <img src="https://picsum.photos/id/1015/300/180" alt="img 1" /> <img src="https://picsum.photos/id/1016/300/180" alt="img 2" /> <img src="https://picsum.photos/id/1024/300/180" alt="img 3" /> <img src="https://picsum.photos/id/1036/300/180" alt="img 4" />`
              : content,
          title,
          username,
          icon: thread.icon,
          threadId: thread.id,
          threadName: thread.title,
          publicationDate: modifiedDate,
          isHeadline: index === 0,
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
