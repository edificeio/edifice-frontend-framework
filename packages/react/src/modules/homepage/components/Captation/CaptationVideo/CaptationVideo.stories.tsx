import { Meta, StoryObj } from '@storybook/react-vite';

import ButtonBeta from '../../../../../components/ButtonBeta/ButtonBeta';
import useToggle from '../../../../../hooks/useToggle/useToggle';
import { CaptationVideo } from './CaptationVideo';

const meta: Meta<typeof CaptationVideo> = {
  title: 'Modules/Homepage/Captation/CaptationVideo',
  component: CaptationVideo,
  decorators: [(Story) => <div style={{ height: '35em' }}>{Story()}</div>],
  parameters: {
    docs: {
      description: {
        component: 'Captation video',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CaptationVideo>;

export const Default: Story = {
  render: () => {
    const [isOpen, toggle] = useToggle(false);

    return (
      <>
        <ButtonBeta type="button" onClick={() => toggle(true)}>
          Open captation video
        </ButtonBeta>
        {isOpen && (
          <CaptationVideo isOpen={isOpen} onClose={() => toggle(false)} />
        )}
      </>
    );
  },
};

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
  parameters: {
    docs: { disable: true },
  },
};
