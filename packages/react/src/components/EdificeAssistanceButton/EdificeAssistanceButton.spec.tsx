import { render, screen } from '~/setup';
import EdificeAssistanceButton from './EdificeAssistanceButton';

describe('EdificeAssistanceButton component', () => {
  it('renders the full wordmark by default', () => {
    render(<EdificeAssistanceButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('edifice-assistance-button');
    expect(
      button.querySelector('svg[viewBox="0 0 225 50"]'),
    ).toBeInTheDocument();
  });

  it('renders the compact mark when collapsed', () => {
    render(<EdificeAssistanceButton collapsed />);

    const button = screen.getByRole('button');
    expect(
      button.querySelector('svg[viewBox="0 0 18 18"]'),
    ).toBeInTheDocument();
    expect(
      button.querySelector('svg[viewBox="0 0 225 50"]'),
    ).not.toBeInTheDocument();
  });

  it('forwards click handler', async () => {
    const onClick = vi.fn();
    render(<EdificeAssistanceButton onClick={onClick} />);

    screen.getByRole('button').click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
