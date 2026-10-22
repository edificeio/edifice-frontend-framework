import { Meta, StoryObj } from '@storybook/react-vite';

import ButtonBeta from '../../../../../components/ButtonBeta/ButtonBeta';
import useToggle from '../../../../../hooks/useToggle/useToggle';
import { CaptationAudio } from './CaptationAudio';

const meta: Meta<typeof CaptationAudio> = {
  title: 'Modules/Homepage/Captation/CaptationAudio',
  component: CaptationAudio,
  decorators: [(Story) => <div style={{ height: '35em' }}>{Story()}</div>],
  parameters: {
    docs: {
      description: {
        component: 'Captation audio',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CaptationAudio>;

export const Default: Story = {
  render: () => {
    const [isOpen, toggle] = useToggle(false);

    return (
      <>
        <ButtonBeta type="button" onClick={() => toggle(true)}>
          Open captation audio
        </ButtonBeta>
        {isOpen && (
          <CaptationAudio isOpen={isOpen} onClose={() => toggle(false)} />
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
