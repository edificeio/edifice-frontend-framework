import { useEffect, useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import Checkbox from './Checkbox';
import React from 'react';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Checkbox> = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  args: {
    label: "Activer l'option",
    disabled: false,
    checked: true,
    indeterminate: false,
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Base: Story = {
  render: (args) => {
    const [isChecked, setIsChecked] = useState(args.checked);

    useEffect(() => {
      setIsChecked(args.checked);
    }, [args.checked]);

    return (
      <Checkbox
        disabled={args.disabled}
        checked={isChecked}
        label={args.label}
        indeterminate={args.indeterminate}
        onChange={() => setIsChecked((isChecked) => !isChecked)}
      />
    );
  },
};

export const Disabled: Story = {
  render: (args) => {
    const [isChecked, setIsChecked] = useState(true);

    return (
      <div className="d-flex align-items-center">
        <Checkbox
          checked={isChecked}
          disabled={true}
          label="Impossible de me désactiver"
          onChange={() => setIsChecked((isChecked) => !isChecked)}
        />
      </div>
    );
  },
};

export const Indeterminate: Story = {
  render: (args) => {
    const [isChecked, setIsChecked] = useState(false);
    const [isIndeterminate, setIsIndeterminate] = useState(true);

    const handleOnChange = () => {
      setIsChecked((isChecked) => {
        setIsIndeterminate(isChecked);
        return !isChecked && !isIndeterminate;
      });
    };

    const label = () => {
      if (isIndeterminate) {
        return 'Ni décoché, ni coché';
      } else {
        return isChecked ? 'Coché' : 'Décoché';
      }
    };

    return (
      <div className="d-flex align-items-center">
        <Checkbox
          checked={isChecked}
          indeterminate={isIndeterminate}
          label={label()}
          onChange={handleOnChange}
        />
      </div>
    );
  },
};
