import { useState } from 'react';

import { Meta, StoryObj } from '@storybook/react-vite';

import DatePicker from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Forms/DatePicker',
  component: DatePicker,
  argTypes: {
    value: {
      control: { type: 'date' },
      description: 'Selected date value',
    },
    disabled: {
      control: { type: 'boolean' },
      description:
        'Disables the input and prevents the calendar popup from opening',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'DatePicker component for selecting a date. Simple interface with value and onChange props. The component provides a clean way to select dates.',
      },
    },
  },
} as Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof DatePicker>;

const today = new Date();
export const Default: Story = {
  args: {
    value: new Date(),
    dateFormat: 'DD / MM / YYYY',
    minDate: undefined,
    maxDate: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 3,
    ),
    disabled: false,
    onChange: (date) => {
      console.log('Selected date:', date);
    },
  },
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(args.value);
    return (
      <DatePicker
        maxDate={args.maxDate}
        minDate={args.minDate}
        value={date}
        disabled={args.disabled}
        data-testid="date-picker-default"
        dateFormat={args.dateFormat}
        onChange={(newDate) => {
          if (!newDate) return;
          setDate(newDate);
          args.onChange?.(newDate);
        }}
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    value: new Date(),
    dateFormat: 'DD / MM / YYYY',
    disabled: true,
  },
  render: (args) => (
    <DatePicker
      value={args.value}
      disabled={args.disabled}
      dateFormat={args.dateFormat}
      data-testid="date-picker-disabled"
    />
  ),
};
