import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import Qwant, { QwantProps } from './Qwant';

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

const renderWithProps = (props: QwantProps) => () => (
  <div style={{ maxWidth: 397 }}>
    <Qwant {...props} />
  </div>
);

export const QwantStory: Story = {
  render: renderWithProps({
    handleActionClick: openQwant,
    handleSearch: fn(),
  }),
};

const loadedProps: QwantProps = {
  handleActionClick: openQwant,
  handleSearch: fn(),
};

export const Skeleton: Story = {
  render: () => (
    <div style={{ maxWidth: 397 }}>
      <Qwant {...loadedProps} isLoading />
    </div>
  ),
};

export const SkeletonAboveTheLoadedCard: Story = {
  render: () => (
    <div className="skeleton-overlay-stack" style={{ maxWidth: 397 }}>
      <Qwant {...loadedProps} isLoading />
      <Qwant {...loadedProps} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The skeleton card shown while the widget loads, stacked on top of the loaded card. Its content block is sized to this loaded card, so any difference in height is the layout shift the user would see.',
      },
    },
  },
};

export const SkeletonSuperimposedOnTheLoadedCard: Story = {
  render: () => (
    <div className="skeleton-overlay" style={{ maxWidth: 397 }}>
      <Qwant {...loadedProps} />
      <div className="skeleton-overlay-top">
        <Qwant {...loadedProps} isLoading />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The skeleton card superimposed on the loaded card, at partial opacity. The header and the content block should cover the loaded header and content exactly.',
      },
    },
  },
};
