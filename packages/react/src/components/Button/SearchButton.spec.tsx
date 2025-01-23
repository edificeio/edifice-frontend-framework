import { render, screen } from '~/setup';
import SearchButton from './SearchButton';

describe('SearchButton', () => {
  it('renders without crashing', () => {
    render(<SearchButton />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    const { user } = render(<SearchButton onClick={handleClick} />);
    const buttonElement = screen.getByRole('button');
    await user.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const className = 'custom-class';
    render(<SearchButton className={className} />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('custom-class');
  });

  it('is disabled when disabled prop is true', () => {
    render(<SearchButton disabled />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
  });
});
