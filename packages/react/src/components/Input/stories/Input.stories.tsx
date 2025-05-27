import { Meta, StoryObj } from '@storybook/react';
import { Ref, useEffect, useRef } from 'react';
import { Button } from '../../Button';

import { FormControl, FormText } from '../../Form/index';
import { Label } from '../../Label';
import Input, { InputProps } from '../Input';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    type: {
      options: [
        'button',
        'checkbox',
        'color',
        'date',
        'datetime-local',
        'email',
        'file',
        'hidden',
        'image',
        'month',
        'number',
        'password',
        'radio',
        'range',
        'reset',
        'search',
        'submit',
        'tel',
        'text',
        'time',
        'url',
        'week',
      ],
      control: { type: 'select' },
    },
  },
  args: {
    disabled: false,
    size: 'md',
    type: 'text',
    placeholder: 'Text Placeholder',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Input` component is a foundational form element that allows users to enter and edit text or other data. It supports various input types (text, email, password, etc.), sizes, and states like disabled or readonly. The component can be combined with other form elements like labels and help text to create complete form controls.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

const Template = (args: InputProps) => {
  return (
    <FormControl id="example">
      <Input {...args} />
    </FormControl>
  );
};

export const Base: Story = {
  render: Template,

  args: {
    type: 'text',
    size: 'md',
    placeholder: 'Edifice',
  },
};

export const Small: Story = {
  render: Template,

  args: {
    size: 'sm',
    type: 'text',
    placeholder: 'Edifice',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Used when the information to fill is within a block, for exemple on a calendar component to set the date interval.',
      },
    },
  },
};

export const Medium: Story = {
  render: Template,

  args: {
    type: 'text',
    size: 'md',
    placeholder: 'Edifice',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Used when there are many information to fill on a page. We use the medium size to gain space on the page.',
      },
    },
  },
};

export const Large: Story = {
  render: Template,

  args: {
    size: 'lg',
    type: 'text',
    placeholder: 'Edifice',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Used when the information to fill is within a block, for exemple on a calendar component to set the date interval.',
      },
    },
  },
};

export const InputWithValue: Story = {
  render: (args) => {
    const inputRef: Ref<HTMLInputElement> = useRef(null);

    useEffect(() => {
      // Can be a type guard
      if (inputRef.current != null) {
        inputRef.current.value = 'This input has a value.';
      }
    }, []);

    return (
      <FormControl id="example-2">
        <Input
          ref={inputRef}
          type={args.type}
          placeholder={args.placeholder}
          size={args.size}
        />
      </FormControl>
    );
  },

  parameters: {
    docs: {
      description: {
        story: 'When Input has a value, `border-color` changes.',
      },
    },
  },
};

export const InputFocused: Story = {
  render: (args) => {
    const inputRef: Ref<HTMLInputElement> = useRef(null);

    const handleFocus = () => {
      inputRef.current?.focus();
    };

    return (
      <FormControl id="example-3" className="d-flex gap-8">
        <Input
          ref={inputRef}
          type={args.type}
          placeholder={args.placeholder}
          size={args.size}
        />
        <Button
          type="button"
          color="primary"
          variant="filled"
          onClick={handleFocus}
        >
          Focus
        </Button>
      </FormControl>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          'When Input is focused, `border-color` changes depending on the theme.',
      },
    },
  },
};

export const ValidStatus: Story = {
  render: (args) => {
    return (
      <FormControl id="example-4" status="valid">
        <Input
          type={args.type}
          placeholder={args.placeholder}
          size={args.size}
        />
      </FormControl>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          "If input is valid (if condition met is true), we pass `status='valid'` through FormControl Component",
      },
    },
  },
};

export const ValidStatusWithMessage: Story = {
  render: (args) => {
    return (
      <FormControl id="example-4" status="valid">
        <Input
          type={args.type}
          placeholder={args.placeholder}
          size={args.size}
        />
        <FormText>Informative message</FormText>
      </FormControl>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          "By passing `status='valid'` through FormControl Component, informative message will go green too :)",
      },
    },
  },
};

export const InvalidStatus: Story = {
  render: (args) => {
    return (
      <FormControl id="example-4" status="invalid">
        <Input
          type={args.type}
          placeholder={args.placeholder}
          size={args.size}
        />
      </FormControl>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          "If input is invalid (if condition met is false), we pass `status='invalid'` through FormControl Component",
      },
    },
  },
};

export const InvalidStatusWithMessage: Story = {
  render: (args) => {
    return (
      <FormControl id="example-4" status="invalid">
        <Label>Label Text</Label>
        <Input
          type={args.type}
          placeholder={args.placeholder}
          size={args.size}
        />
        <FormText>Informative message</FormText>
      </FormControl>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          "By passing `status='invalid'` through FormControl Component, informative message will go red too :(",
      },
    },
  },
};

export const StatusWithoutIcon: Story = {
  render: (args) => {
    return (
      <FormControl id="example-4" status="valid">
        <Input
          type={args.type}
          placeholder={args.placeholder}
          size={args.size}
          noValidationIcon
        />
      </FormControl>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          'You can add the `noValidationIcon` props to the Input Component to remove validation icon',
      },
    },
  },
};

export const DisabledStatus: Story = {
  render: Template,

  args: {
    disabled: true,
    size: 'md',
    type: 'text',
    placeholder: 'Edifice',
  },
};

export const CharacterCount: Story = {
  render: Template,

  args: {
    size: 'md',
    type: 'text',
    placeholder: 'Enter text',
    showCounter: true,
    maxLength: 100,
  },

  parameters: {
    docs: {
      description: {
        story:
          'The Input component can display a character count when `showCounter` is enabled. Use `maxLength` to set the maximum number of characters allowed.',
      },
    },
  },
};
