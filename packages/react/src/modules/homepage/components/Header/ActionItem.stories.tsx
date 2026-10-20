import { Meta, StoryObj } from '@storybook/react-vite';

import hillsBackground from '@edifice.io/bootstrap/dist/images/backgrounds/hills.svg';
import { IconEdit, IconLogout, IconUser } from '../../../icons/components';
import { ActionItem } from './ActionItem';

const meta: Meta<typeof ActionItem> = {
  title: 'Modules/Homepage/Header/ActionItem',
  component: ActionItem,
  parameters: {
    docs: {
      description: {
        component:
          'Action row (icon + label). Rendered as a link when `href` is set (navigation), otherwise as a `button` (e.g. opening a modal or triggering an in-page action). Context-free (no Dropdown dependency): meant to be reused by the Dropdown redesign (ENABLING-882).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['default', 'destructive'],
    },
  },
  decorators: [
    (Story) => (
      <div
        className="d-flex justify-content-center align-items-start"
        style={{
          minHeight: 300,
          padding: '2rem',
          backgroundImage: `url(${hillsBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Mimics the popover box the items are displayed in */}
        <div
          className="bg-white"
          style={{
            minWidth: 180,
            padding: 8,
            borderRadius: 16,
            boxShadow: '0 4px 10px 0 rgb(0 0 0 / 18%)',
          }}
        >
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ActionItem>;

export const Link: Story = {
  args: {
    href: '#',
    icon: <IconUser />,
    children: 'Mon compte',
  },
  parameters: {
    docs: {
      description: {
        story: 'With `href`: rendered as a link.',
      },
    },
  },
};

export const Button: Story = {
  args: {
    icon: <IconEdit />,
    children: 'Action',
    onClick: () => alert('Action triggered'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Without `href`: rendered as a `button` calling `onClick` (here an `alert()`).',
      },
    },
  },
};

export const Destructive: Story = {
  args: {
    href: '#',
    icon: <IconLogout />,
    variant: 'destructive',
    children: 'Déconnexion',
  },
};

export const Disabled: Story = {
  args: {
    icon: <IconEdit />,
    children: 'Action',
    disabled: true,
    onClick: () => alert('Should not be triggered'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Only available as a button (no `href`).',
      },
    },
  },
};

export const List: Story = {
  render: () => (
    <div className="d-flex flex-column gap-4">
      <ActionItem href="#" icon={<IconUser />}>
        Link
      </ActionItem>
      <ActionItem icon={<IconEdit />} onClick={() => alert('Action triggered')}>
        Action (alert)
      </ActionItem>
      <ActionItem href="#" icon={<IconLogout />} variant="destructive">
        Déconnexion
      </ActionItem>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Links and a button mixed in the same list.',
      },
    },
  },
};
