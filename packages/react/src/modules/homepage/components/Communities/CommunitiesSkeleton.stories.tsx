import type { Meta, StoryObj } from '@storybook/react-vite';
import CommunitiesSkeleton from './CommunitiesSkeleton';

const meta = {
  title: 'Modules/Homepage/CommunitiesSkeleton',
  component: CommunitiesSkeleton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minWidth: '720px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CommunitiesSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
