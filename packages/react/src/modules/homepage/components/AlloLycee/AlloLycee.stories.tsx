import { Meta, StoryObj } from '@storybook/react-vite';
import AlloLycee from './AlloLycee';

const meta: Meta<typeof AlloLycee> = {
  title: 'Modules/Homepage/AlloLycee',
  component: AlloLycee,
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
          'Homepage card of the Allô Lycée application, inviting users to report an equipment failure or an improvement for their school. ' +
          '`AlloLyceeContainer` shows it only to users with the `allolycee.access` right and opens the application, ' +
          'on the list of their requests or on the request form.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AlloLycee>;

export const Default: Story = {};
