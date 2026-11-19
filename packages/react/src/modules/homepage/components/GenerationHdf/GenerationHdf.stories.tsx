import { Meta, StoryObj } from '@storybook/react-vite';
import { FormEvent, useState } from 'react';
import GenerationHdf, {
  GenerationHdfProps,
  GenerationHdfStatus,
  GenerationHdfWallet,
} from './GenerationHdf';

const meta: Meta<typeof GenerationHdf> = {
  title: 'Modules/Homepage/GenerationHdf',
  component: GenerationHdf,
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
        component: 'Génération HDF',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GenerationHdf>;

const MOCK_WALLETS: GenerationHdfWallet[] = [
  { label: 'Manuels et équipements', amount: '100,00 €' },
  { label: 'Manuels et équipements', amount: '100,00 €' },
];

interface GenerationHdfDemoProps {
  initialStatus: GenerationHdfStatus;
  initialCardNumber?: string;
  initialWallets?: GenerationHdfWallet[];
}

function GenerationHdfDemo({
  initialStatus,
  initialCardNumber = '',
  initialWallets = [],
}: GenerationHdfDemoProps) {
  const [status, setStatus] = useState<GenerationHdfStatus>(initialStatus);
  const [cardNumber, setCardNumber] = useState(initialCardNumber);
  const [wallets, setWallets] = useState(initialWallets);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setWallets(MOCK_WALLETS);
      setStatus('account');
    }, 600);
  };

  const handleEdit = () => {
    setCardNumber('');
    setWallets([]);
    setStatus('idle');
  };

  return (
    <div style={{ maxWidth: 397 }}>
      <GenerationHdf
        handleActionClick={() =>
          window.open(
            'https://generation.hautsdefrance.fr',
            '_blank',
            'noopener,noreferrer',
          )
        }
        status={status}
        cardNumber={cardNumber}
        onCardNumberChange={setCardNumber}
        onSubmit={handleSubmit}
        onEdit={handleEdit}
        wallets={wallets}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <GenerationHdfDemo initialStatus="idle" />,
};

export const Loading: Story = {
  render: () => (
    <GenerationHdfDemo initialStatus="loading" initialCardNumber="475948" />
  ),
};

export const Erreur: Story = {
  render: () => (
    <GenerationHdfDemo initialStatus="error" initialCardNumber="475948" />
  ),
};

export const Compte: Story = {
  render: () => (
    <GenerationHdfDemo
      initialStatus="account"
      initialCardNumber="475948"
      initialWallets={MOCK_WALLETS}
    />
  ),
};

const loadedProps: GenerationHdfProps = {
  handleActionClick: () => {},
  status: 'idle',
  cardNumber: '',
  onCardNumberChange: () => {},
  onSubmit: () => {},
  onEdit: () => {},
  wallets: [],
};

export const Skeleton: Story = {
  render: () => (
    <div style={{ maxWidth: 397 }}>
      <GenerationHdf {...loadedProps} isLoading />
    </div>
  ),
};

export const SkeletonAboveTheLoadedCard: Story = {
  render: () => (
    <div className="skeleton-overlay-stack" style={{ maxWidth: 397 }}>
      <GenerationHdf {...loadedProps} isLoading />
      <GenerationHdf {...loadedProps} />
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
      <GenerationHdf {...loadedProps} />
      <div className="skeleton-overlay-top">
        <GenerationHdf {...loadedProps} isLoading />
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
