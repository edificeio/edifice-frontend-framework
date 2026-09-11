import { render, screen } from '~/setup';
import Qwant from './Qwant';

describe('Qwant', () => {
  it('calls handleActionClick when the open button is clicked', async () => {
    const handleActionClick = vi.fn();
    const { user } = render(<Qwant handleActionClick={handleActionClick} />);

    await user.click(screen.getByRole('button', { name: 'Ouvrir' }));

    expect(handleActionClick).toHaveBeenCalledTimes(1);
  });

  it('submits the search query to Qwant', () => {
    render(<Qwant handleActionClick={vi.fn()} />);

    const form = screen.getByTestId('qwant-search-input').closest('form');
    expect(form).toHaveAttribute('action', 'https://www.qwant.com');
    expect(form).toHaveAttribute('method', 'GET');
  });
});
