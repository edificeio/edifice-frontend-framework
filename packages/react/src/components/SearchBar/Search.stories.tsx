import { Meta, StoryObj } from '@storybook/react';
import SearchBar, { SearchBarProps } from './SearchBar';
import { useState } from 'react';

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
    onClick: () => console.log('Search clicked'),
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

export const SearchValue: Story = {
  render: (args: SearchBarProps) => {
    const [value, setValue] = useState('Search value');
    return (
      <SearchBar
        {...args}
        value={value}
        onChange={(element) => setValue(element.target.value)}
      />
    );
  },
};

export const SearchDefaultValue: Story = {
  render: (args: SearchBarProps) => (
    <SearchBar
      {...args}
      onChange={(element) => console.log(element.target.value)}
    />
  ),
  args: {
    defaultValue: 'Search default value',
  },
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

export const DynamicSearchWithClear: Story = {
  render: (args) => {
    const [value, setValue] = useState('Edifice');
    return (
      <SearchBar
        {...args}
        value={value}
        clearable
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
  args: {
    isVariant: true,
  },
};
