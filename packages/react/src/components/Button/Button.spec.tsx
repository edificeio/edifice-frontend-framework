import { render, screen } from '~/setup';
import Button from './Button';

describe('Button component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByTestId('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('btn btn-filled btn-primary');
  });

  it('renders correctly with custom props', () => {
    render(
      <Button color="secondary" variant="outline" size="lg">
        Click me
      </Button>,
    );
    const button = screen.getByTestId('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn btn-outline-secondary btn-lg');
  });

  it('renders left and right icons', () => {
    render(
      <Button leftIcon={<span>Left</span>} rightIcon={<span>Right</span>}>
        Click me
      </Button>,
    );

    const leftIcon = screen.getByText('Left');
    const rightIcon = screen.getByText('Right');
    expect(leftIcon).toBeInTheDocument();
    expect(rightIcon).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(<Button isLoading>Click me</Button>);
    const button = screen.getByTestId('button');
    expect(button).toHaveClass('btn-loading');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const { user } = render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByTestId('button');
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
