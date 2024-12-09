import { Meta, StoryObj } from '@storybook/react';
import SearchBar, { SearchBarProps } from './SearchBar';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof SearchBar> = {
  title: 'Forms/SearchBar',
  component: SearchBar,
  parameters: {
    docs: {
      description: {
        component:
          'SearchBar component for creating search input fields with optional search button. Supports dynamic searching, different sizes, and disabled states. Can be used as a standalone search input or with an integrated search button for form submissions.',
      },
    },
  },
  argTypes: {
    size: {
      options: ['md', 'lg'],
      control: { type: 'select' },
    },
    isVariant: {
      control: 'boolean',
    },
  },
  args: {
    isVariant: false,
    onClick: () => {},
    onChange: () => {},
    size: 'md',
    placeholder: 'Search something....',
  },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

const Template = (args: SearchBarProps) => <SearchBar {...args} />;

export const Base: Story = {
  render: Template,
};

export const DynamicSearch: Story = {
  render: Template,
  args: {
    isVariant: true,
    onClick: undefined,
  },
};

export const DisabledDynamicSearch: Story = {
  render: Template,
  args: {
    isVariant: true,
    disabled: true,
    onClick: undefined,
  },
};
