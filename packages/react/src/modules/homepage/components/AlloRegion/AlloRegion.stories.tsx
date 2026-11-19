import { Meta, StoryObj } from '@storybook/react-vite';
import AlloRegion from './AlloRegion';

const meta: Meta<typeof AlloRegion> = {
  title: 'Modules/Homepage/AlloRegion',
  component: AlloRegion,
  decorators: [
    (Story) => <div style={{ maxWidth: 400, width: '100%' }}>{Story()}</div>,
  ],
  args: {
    onRequestsClick: () => {},
    onNewRequestClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        component:
          'Homepage card of the Allô Région application, inviting users to report an equipment failure or an improvement for their school. ' +
          '`AlloRegionContainer` shows it only to users with the `alloregion.access` right and opens the application, ' +
          'on the list of their requests or on the request form.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AlloRegion>;

export const Default: Story = {};

export const Skeleton: Story = {
  args: { isLoading: true },
};

export const SkeletonAboveTheLoadedCard: Story = {
  render: (args) => (
    <div className="skeleton-overlay-stack">
      <AlloRegion {...args} isLoading />
      <AlloRegion {...args} />
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
  render: (args) => (
    <div className="skeleton-overlay">
      <AlloRegion {...args} />
      <div className="skeleton-overlay-top">
        <AlloRegion {...args} isLoading />
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
