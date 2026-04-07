import { Meta, StoryObj } from '@storybook/react';

import { LastInfosContainer } from './LastInfosContainer';

const meta: Meta<typeof LastInfosContainer> = {
  title: 'Modules/Homepage/LastInfosContainer',
  component: LastInfosContainer,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'LastInfosContainer',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof LastInfosContainer>;

export const Default: Story = {};
