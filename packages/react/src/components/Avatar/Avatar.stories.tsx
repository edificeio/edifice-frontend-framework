import { Meta, StoryObj } from '@storybook/react';

import noAvatar from '@edifice.io/bootstrap/dist/images/avatar/no-avatar.svg';
import Avatar from './Avatar';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component:
          'The Avatar component displays user profile images or placeholder icons. It can be used within Card components or anywhere a user image is needed. A default placeholder image is shown when no image source is provided via the `src` prop or if the image fails to load. The component supports different sizes and shapes to fit various design needs.',
      },
    },
  },
  args: {
    variant: 'square',
    size: 'md',
  },
  argTypes: {
    variant: {
      options: ['square', 'rounded', 'circle'],
      control: { type: 'select' },
    },
    size: {
      options: ['xs', 'sm', 'md', 'lg'],
      control: { type: 'inline-radio' },
    },
    innerBorderColor: {
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'],
      control: { type: 'select' },
    },
    outerBorderColor: {
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'],
      control: { type: 'select' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Base: Story = {
  render: (args) => <Avatar {...args} />,
};

export const AvatarSizes: Story = {
  render: (args) => {
    return (
      <div className="d-flex align-items-center gap-8">
        <Avatar size="xs" alt="alternative text" />
        <Avatar size="sm" alt="alternative text" />
        <Avatar size="md" alt="alternative text" />
        <Avatar size="lg" alt="alternative text" />
      </div>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          'Avatar Component accepts 4 sizes with the `size` prop attribute: `xs | sm | md | lg`',
      },
    },
  },
};

export const AvatarShapes: Story = {
  render: (args) => {
    return (
      <div className="d-flex align-items-center gap-8">
        <Avatar
          src="https://i.pravatar.cc/300"
          size="md"
          variant="square"
          alt="alternative text"
        />
        <Avatar
          src="https://i.pravatar.cc/300"
          size="md"
          variant="rounded"
          alt="alternative text"
        />
        <Avatar
          src="https://i.pravatar.cc/300"
          size="md"
          variant="circle"
          alt="alternative text"
        />
      </div>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          'Avatar Component can take 3 different shapes with the `variant` prop attribute: `square | rounded | circle`. Default value is `square`',
      },
    },
  },
};

export const AvatarFallback: Story = {
  render: (args) => (
    <Avatar src={noAvatar} size="md" variant="square" alt="alternative text" />
  ),

  parameters: {
    docs: {
      description: {
        story:
          'If `src` is undefined or on error, we use the placeholder image as a fallback.',
      },
    },
  },
};

export const AvatarCustomFallback: Story = {
  render: (args) => {
    return (
      <Avatar
        size="md"
        alt="alternative text"
        imgPlaceholder="https://bit.ly/kent-c-dodds"
      />
    );
  },

  parameters: {
    docs: {
      description: {
        story: 'You can override the default fallback with `imgPlaceholder`',
      },
    },
  },
};

export const WithBorders: Story = {
  args: {
    src: 'https://i.pravatar.cc/300',
    alt: 'Avatar with borders',
    innerBorderColor: 'info',
    innerBorderWidth: 3,
    outerBorderColor: 'black',
    outerBorderWidth: 3,
    outerBorderOffset: 1,
    variant: 'circle',
  },
};
export const WithInnerBorderOnly: Story = {
  args: {
    src: 'https://i.pravatar.cc/300',
    alt: 'Avatar with inner border',
    innerBorderColor: 'success',
    innerBorderWidth: 3,
    variant: 'circle',
  },
};

export const WithOuterBorderOnly: Story = {
  args: {
    src: 'https://i.pravatar.cc/300',
    alt: 'Avatar with outer border',
    outerBorderColor: 'danger',
    outerBorderWidth: 4,
    outerBorderOffset: 2,
    variant: 'circle',
  },
};
