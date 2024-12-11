import { Meta, StoryObj } from '@storybook/react';

import { IconMail } from '../../modules/icons/components';
import { FormControl, FormControlProps, FormText } from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof FormControl> = {
  title: 'Forms/Form Control',
  component: FormControl,
  argTypes: {
    status: {
      options: ['valid', 'invalid'],
      control: { type: 'select' },
    },
  },
  args: {
    id: 'uuid',
    isOptional: false,
    isReadOnly: false,
    isRequired: false,
    status: undefined,
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `FormControl` component is a foundational form element that provides a consistent structure for form inputs. It includes support for labels, input fields, help text, and validation states. Key features include:\n\n- Built-in support for labels with optional icons\n- Validation states (valid/invalid)\n- Optional and required field handling\n- Read-only state support\n- Help text integration\n- Consistent styling and spacing',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormControl>;

export const Base: Story = {
  render: (args: FormControlProps) => {
    return (
      <FormControl {...args}>
        <FormControl.Label>Email</FormControl.Label>
        <FormControl.Input
          type="text"
          placeholder="Placeholder text"
          size="md"
        />
      </FormControl>
    );
  },
};

export const WithLabel: Story = {
  render: (args: FormControlProps) => {
    return (
      <FormControl id="email-X23">
        <FormControl.Label>Email</FormControl.Label>
        <FormControl.Input
          type="text"
          placeholder="Placeholder text"
          size="md"
        />
      </FormControl>
    );
  },
};

export const WithLabelAndIcon: Story = {
  render: (args: FormControlProps) => {
    return (
      <FormControl id="email-7">
        <FormControl.Label leftIcon={<IconMail />}>Email</FormControl.Label>
        <FormControl.Input
          type="text"
          placeholder="Placeholder text"
          size="md"
        />
      </FormControl>
    );
  },
};

export const WithInformativeMessage: Story = {
  render: (args: FormControlProps) => {
    return (
      <FormControl id="email" style={{ marginTop: '3px' }}>
        <FormControl.Label leftIcon={<IconMail />}>Email</FormControl.Label>
        <FormControl.Input
          type="text"
          placeholder="Placeholder text"
          size="md"
        />
        <FormText>Informative Message</FormText>
      </FormControl>
    );
  },
};

export const OptionalField: Story = {
  render: (args: FormControlProps) => {
    return (
      <FormControl id="email-0" isOptional>
        <FormControl.Label leftIcon={<IconMail />}>Email</FormControl.Label>
        <FormControl.Input
          type="text"
          placeholder="Placeholder text"
          size="md"
        />
      </FormControl>
    );
  },
};

export const OptionalFieldCustomText: Story = {
  render: (args: FormControlProps) => {
    return (
      <FormControl id="email-1" isOptional>
        <FormControl.Label leftIcon={<IconMail />} optionalText="Not mandatory">
          Email
        </FormControl.Label>
        <FormControl.Input
          type="text"
          placeholder="Placeholder text"
          size="md"
        />
      </FormControl>
    );
  },
};

export const RequiredField: Story = {
  render: (args: FormControlProps) => {
    return (
      <FormControl id="email-2" isRequired>
        <FormControl.Label leftIcon={<IconMail />}>Email</FormControl.Label>
        <FormControl.Input
          type="text"
          placeholder="Placeholder text"
          size="md"
        />
      </FormControl>
    );
  },
};

export const RequiredFieldCustomText: Story = {
  render: (args: FormControlProps) => {
    return (
      <FormControl id="email-3" isRequired>
        <FormControl.Label leftIcon={<IconMail />} requiredText="- Mandatory">
          Email
        </FormControl.Label>
        <FormControl.Input
          type="text"
          placeholder="Placeholder text"
          size="md"
        />
      </FormControl>
    );
  },
};

export const ReadOnlyStatus: Story = {
  render: (args: FormControlProps) => {
    return (
      <FormControl id="example-5" isReadOnly>
        <FormControl.Input
          type="text"
          size="md"
          placeholder={args.placeholder}
        />
      </FormControl>
    );
  },

  args: {
    placeholder: "This input is readonly and can't be modified.",
  },
};
