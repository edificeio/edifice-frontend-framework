import { Meta, StoryObj } from '@storybook/react-vite';
import Qwant from './Qwant';

const meta: Meta<typeof Qwant> = {
  title: 'Modules/Homepage/Qwant',
  component: Qwant,
  decorators: [
    (Story) => (
      <div style={{ height: '35em' }}>
        <div id="portal" />
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Qwant',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Qwant>;

function openQwant() {
  window.open('https://www.qwant.com', '_blank', 'noopener,noreferrer');
}

const renderWithProps = (props: { handleActionClick: () => void }) => () => (
  <div style={{ maxWidth: 397 }}>
    <Qwant {...props} />
  </div>
);

export const QwantStory: Story = {
  render: renderWithProps({ handleActionClick: openQwant }),
};
