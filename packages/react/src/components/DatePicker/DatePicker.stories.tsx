import { useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import DatePicker from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Forms/DatePicker',
  component: DatePicker,
  argTypes: {
    value: {
      control: { type: 'date' },
      description: 'Selected date value',
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
