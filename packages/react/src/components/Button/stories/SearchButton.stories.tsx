import { Meta, StoryObj } from '@storybook/react';

import { IconSearch, IconUserSearch } from '../../../modules/icons/components';
import SearchButton from '../SearchButton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof SearchButton> = {
  title: 'Components/Buttons/SearchButton',
  component: SearchButton,
  args: {
    'aria-label': 'search',
    'type': 'button',
    'disabled': false,
    'icon': <IconSearch />,
  },
  parameters: {
    docs: {
      description: {
        component:
          'The SearchButton component is a specialized IconButton designed specifically for search functionality. It displays a search icon by default but can be customized with different icons. The component inherits all the properties of IconButton including states (default, disabled) and maintains consistent styling. SearchButtons must include an aria-label for accessibility. They are commonly used in search interfaces, filters, and anywhere search functionality needs to be triggered.',
      },
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;
type Story = StoryObj<typeof SearchButton>;

export const Base: Story = {};

export const WithCustomIcon: Story = {
  args: {
    icon: <IconUserSearch />,
  },
};
