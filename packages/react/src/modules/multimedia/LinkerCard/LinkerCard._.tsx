import { Meta, StoryObj } from '@storybook/react';

import LinkerCard from './LinkerCard';

const baseResource = {
  id: '1',
  assetId: '1',
  name: 'resource title here',
  creatorId: 'john',
  creatorName: 'John Doe',
  modifiedAt: '2000-01-01T01:00:00.000Z',
  thumbnail: null as unknown as string,
  description: null as unknown as string,
  createdAt: null as unknown as string,
  modifierId: null as unknown as string,
  modifierName: null as unknown as string,
  rights: [],
  trashed: false,
  updatedAt: null as unknown as string,
};

const meta: Meta<typeof LinkerCard> = {
  title: 'Components/Card/Linker Card',
  component: LinkerCard,
  args: {
    isSelectable: false,
    isClickable: true,
    isSelected: false,
    doc: Object.assign({}, baseResource, {
      application: '',
    }),
  },
};

export default meta;
type Story = StoryObj<typeof LinkerCard>;

export const Base: Story = {
  render: (args) => {
    return <LinkerCard {...args} />;
  },
};

export const TimelineGenerator: Story = {
  render: (args) => {
    args.doc.application = 'timelinegenerator';
    return <LinkerCard {...args} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'A timelinegenerator card',
      },
    },
  },
};

export const Blog: Story = {
  render: (args) => {
    args.doc.application = 'blog';
    return <LinkerCard {...args} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'A blog card',
      },
    },
  },
};
