import { Meta, StoryObj } from '@storybook/react-vite';
import { Masonry } from '../Masonry';

const meta: Meta<typeof Masonry> = {
  title: 'Layout/Masonry',
  component: Masonry,
  parameters: {
    docs: {
      description: {
        component:
          'The `Masonry` component lays its children out in a CSS grid of equal columns (2 by default, each taking an equal share of the width minus the gap). Each item spans as many 1px rows as its measured height, so it always lands in the least filled column and columns stay balanced in height. Items keep their DOM order (reading and tab order). Since the placement comes from measured heights, an item growing after mount (lazy loading) can shift the following ones.',
      },
    },
  },
  argTypes: {
    columns: { control: { type: 'number', min: 1, max: 6 } },
    gap: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Masonry>;

const heights = [120, 200, 160, 90, 240, 140];

const cards = heights.map((height, index) => (
  <div
    key={index}
    style={{
      backgroundColor: '#ebebeb',
      padding: '.8rem',
      minHeight: height,
    }}
  >
    {index + 1}
  </div>
));

export const Base: Story = {
  args: { columns: 2, gap: '16' },
  render: (args) => <Masonry {...args}>{cards}</Masonry>,
};

export const ThreeColumns: Story = {
  args: { columns: 3, gap: '16' },
  render: (args) => <Masonry {...args}>{cards}</Masonry>,
};
