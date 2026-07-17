import { render, screen } from '~/setup';
import ButtonBeta from './ButtonBeta';

describe('ButtonBeta', () => {
  it('renders with default color/variant classes', () => {
    render(<ButtonBeta>Click me</ButtonBeta>);

    const button = screen.getByTestId('button-beta');
    expect(button).toHaveTextContent('Click me');
    expect(button).toHaveClass('btn-beta', 'btn-beta-default');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('applies the color and outline/ghost variant classes', () => {
    render(
      <ButtonBeta color="destructive" variant="outline">
        Delete
      </ButtonBeta>,
    );

    expect(screen.getByTestId('button-beta')).toHaveClass(
      'btn-beta-destructive',
      'btn-beta--outline',
    );
  });

  it('marks itself icon-only when there are no children', () => {
    render(<ButtonBeta leftIcon={<span>icon</span>} />);

    expect(screen.getByTestId('button-beta')).toHaveClass(
      'btn-beta--icon-only',
    );
  });

  it('marks itself with-icon when it has both an icon and children', () => {
    render(<ButtonBeta leftIcon={<span>icon</span>}>Save</ButtonBeta>);

    const button = screen.getByTestId('button-beta');
    expect(button).toHaveClass('btn-beta--with-icon');
    expect(button).not.toHaveClass('btn-beta--icon-only');
  });

  it('shows the loading indicator without hiding the children (unlike Button)', () => {
    render(<ButtonBeta isLoading>Save</ButtonBeta>);

    const button = screen.getByTestId('button-beta');
    expect(button).toHaveClass('btn-beta--loading');
    expect(button).toHaveTextContent('Save');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const { user } = render(
      <ButtonBeta onClick={handleClick}>Click me</ButtonBeta>,
    );

    await user.click(screen.getByTestId('button-beta'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
