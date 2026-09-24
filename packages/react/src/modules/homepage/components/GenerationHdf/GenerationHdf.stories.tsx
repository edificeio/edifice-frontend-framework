import { Meta, StoryObj } from '@storybook/react-vite';
import { FormEvent, useState } from 'react';
import GenerationHdf, {
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

  const handleClear = () => {
    setCardNumber('');
    setStatus('idle');
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
        onClear={handleClear}
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
