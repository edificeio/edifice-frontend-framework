import { render, screen } from '~/setup';
import { QwantContainer } from './QwantContainer';

describe('QwantContainer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('opens Qwant home in a new tab', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const { user } = render(<QwantContainer />);

    await user.click(screen.getByTestId('qwant-button-open'));

    expect(open).toHaveBeenCalledWith(
      'https://www.qwant.com',
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('opens the Qwant search results in a new tab', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const { user } = render(<QwantContainer />);

    await user.type(
      screen.getByTestId('qwant-search-input'),
      'edifice école{Enter}',
    );

    expect(open).toHaveBeenCalledWith(
      'https://www.qwant.com/?q=edifice+%C3%A9cole&l=fr',
      '_blank',
      'noopener,noreferrer',
    );
  });
});
