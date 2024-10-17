import { useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { Applications, ViewList } from '../../../../icons/dist';
import Radio, { RadioProps } from './Radio';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Radio> = {
  title: 'Forms/Radio',
  component: Radio,
  args: {
    label: '',
    value: '',
    model: '',
    onChange: () => {},
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Base: Story = {
  render: (args: RadioProps) => {
    const [value, setValue] = useState<string>('CP');

    const handleChange = ({
      target: { value },
    }: React.ChangeEvent<HTMLInputElement>) => {
      setValue(value);
    };

    const options = [
      {
        label: 'Classe préparatoire',
        value: 'CP',
      },
      {
        label: 'Cours élémentaire 1',
        value: 'CM1',
      },
      {
        label: 'Cours élémentaire 2',
        value: 'CM2',
      },
    ];

    return (
      <div>
        <div className="align-items-center">
          {options.map((option, index) => (
            <Radio
              key={index}
              label={option.label}
              value={option.value}
              model={value}
              onChange={handleChange}
            />
          ))}
        </div>
        <div>Option séléctionnée : {value}</div>
      </div>
    );
  },
};

export const RadioWithIcons: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>('list');

    const options = [
      {
        icon: <ViewList />,
        value: 'list',
      },
      {
        icon: <Applications />,
        value: 'grid',
      },
    ];

    return (
      <div>
        <div className="d-flex gap-16 align-items-center">
          {options.map((option, index) => (
            <Radio
              key={index}
              icon={option.icon}
              value={option.value}
              model={value}
              onChange={(e) => setValue(e.target.value)}
            />
          ))}
        </div>
        <div>Type de vue : {value && value}</div>
      </div>
    );
  },
};
