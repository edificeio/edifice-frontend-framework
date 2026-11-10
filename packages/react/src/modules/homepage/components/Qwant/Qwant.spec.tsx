import { render, screen } from '~/setup';
import Qwant from './Qwant';

describe('Qwant', () => {
  it('calls handleActionClick when the open button is clicked', async () => {
    const handleActionClick = vi.fn();
    const { user } = render(
      <Qwant handleActionClick={handleActionClick} handleSearch={vi.fn()} />,
    );

    await user.click(screen.getByTestId('qwant-button-open'));

    expect(handleActionClick).toHaveBeenCalledTimes(1);
  });

  it('calls handleSearch with the trimmed query on button click', async () => {
    const handleSearch = vi.fn();
    const { user } = render(
      <Qwant handleActionClick={vi.fn()} handleSearch={handleSearch} />,
    );

    await user.type(screen.getByTestId('qwant-search-input'), ' edifice ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(handleSearch).toHaveBeenCalledWith('edifice');
  });

  it('calls handleSearch when pressing Enter in the input', async () => {
    const handleSearch = vi.fn();
    const { user } = render(
      <Qwant handleActionClick={vi.fn()} handleSearch={handleSearch} />,
    );

    await user.type(screen.getByTestId('qwant-search-input'), 'edifice{Enter}');

    expect(handleSearch).toHaveBeenCalledWith('edifice');
  });

  it('does not call handleSearch when the query is empty', async () => {
    const handleSearch = vi.fn();
    const { user } = render(
      <Qwant handleActionClick={vi.fn()} handleSearch={handleSearch} />,
    );

    await user.type(screen.getByTestId('qwant-search-input'), '   {Enter}');

    expect(handleSearch).not.toHaveBeenCalled();
  });
});
