import { Meta, StoryObj } from '@storybook/react-vite';
import Mediacentre, { MediacentreProps } from './Mediacentre';
import { MediacentreResource } from './types';

const meta: Meta<typeof Mediacentre> = {
  title: 'Modules/Homepage/Mediacentre',
  component: Mediacentre,
  parameters: {
    docs: {
      description: {
        component:
          "Médiacentre widget: the user's favorite resources and the Universalis search.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Mediacentre>;

const mockResources: MediacentreResource[] = [
  {
    id: '1',
    title: 'Hyperbole | Mathématiques 3e',
    subtitle: 'Éditions Nathan',
    href: 'https://example.com/hyperbole',
  },
  {
    id: '2',
    title: 'Magellan Histoire-Géographie',
    subtitle: 'Éditions Hatier',
    href: 'https://example.com/magellan',
  },
  {
    id: '3',
    title: 'Dictionnaire de Physique et de Chimie',
    subtitle: 'Éditions Nathan',
    href: 'https://example.com/dictionnaire',
  },
];

const renderWithProps = (props: Partial<MediacentreProps>) => () => (
  <div style={{ maxWidth: 402 }}>
    <Mediacentre handleActionClick={() => {}} resources={[]} {...props} />
  </div>
);

export const Default: Story = {
  render: renderWithProps({
    resources: mockResources,
    uai: '0012345A',
  }),
};

export const UniversalisWithoutUai: Story = {
  render: renderWithProps({ resources: mockResources }),
};

export const Loading: Story = {
  render: renderWithProps({ isLoading: true }),
};

export const Empty: Story = {
  render: renderWithProps({ uai: '0012345A' }),
};

export const Error: Story = {
  render: renderWithProps({ isError: true }),
};

const loadedProps: MediacentreProps = {
  handleActionClick: () => {},
  resources: mockResources,
  uai: '0012345A',
};

export const SkeletonAboveTheLoadedCard: Story = {
  render: () => (
    <div className="skeleton-overlay-stack" style={{ maxWidth: 402 }}>
      <Mediacentre {...loadedProps} isLoading />
      <Mediacentre {...loadedProps} />
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
    <div className="skeleton-overlay" style={{ maxWidth: 402 }}>
      <Mediacentre {...loadedProps} />
      <div className="skeleton-overlay-top">
        <Mediacentre {...loadedProps} isLoading />
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
