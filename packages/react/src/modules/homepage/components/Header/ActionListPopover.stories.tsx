import { Meta, StoryObj } from '@storybook/react-vite';

import hillsBackground from '@edifice.io/bootstrap/dist/images/backgrounds/hills.svg';
import { ActionListPopover } from './ActionListPopover';

const meta: Meta<typeof ActionListPopover> = {
  title: 'Modules/Homepage/Header/ActionListPopover',
  component: ActionListPopover,
  parameters: {
    docs: {
      description: {
        component:
          'Header v2 account menu: a white popover listing the customize and logout `ActionItem`s. `ActionItem` is context-free (no Dropdown dependency) and is meant to be reused by the Dropdown redesign (ENABLING-882).',
      },
    },
  },
  args: {
    id: 'action-list-popover',
    isVisible: true,
    align: 'center',
  },
  decorators: [
    (Story) => (
      <div
        className="header-beta"
        style={{
          minHeight: 300,
          padding: '2rem',
          backgroundImage: `url(${hillsBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="navbar-nav d-flex justify-content-center">
          <div className="position-relative">
            <span className="btn btn-primary">Trigger</span>
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ActionListPopover>;

export const Base: Story = {};
