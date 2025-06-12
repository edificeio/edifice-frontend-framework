import { render, screen } from '~/setup';
import IconButton from './IconButton';

describe('IconButton', () => {
  it('renders the icon', () => {
    render(<IconButton icon={<span data-testid="icon">Icon</span>} />);
    const button = screen.getByTestId('button');
    expect(button).toBeInTheDocument();
  });

  it('applies the correct classes', () => {
    render(<IconButton icon={<span>Icon</span>} className="custom-class" />);
    const button = screen.getByTestId('button');
    expect(button).toHaveClass('btn-icon btn-sm custom-class');
  });
});
