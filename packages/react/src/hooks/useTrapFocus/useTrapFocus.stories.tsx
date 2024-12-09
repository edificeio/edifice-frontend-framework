import { Meta, StoryObj } from '@storybook/react';
import Button from '../../components/Button/Button';
import FormControl from '../../components/Form/FormControl';
import { Input } from '../../components/Input';
import { Label } from '../../components/Label';
import { IconLock, IconMail } from '../../modules/icons/components';
import useTrapFocus from './useTrapFocus';

const meta: Meta<typeof useTrapFocus> = {
  title: 'Hooks/useTrapFocus',
};

export default meta;
type Story = StoryObj<typeof useTrapFocus>;

export const Base: Story = {
  render: (args) => {
    const ref = useTrapFocus();

    return (
      <div ref={ref} className="border rounded-4 m-64 py-12 px-8">
        <h2 className="p-12">Trap Focus!</h2>
        <p className="p-12">
          Press Tab or Shift+Tab to cycle through elements focus
        </p>

        <FormControl id="email" isRequired className="p-12">
          <Label leftIcon={<IconMail />} requiredText="- Mandatory">
            Email
          </Label>
          <Input
            type="text"
            placeholder="Enter your email..."
            size="md"
            autoFocus
          />
        </FormControl>

        <FormControl id="password" isRequired className="p-12">
          <Label leftIcon={<IconLock />} requiredText="- Mandatory">
            Password
          </Label>
          <Input type="text" placeholder="Enter your password..." size="md" />
        </FormControl>

        <div className="d-flex align-items-center justify-content-end">
          <Button type="button" color="tertiary" variant="ghost">
            Cancel
          </Button>

          <Button type="button" color="primary" variant="filled">
            Submit
          </Button>
        </div>
      </div>
    );
  },
};
