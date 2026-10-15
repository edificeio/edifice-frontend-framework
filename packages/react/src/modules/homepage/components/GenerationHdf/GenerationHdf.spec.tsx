import { render, screen } from '~/setup';
import GenerationHdf from './GenerationHdf';

describe('GenerationHdf', () => {
  it('calls handleActionClick when the open button is clicked', async () => {
    const handleActionClick = vi.fn();
    const { user } = render(
      <GenerationHdf
        handleActionClick={handleActionClick}
        status="idle"
        cardNumber=""
        onCardNumberChange={vi.fn()}
        onSubmit={vi.fn()}
        onEdit={vi.fn()}
        wallets={[]}
      />,
    );

    await user.click(screen.getByTestId('generation-hdf-button-open'));

    expect(handleActionClick).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when the form is submitted', () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <GenerationHdf
        handleActionClick={vi.fn()}
        status="idle"
        cardNumber="475948"
        onCardNumberChange={vi.fn()}
        onSubmit={onSubmit}
        onEdit={vi.fn()}
        wallets={[]}
      />,
    );

    screen
      .getByPlaceholderText('Numéro de carte')
      .closest('form')
      ?.requestSubmit();

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('does not show an error message outside of the error status', () => {
    render(
      <GenerationHdf
        handleActionClick={vi.fn()}
        status="idle"
        cardNumber=""
        onCardNumberChange={vi.fn()}
        onSubmit={vi.fn()}
        onEdit={vi.fn()}
        wallets={[]}
      />,
    );

    expect(
      screen.queryByText('Numéro de carte incorrect'),
    ).not.toBeInTheDocument();
  });

  it('shows an error message when the status is error', () => {
    render(
      <GenerationHdf
        handleActionClick={vi.fn()}
        status="error"
        cardNumber="475948"
        onCardNumberChange={vi.fn()}
        onSubmit={vi.fn()}
        onEdit={vi.fn()}
        wallets={[]}
      />,
    );

    expect(screen.getByText('Numéro de carte incorrect')).toBeInTheDocument();
  });

  it('renders the wallets and a "Modifier" button once the account is displayed', async () => {
    const onEdit = vi.fn();
    const { user } = render(
      <GenerationHdf
        handleActionClick={vi.fn()}
        status="account"
        cardNumber="475948"
        onCardNumberChange={vi.fn()}
        onSubmit={vi.fn()}
        onEdit={onEdit}
        wallets={[{ label: 'Manuels et équipements', amount: '100,00 €' }]}
      />,
    );

    expect(screen.getByText('Manuels et équipements')).toBeInTheDocument();
    expect(screen.getByText('100,00 €')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Valider' }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Modifier' }));

    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
