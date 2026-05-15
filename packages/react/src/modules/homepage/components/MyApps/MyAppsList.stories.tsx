import { Meta, StoryObj } from '@storybook/react';

import { mockLastInfos } from '@edifice.io/config/src/msw/mocks/actualites';
import { LastInfosProps } from './LastInfos';
import { MyAppsList } from './MyAppsList';

const meta: Meta<typeof MyAppsList> = {
  title: 'Modules/Homepage/MyApps',
  component: MyAppsList,
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
          'Ce storybook documente le composant <code>MyAppsList</code>.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MyAppsList>;

const renderWithProps = (props: LastInfosListProps) => () => {
  function handleInfoClick(threadId: number | string, id: number | string) {
    alert(`Info ID=${id} was clicked`);
  }

  function handleSeeMoreClick() {
    alert(`See more was clicked`);
  }

  return (
    <div style={{ maxWidth: 397 }}>
      <MyAppsList
        {...props}
        onSeeMoreClick={handleSeeMoreClick}
        onInfoClick={handleInfoClick}
      />
    </div>
  );
};

export const Default: Story = {
  render: renderWithProps({
    apps: mockLastInfos.map(
      ({ content, title, username, thread, id, modifiedDate }, index) =>
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
