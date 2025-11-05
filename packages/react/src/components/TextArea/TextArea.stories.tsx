import { StoryObj } from '@storybook/react';

import { Ref, useEffect, useRef } from 'react';
import { Button } from '../Button';
import FormControl from '../Form/FormControl';
import FormText from '../Form/FormText';
import TextArea, { TextAreaProps } from './TextArea';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Forms/TextArea',
  component: TextArea,
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
  },
  args: {
    disabled: false,
    size: 'md',
    placeholder: 'Text Placeholder',
  },
  parameters: {
    docs: {
      description: {
        component:
          'TextArea component allows users to input multi-line text. It supports different sizes, placeholder text, and can be disabled. It also integrates with form controls for validation and other functionalities.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextArea>;

const Template = (args: TextAreaProps) => {
  return (
    <FormControl id="example">
      <TextArea {...args} />
    </FormControl>
  );
};

export const Base: Story = {
  render: Template,

  args: {
    size: 'md',
    placeholder: 'Edifice',
  },
};

export const Small: Story = {
  render: Template,

  args: {
    size: 'sm',
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

export const TextAreaWithValue: Story = {
  render: (args) => {
    const textAreaRef: Ref<HTMLTextAreaElement> = useRef(null);

    useEffect(() => {
      // Can be a type guard
      if (textAreaRef.current != null) {
        textAreaRef.current.value = 'This textArea has a value.';
      }
    }, []);

    return (
      <FormControl id="example-2">
        <TextArea
          ref={textAreaRef}
          placeholder={args.placeholder}
          size={args.size}
        />
      </FormControl>
    );
  },

  parameters: {
    docs: {
      description: {
        story: 'When TextArea has a value, `border-color` changes.',
      },
    },
  },
};

export const TextAreaFocused: Story = {
  render: (args) => {
    const textAreaRef: Ref<HTMLTextAreaElement> = useRef(null);

    const handleFocus = () => {
      textAreaRef.current?.focus();
    };

    return (
      <FormControl id="example-3" className="d-flex align-items-start gap-8">
        <TextArea
          ref={textAreaRef}
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
          'When TextArea is focused, `border-color` changes depending on the theme.',
      },
    },
  },
};

export const ValidStatus: Story = {
  render: (args) => {
    return (
      <FormControl id="example-4" status="valid">
        <TextArea placeholder={args.placeholder} size={args.size} />
      </FormControl>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          "If textArea is valid (if condition met is true), we pass `status='valid'` through FormControl Component",
      },
    },
  },
};

export const ValidStatusWithMessage: Story = {
  render: (args) => {
    return (
      <FormControl id="example-4" status="valid">
        <TextArea placeholder={args.placeholder} size={args.size} />
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
        <TextArea placeholder={args.placeholder} size={args.size} />
      </FormControl>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          "If textarea is invalid (if condition met is false), we pass `status='invalid'` through FormControl Component",
      },
    },
  },
};

export const InvalidStatusWithMessage: Story = {
  render: (args) => {
    return (
      <FormControl id="example-4" status="invalid">
        <TextArea placeholder={args.placeholder} size={args.size} />
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
        <TextArea
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
          'You can add the `noValidationIcon` props to the TextArea Component to remove validation icon',
      },
    },
  },
};

export const DisabledStatus: Story = {
  render: Template,

  args: {
    disabled: true,
    size: 'md',
    placeholder: 'Edifice',
  },
};

export const CharacterCount: Story = {
  render: Template,

  args: {
    size: 'md',
    placeholder: 'Enter text',
    showCounter: true,
    maxLength: 100,
  },

  parameters: {
    docs: {
      description: {
        story:
          'The TextArea component can display a character count when `showCounter` is enabled. Use `maxLength` to set the maximum number of characters allowed.',
      },
    },
  },
};
