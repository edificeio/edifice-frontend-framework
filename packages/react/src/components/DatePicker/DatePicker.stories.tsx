import { useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import DatePicker from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Forms/DatePicker',
  component: DatePicker,
  argTypes: {
    dateFormat: {
      description: 'Date format to display in the picker',
      control: {
        type: 'select',
      },
      options: [
        'YYYY-MM-DD',
        'DD/MM/YYYY',
        'MM/DD/YYYY',
        'DD-MM-YYYY',
        'MM-DD-YYYY',
        'YYYY/MM/DD',
        'DD MMM YYYY',
        'DD MMMM YYYY',
        'MMM DD, YYYY',
        'MMMM DD, YYYY',
      ],
      table: {
        type: { summary: 'string' },
        category: 'Props',
        defaultValue: { summary: 'undefined' },
      },
    },
    value: {
      description:
        'The currently selected date (Dayjs object). Use this for controlled components.',
      control: { type: 'date' },
      table: {
        type: { summary: 'Dayjs | null' },
        category: 'Props',
      },
    },
    onChange: {
      description:
        'Callback function called when the date changes. Receives the new date (Dayjs | null) as parameter.',
      action: 'changed',
      table: {
        type: {
          summary: '(date: Dayjs | null) => void',
        },
        category: 'Props',
      },
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

export const Default: Story = {
  args: {
    dateFormat: 'MMMM DD, YYYY',
  },
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(args.value);
    return (
      <DatePicker
        {...args}
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
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls below to modify the component properties and see how they affect the DatePicker. You can change the selected date and see the onChange callback in the Actions panel.',
      },
    },
  },
};
