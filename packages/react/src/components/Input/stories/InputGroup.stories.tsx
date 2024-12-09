import { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import Button from '../../Button/Button';

import { IconSearch } from '../../../modules/icons/components';
import { Checkbox } from '../../Checkbox';
import { Indeterminate } from '../../Checkbox/Checkbox.stories';
import { FormControl } from '../../Form';
import { Radio } from '../../Radio';
import Input from '../Input';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof FormControl> = {
  title: 'Forms/Input Group',
  component: FormControl,
  parameters: {
    docs: {
      description: {
        component:
          'The `Input Group` component allows you to add text, icons, or buttons directly adjacent to input fields. This creates cohesive form controls for common patterns like URL inputs with prefixes, search bars with icons, or inputs with action buttons. Features include:\n\n- Prefix and suffix text or elements\n- Border styling options including borderless variants\n- Support for icons and buttons\n- Consistent sizing and spacing\n- Disabled states',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormControl>;

const Template = (args: any) => (
  <FormControl id={args.id} status={args.status} className="input-group">
    <span className="input-group-text">http://edifice.example.test/</span>
    <FormControl.Input type="text" placeholder="Url path" size="md" />
    <Button type="submit" aria-label="search">
      Create this url
    </Button>
  </FormControl>
);

export const Base: Story = {
  render: Template,
};

export const BorderlessInputGroup: Story = {
  render: (args) => (
    <FormControl id={args.id} status={args.status} className="input-group">
      <span className="input-group-text border-end-0">
        <IconSearch width={20} height={20} />
      </span>
      <FormControl.Input
        type="text"
        className="border-start-0"
        placeholder="Search terms"
        size="lg"
      />
    </FormControl>
  ),
};

export const BorderlessDisabledInputGroup: Story = {
  render: (args) => (
    <FormControl id={args.id} status={args.status} className="input-group">
      <span className="input-group-text border-end-0">
        <IconSearch width={20} height={20} />
      </span>
      <FormControl.Input
        disabled
        type="text"
        className="border-start-0"
        placeholder="Search terms"
        size="lg"
      />
    </FormControl>
  ),
};

export const MultiInputGroup: Story = {
  render: (args) => {
    const [username, setUsername] = useState<string>('');
    const [server, setServer] = useState<string>('');
    const serverUrl = useMemo(
      () => username + '@' + server,
      [username, server],
    );
    return (
      <div>
        <FormControl id="connect-url" className="input-group">
          <Input
            type="text"
            placeholder="Username"
            size="lg"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <span className="input-group-text">@</span>
          <Input
            type="text"
            placeholder="Server"
            size="lg"
            value={server}
            onChange={(event) => setServer(event.target.value)}
          />
          <Button type="submit" aria-label="search">
            Generate
          </Button>
        </FormControl>
        {
          <div className="py-8">
            Your url is {serverUrl !== '@' && serverUrl}
          </div>
        }
      </div>
    );
  },
};

export const CheckboxRadio: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>('CM1');
    return (
      <div>
        <FormControl id="addline" className="input-group mb-12">
          <div className="input-group-text">
            <Checkbox {...Indeterminate.args} />
          </div>
          <Input type="text" placeholder="Add this line" size="lg" />
        </FormControl>
        <FormControl id="slectLine" className="input-group mb-12">
          <div className="input-group-text">
            <Radio
              value="CP"
              model={value}
              name="class"
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <Input type="text" placeholder="Select this line" size="lg" />
        </FormControl>
        <FormControl id="slectLine" className="input-group">
          <div className="input-group-text">
            <Radio
              value="CE1"
              model={value}
              name="class"
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <Input type="text" placeholder="Select this line" size="lg" />
        </FormControl>
      </div>
    );
  },
};
