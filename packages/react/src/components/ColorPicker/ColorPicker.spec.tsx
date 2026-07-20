import { render, screen } from '~/setup';
import ColorPicker from './ColorPicker';
import { ColorPalette } from './ColorPalette';

const palette: ColorPalette = {
  label: 'myPalette',
  colors: [
    [
      { value: '#111111', description: 'black' },
      { value: '#EEEEEE', description: 'white', hue: 'light' },
    ],
  ],
  reset: { value: '', description: 'reset color', isReset: true },
};

describe('ColorPicker', () => {
  it('renders the default palettes when none is provided', () => {
    const { container } = render(<ColorPicker />);

    // Palette labels go through t(), so match structurally rather than on
    // (possibly translated) text content.
    expect(container.querySelectorAll('.color-picker')).toHaveLength(2);
    expect(
      screen.getByRole('button', { name: 'color.gray.darkest' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'color.blue' }),
    ).toBeInTheDocument();
  });

  it('renders only the palette(s) passed via the palettes prop', () => {
    render(<ColorPicker palettes={[palette]} />);

    expect(screen.getByText('myPalette')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'color.gray.darkest' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'black' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'white' })).toBeInTheDocument();
  });

  it('calls onSuccess with the clicked color item', async () => {
    const onSuccess = vi.fn();
    const { user } = render(
      <ColorPicker palettes={[palette]} onSuccess={onSuccess} />,
    );

    await user.click(screen.getByRole('button', { name: 'black' }));

    expect(onSuccess).toHaveBeenCalledWith(palette.colors[0][0]);
  });

  it('marks the swatch matching the model prop as selected', () => {
    render(<ColorPicker palettes={[palette]} model="#EEEEEE" />);

    expect(
      screen.getByRole('button', { name: 'white' }).firstChild,
    ).toHaveClass('selected');
    expect(
      screen.getByRole('button', { name: 'black' }).firstChild,
    ).not.toHaveClass('selected');
  });

  it('renders and triggers the reset button when the palette defines one', async () => {
    const onSuccess = vi.fn();
    const { user } = render(
      <ColorPicker palettes={[palette]} onSuccess={onSuccess} />,
    );

    await user.click(screen.getByText('reset color'));

    expect(onSuccess).toHaveBeenCalledWith(palette.reset);
  });

  it('omits the reset button when the palette has none', () => {
    const noResetPalette: ColorPalette = { ...palette, reset: undefined };
    render(<ColorPicker palettes={[noResetPalette]} />);

    expect(screen.queryByText('reset color')).not.toBeInTheDocument();
  });
});
