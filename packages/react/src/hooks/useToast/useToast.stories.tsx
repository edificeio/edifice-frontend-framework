import { Meta, StoryObj } from '@storybook/react';
import { Toaster } from 'react-hot-toast';
import Button from '../../components/Button/Button';
import useToast from './useToast';

const meta: Meta<typeof useToast> = {
  title: 'Hooks/useToast',
};

export default meta;
type Story = StoryObj<typeof useToast>;

export const Example: Story = {
  render: (args) => {
    const toast = useToast();

    const infoNotify = () => toast.info('This is an info message!');

    const warningNotify = () =>
      toast.warning(<h3>This is a warning message in a H3 tag</h3>);

    const sucessNotify = () => toast.success('This is a success message!');

    const errorNotify = () =>
      toast.error(<div>This is an error message in a DIV tag</div>);

    const dismissibleInfoNotify = () =>
      toast.info(
        `This is an info message with infinite duration and dismissible.`,
        {
          duration: Infinity,
          isDismissible: true,
        },
      );

    return (
      <>
        <Toaster />

        <div className="d-block p-24">
          <h2>Hot Toast 🍞</h2>
          <div className="d-flex gap-8 p-24">
            <Button color="tertiary" onClick={sucessNotify}>
              Sucess toast
            </Button>
            <Button color="danger" onClick={errorNotify}>
              Error toast
            </Button>
            <Button color="primary" onClick={infoNotify}>
              Info toast
            </Button>
            <Button color="secondary" onClick={warningNotify}>
              Warning toast
            </Button>
            <Button
              color="primary"
              variant="outline"
              onClick={dismissibleInfoNotify}
            >
              Dismissible toast
            </Button>
          </div>
        </div>
      </>
    );
  },
};
