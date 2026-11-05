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
