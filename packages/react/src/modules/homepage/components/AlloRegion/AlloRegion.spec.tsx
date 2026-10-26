import { render, screen } from '~/setup';
import AlloRegion from './AlloRegion';

describe('AlloRegion', () => {
  it('invites the user to report an issue in their school', () => {
    render(
      <AlloRegion onRequestsClick={vi.fn()} onNewRequestClick={vi.fn()} />,
    );

    expect(
      screen.getByRole('heading', { name: 'Allô Région' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/^Bâtiments, équipements : un souci dans ton lycée \?/),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Fais-le remonter à la Région !'),
    ).toBeInTheDocument();
  });

  it('opens the requests or the request form', async () => {
    const onRequestsClick = vi.fn();
    const onNewRequestClick = vi.fn();
    const { user } = render(
      <AlloRegion
        onRequestsClick={onRequestsClick}
        onNewRequestClick={onNewRequestClick}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Mes signalements' }));
    expect(onRequestsClick).toHaveBeenCalledOnce();

    await user.click(
      screen.getByRole('button', { name: 'Faire un signalement' }),
    );
    expect(onNewRequestClick).toHaveBeenCalledOnce();
  });
});
