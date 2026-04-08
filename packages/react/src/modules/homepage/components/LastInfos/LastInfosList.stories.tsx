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

const renderWithProps = (props: LastInfosListProps) => () => (
  <div style={{ maxWidth: 397 }}>
    <LastInfosList {...props} />
  </div>
);

export const Default: Story = {
  render: renderWithProps({
    infos: mockLastInfos.map(
      ({ content, title, username, thread }) =>
        ({
          content,
          title,
          username,
          icon: thread.icon,
          thread: thread.title,
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
