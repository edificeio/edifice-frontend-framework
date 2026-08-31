import { UsefulLink } from '@edifice.io/client';
import { render, screen } from '~/setup';
import { UsefulLinks } from './UsefulLinks';

const links: UsefulLink[] = [
  { id: '1', name: 'Lumni', url: 'https://lumni.fr' },
  { id: '2', name: 'ONISEP', url: 'https://onisep.fr' },
];

describe('UsefulLinks', () => {
  it('renders a LinkPill per link', () => {
    render(<UsefulLinks links={links} onEditClick={vi.fn()} />);

    expect(screen.getByText('Lumni')).toBeInTheDocument();
    expect(screen.getByText('ONISEP')).toBeInTheDocument();
  });

  it('shows the empty message when there are no links', () => {
    render(<UsefulLinks links={[]} onEditClick={vi.fn()} />);

    expect(
      screen.getByText(
        'Gardez à portée de main les sites web que vous utilisez souvent !',
      ),
    ).toBeInTheDocument();
  });

  it('calls onEditClick when the header action is clicked', async () => {
    const onEditClick = vi.fn();
    const { user } = render(
      <UsefulLinks links={links} onEditClick={onEditClick} />,
    );

    await user.click(screen.getByTestId('home-card-header-action'));

    expect(onEditClick).toHaveBeenCalledTimes(1);
  });
});
