import { Meta } from '@storybook/react';

import {
  IconAddUser,
  IconBlock,
  IconHourglass,
} from '../../../modules/icons/components';
import IconButton from '../IconButton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof IconButton> = {
  title: 'Components/Buttons/Icon Button',
  component: IconButton,
  argTypes: {
    color: {
      options: ['primary', 'secondary', 'tertiary', 'danger'],
      control: { type: 'select' },
    },
    variant: {
      options: ['filled', 'outline', 'ghost'],
      control: { type: 'select' },
    },
    type: {
      options: ['button', 'submit', 'reset'],
      control: { type: 'select' },
    },
  },
  args: {
    'aria-label': '',
    'color': 'primary',
    'variant': 'filled',
    'disabled': false,
  },
  parameters: {
    docs: {
      description: {
        component:
          'The IconButton component is a specialized button that displays only an icon without text. It inherits all the properties of the regular Button component including variants (filled, outline, ghost), colors (primary, secondary, tertiary, danger), and states (default, disabled, loading). IconButtons must include an aria-label for accessibility. They are ideal for interfaces where space is limited or when the icon alone clearly conveys the action.',
      },
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;

export const Base = {
  args: {
    'aria-label': 'Add User',
    'color': 'primary',
    'variant': 'filled',
    'type': 'button',
    'disabled': false,
    'icon': <IconAddUser />,
  },
};

export const IconWithAriaLabel = {
  args: {
    'aria-label': 'Add User',
    'color': 'primary',
    'variant': 'filled',
    'type': 'button',
    'disabled': false,
    'icon': <IconAddUser title="Add User" />,
  },

  parameters: {
    docs: {
      description: {
        story:
          'When using an Icon Button, please provide a text to the aria-label attribute with ariaLabel props to make it accessible.',
      },
    },
  },
};

export const LoadingIconButton = {
  args: {
    'aria-label': 'Loading',
    'color': 'primary',
    'variant': 'filled',
    'type': 'button',
    'isLoading': true,
  },

  parameters: {
    docs: {
      description: {
        story:
          'When loading, please provide a text to the aria-label attribute to make it accessible.',
      },
    },
  },
};

export const LoadingIconButtonWithCustomIcon = {
  args: {
    'aria-label': 'Loading',
    'color': 'primary',
    'variant': 'filled',
    'type': 'button',
    'isLoading': true,
    'loadingIcon': <IconHourglass title="Loading" />,
  },

  parameters: {
    docs: {
      description: {
        story:
          'You can override the default loading icon with a custom one using `loadingIcon` props.',
      },
    },
  },
};

export const DisabledIconButton = {
  args: {
    'aria-label': 'Add User',
    'color': 'primary',
    'variant': 'filled',
    'type': 'button',
    'disabled': true,
    'icon': <IconBlock title="Add User" />,
  },
};
