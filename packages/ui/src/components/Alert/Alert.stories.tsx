import { useCallback, useRef, useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import Alert, { AlertRef } from './Alert';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    docs: {
      description: {
        component:
          'Alert Component is contextual and used on the interface to guide users. Alert Component can be accompanied by a button to refer users to additional information available. The colors used in the Component come from the support palette.',
      },
    },
  },
  decorators: [(Story) => <div style={{ height: '400px' }}>{Story()}</div>],
  argTypes: {
    type: {
      options: ['success', 'warning', 'info', 'danger'],
      control: { type: 'select' },
    },
    isDismissible: {
      control: { type: 'boolean' },
    },
    onClose: {
      control: {
        type: null,
      },
    },
    onVisibilityChange: {
      control: {
        type: null,
      },
    },
  },
  args: {
    type: 'success',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;
type Story = StoryObj<typeof Alert>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args: any) => {
  const ref = useRef<AlertRef>(null);
  const [showButton, setShowButtonState] = useState(false);

  const onClick = useCallback(() => {
    if (ref.current) {
      ref.current.show();
    }
  }, [ref]);

  return (
    <div>
      {showButton && (
        <Button type="button" onClick={onClick}>
          Show Alert again
        </Button>
      )}
      <Alert
        {...args}
        ref={ref}
        onVisibilityChange={(state: boolean) => setShowButtonState(!state)}
      >
        {args.children}
      </Alert>
    </div>
  );
};

Template.displayName = 'Alert';

export const Base: Story = {
  render: (args) => <Template {...args} />,
  args: {
    type: 'success',
    children:
      'Labore veniam sem officiis quibusdam, error, iusto erat consequat rhoncus venenatis pretium felis fugit ullamcorper perspiciatis, magni perspiciatis!',
  },
};

export const Dissmissible: Story = {
  render: (args) => <Template {...args} />,

  args: {
    type: 'success',
    children:
      'Ornare senectus inceptos, laboriosam montes suscipit, tristique rhoncus, tristique irure itaque cum, tellus imperdiet ornare nostra nec curae cumque vitae, minus ridiculus? Auctor eget.',
    isDismissible: true,
  },
};

export const WithAction: Story = {
  render: (args) => <Template {...args} />,

  args: {
    type: 'success',
    button: (
      <Button type="button" variant="ghost" color="tertiary">
        Voir
      </Button>
    ),
    children:
      'Ornare senectus inceptos, laboriosam montes suscipit, tristique rhoncus, tristique irure itaque cum, tellus imperdiet ornare nostra nec curae cumque vitae, minus ridiculus? Auctor eget.',
    isDismissible: true,
  },
};

export const Warning: Story = {
  render: (args) => <Template {...args} />,

  args: {
    type: 'warning',
    children:
      'Ornare senectus inceptos, laboriosam montes suscipit, tristique rhoncus, tristique irure itaque cum, tellus imperdiet ornare nostra nec curae cumque vitae, minus ridiculus? Auctor eget.',
  },
};

export const Information: Story = {
  render: (args) => <Template {...args} />,

  args: {
    type: 'info',
    children:
      'Ornare senectus inceptos, laboriosam montes suscipit, tristique rhoncus, tristique irure itaque cum, tellus imperdiet ornare nostra nec curae cumque vitae, minus ridiculus? Auctor eget.',
  },
};

export const Error: Story = {
  render: (args) => <Template {...args} />,

  args: {
    type: 'danger',
    children:
      'Ornare senectus inceptos, laboriosam montes suscipit, tristique rhoncus, tristique irure itaque cum, tellus imperdiet ornare nostra nec curae cumque vitae, minus ridiculus? Auctor eget.',
  },
};

export const Confirm: Story = {
  render: (args) => <Template {...args} />,

  args: {
    type: 'info',
    isConfirm: true,
    position: 'bottom-right',
    button: (
      <Button type="button" variant="ghost" color="tertiary">
        Consulter
      </Button>
    ),
    children:
      'Parce que nous sommes soucieux de la protection de vos données personnelles, les cookies que nous utilisons collectent des informations anonymisées. Notre seule utilisation de ces cookies vise à améliorer votre expérience utilisateur. Vous pouvez consulter à tout moment ces cookies depuis la page « Mon compte » dans la section « Cookies ».',
  },
};
