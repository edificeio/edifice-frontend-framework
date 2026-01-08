import { Meta, StoryObj } from '@storybook/react';

import { IconHourglass } from '../../modules/icons/components';
import Badge, { BadgeProps } from './Badge';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'content / success / background',
        'content / warning / background',
        'content / danger / background',
        'content / info / background',
        'content / success',
        'content / warning',
        'content / danger',
        'content / info',
        'notification / success',
        'notification / warning',
        'notification / danger',
        'notification / info',
        'user / student / background',
        'user / teacher / background',
        'user / relative / background',
        'user / personnel / background',
        'user / guest / background',
        'user / student',
        'user / teacher',
        'user / relative',
        'user / personnel',
        'user / guest',
      ],
      mapping: {
        'content / success / background': {
          type: 'content',
          level: 'success',
          background: true,
        },
        'content / warning / background': {
          type: 'content',
          level: 'warning',
          background: true,
        },
        'content / danger / background': {
          type: 'content',
          level: 'danger',
          background: true,
        },
        'content / info / background': {
          type: 'content',
          level: 'info',
          background: true,
        },
        'content / success': {
          type: 'content',
          level: 'success',
        },
        'content / warning': {
          type: 'content',
          level: 'warning',
        },
        'content / danger': {
          type: 'content',
          level: 'danger',
        },
        'content / info': {
          type: 'content',
          level: 'info',
        },
        'notification / success': {
          type: 'notification',
          level: 'success',
        },
        'notification / warning': {
          type: 'notification',
          level: 'warning',
        },
        'notification / danger': {
          type: 'notification',
          level: 'danger',
        },
        'notification / info': {
          type: 'notification',
          level: 'info',
        },
        'user / student / background': {
          type: 'user',
          profile: 'student',
          background: true,
        },
        'user / teacher / background': {
          type: 'user',
          profile: 'teacher',
          background: true,
        },
        'user / relative / background': {
          type: 'user',
          profile: 'relative',
          background: true,
        },
        'user / personnel / background': {
          type: 'user',
          profile: 'personnel',
          background: true,
        },
        'user / guest / background': {
          type: 'user',
          profile: 'guest',
          background: true,
        },
        'user / student': { type: 'user', profile: 'student' },
        'user / teacher': { type: 'user', profile: 'teacher' },
        'user / relative': { type: 'user', profile: 'relative' },
        'user / personnel': { type: 'user', profile: 'personnel' },
        'user / guest': { type: 'user', profile: 'guest' },
      },
    },
  },
  args: {
    children: 'Badge',
    variant: { type: 'content', level: 'success', background: true },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The Badge component is used to highlight and display status, user profiles, or notifications. It supports different types including content badges, user profile badges, and notification badges. Each type has specific variants and can optionally include background colors. Content badges can show success, info, warning or danger states. User badges reflect different user profiles like student, teacher, etc. Notification badges are used to display alert levels.',
      },
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Base: Story = {
  args: {
    children: 'Badge',
    variant: { type: 'content', level: 'success', background: true },
  },
};

export const BadgeContent: Story = {
  args: {
    variant: { type: 'content', level: 'success', background: true },
  },

  render: (args: BadgeProps) => {
    return <Badge {...args}>Visible</Badge>;
  },

  parameters: {
    docs: {
      description: {
        story:
          'Badge of type `content` expects different levels: `success | info | warning | danger`. You can add `background` key to the variant object to set a backgroundColor',
      },
    },
  },
};

export const BadgeProfile: Story = {
  args: {
    variant: { type: 'user', profile: 'Student', background: true },
  },

  render: (args: BadgeProps) => {
    return <Badge {...args}>Profil</Badge>;
  },

  parameters: {
    docs: {
      description: {
        story:
          'Badge of type `user` expects different levels: `Student | Teacher | Personnel | Relative | Guest`. You can add `background` key to the variant object to set a backgroundColor',
      },
    },
  },
};

export const BadgeChip: Story = {
  args: {
    variant: { type: 'chip' },
  },

  render: (args: BadgeProps) => {
    return (
      <Badge {...args}>
        <IconHourglass width="20" height="20" className="me-8" />
        An history of time
      </Badge>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          'Badge of type `chip` present information, can filter content or can trigger actions. (E.g: used in `LinkerRenderer` in your Rich Editor)',
      },
    },
  },
};

export const BadgeLink: Story = {
  args: {
    variant: { type: 'link' },
  },

  render: (args: BadgeProps) => {
    return (
      <Badge {...args}>
        <a href="/">An history of time</a>
      </Badge>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          'When using Badge of type `link`, you have to add yourself a `<a>` or any routing component',
      },
    },
  },
};

export const BadgeNotification: Story = {
  args: {
    variant: { type: 'notification', level: 'danger' },
  },

  render: (args: BadgeProps) => {
    return <Badge {...args}>9</Badge>;
  },

  parameters: {
    docs: {
      description: {
        story:
          'Badge of type `notification` is useful to represent statuses, notifications or short messages',
      },
    },
  },
};

export const BadgeBetaCommunities: Story = {
  args: {
    children: null,
    variant: {
      type: 'beta',
      app: {
        name: 'communities',
        address: '',
        display: false,
        displayName: 'Communities',
        icon: '',
        isExternal: false,
        scope: [],
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Badge of type `beta` is used to indicate that a feature or component is in beta status. You can customize the color of the badge using the `color` property, which accepts a hex color code.',
      },
    },
  },
  render: (args: BadgeProps) => {
    return <Badge {...args} />;
  },
};

export const BadgeBetaBlog: Story = {
  args: {
    children: null,
    variant: {
      type: 'beta',
      app: {
        name: 'blog',
        address: '',
        display: false,
        displayName: 'Blog',
        icon: '',
        isExternal: false,
        scope: [],
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Badge of type `beta` is used to indicate that a feature or component is in beta status. You can customize the color of the badge using the `color` property, which accepts a hex color code.',
      },
    },
  },
  render: (args: BadgeProps) => {
    return <Badge {...args} />;
  },
};
