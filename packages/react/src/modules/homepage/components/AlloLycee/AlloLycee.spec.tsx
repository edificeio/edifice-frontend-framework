import { render, screen } from '~/setup';
import AlloLycee from './AlloLycee';

describe('AlloLycee', () => {
  it('invites the user to report an issue in their school', () => {
    render(<AlloLycee onRequestsClick={vi.fn()} onNewRequestClick={vi.fn()} />);

    expect(
      screen.getByRole('heading', { name: 'Allô Lycée' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Signalez-le !')).toBeInTheDocument();
  });

  it('opens the requests or the request form', async () => {
    const onRequestsClick = vi.fn();
    const onNewRequestClick = vi.fn();
    const { user } = render(
      <AlloLycee
        onRequestsClick={onRequestsClick}
        onNewRequestClick={onNewRequestClick}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Mes demandes' }));
    expect(onRequestsClick).toHaveBeenCalledOnce();

    await user.click(screen.getByRole('button', { name: 'Faire une demande' }));
    expect(onNewRequestClick).toHaveBeenCalledOnce();
  });
});
