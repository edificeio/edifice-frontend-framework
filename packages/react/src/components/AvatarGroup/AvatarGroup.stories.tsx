import type { Meta, StoryObj } from '@storybook/react';
import { IconOptions } from '../../modules/icons/components';
import AvatarGroup from './AvatarGroup';

const meta = {
  title: 'Components/AvatarGroup',
  component: AvatarGroup,
  parameters: {
    docs: {
      description: {
        component:
          'AvatarGroup is a component that displays a group of avatars with an elegant overlap. It is ideal for representing groups of users or participants in a project. The component offers customization options such as the maximum number of avatars to display, the degree of overlap, different sizes and shapes.',
      },
    },
  },
  args: {
    variant: 'circle',
    size: 'md',
    overlap: 20,
    maxAvatars: 3,
  },
  argTypes: {
    variant: {
      options: ['square', 'circle'],
      control: { type: 'select' },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'inline-radio' },
    },
    overlap: {
      control: { type: 'number' },
    },
    maxAvatars: {
      control: { type: 'number' },
    },
    innerBorderColor: {
      options: [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'black',
        'white',
      ],
      control: { type: 'select' },
    },
    innerBorderWidth: {
      control: { type: 'number' },
    },
    outerBorderColor: {
      options: [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'black',
        'white',
      ],
      control: { type: 'select' },
    },
    outerBorderWidth: {
      control: { type: 'number' },
    },
    outerBorderOffset: {
      control: { type: 'number' },
    },
    wrap: {
      control: { type: 'boolean' },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockAvatars = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
  'https://i.pravatar.cc/150?img=5',
];

export const Base: Story = {
  args: {
    src: mockAvatars,
    alt: 'Avatar',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of a base avatar group with default settings.',
      },
    },
  },
};

export const MaxAvatarsExample: Story = {
  args: {
    src: mockAvatars,
    maxAvatars: 2,
    alt: 'Avatar',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Using the `maxAvatars` property to limit the number of avatars displayed.',
      },
    },
  },
};

export const OverlapExample: Story = {
  args: {
    src: mockAvatars,
    overlap: 30,
    alt: 'Avatar',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Customizing the overlap between avatars with the `overlap` property.',
      },
    },
  },
};

export const Sizes: Story = {
  args: {
    src: mockAvatars,
    alt: 'Avatar',
  },
  render: () => (
    <div className="d-flex flex-column gap-8">
      <AvatarGroup src={mockAvatars} size="sm" alt="Small avatars" />
      <AvatarGroup src={mockAvatars} size="md" alt="Medium avatars" />
      <AvatarGroup src={mockAvatars} size="lg" alt="Large avatars" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The AvatarGroup component supports three different sizes: `sm`, `md`, and `lg`.',
      },
    },
  },
};

export const Variants: Story = {
  args: {
    src: mockAvatars,
    variant: 'circle',
    alt: 'Circle avatars',
  },
  render: () => (
    <div className="d-flex flex-column gap-8">
      <AvatarGroup src={mockAvatars} variant="circle" alt="Circle avatars" />
      <AvatarGroup src={mockAvatars} variant="square" alt="Square avatars" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Two variants are available for the shape of the avatars: `circle` and `square`.',
      },
    },
  },
};

export const Wrap: Story = {
  args: {
    src: mockAvatars,
    wrap: true,
    alt: 'Wrap avatars',
  },
  render: () => (
    <div
      className="d-flex flex-column gap-8 flex-wrap"
      style={{ width: '100px' }}
    >
      <AvatarGroup src={mockAvatars} maxAvatars={6} wrap alt="Wrap avatars" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The wrap property allows the avatar group to wrap onto multiple lines if there are too many avatars to fit in a single line.',
      },
    },
  },
};

export const LastItemCover: Story = {
  args: {
    src: mockAvatars,
    alt: 'Last item cover',
  },
  render: () => (
    <div className="d-flex flex-column gap-8 flex-wrap">
      <AvatarGroup
        src={mockAvatars}
        lastItemCover={<IconOptions style={{ rotate: '90deg' }} color="#FFF" />}
        alt="Last item cover"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The last item cover allows you to customize the appearance of the last avatar in the group.',
      },
    },
  },
};
