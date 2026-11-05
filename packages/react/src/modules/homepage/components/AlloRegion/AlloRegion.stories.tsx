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
