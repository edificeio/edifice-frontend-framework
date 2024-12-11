import { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import ActionBar, { ActionBarProps } from './ActionBar';

const meta: Meta<typeof ActionBar> = {
  title: 'Components/ActionBar',
  component: ActionBar,
  parameters: {
    docs: {
      description: {
        component:
          'ActionBar is a component that displays an action bar containing buttons. It is typically used at the bottom of a page.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ActionBar>;

export const Base: Story = {
  render: (args: ActionBarProps) => <ActionBar {...args} />,
  args: {
    children: (
      <>
        <Button type="button" variant="filled" color="primary">
          Créer
        </Button>
        <Button type="button" variant="filled" color="primary">
          Modifier
        </Button>
        <Button type="button" variant="filled" color="primary">
          Publier
        </Button>
      </>
    ),
  },
};
