import { createRef } from 'react';
import { render, screen } from '~/setup';
import RadioTile from './RadioTile';

describe('RadioTile', () => {
  it('renders a radio input named after its label', () => {
    render(<RadioTile name="group" value="a" label="Option A" />);

    const radio = screen.getByRole('radio', { name: 'Option A' });
    expect(radio).toHaveAttribute('name', 'group');
    expect(radio).toHaveAttribute('value', 'a');
  });

  it('calls onChange when the tile is clicked', async () => {
    const onChange = vi.fn();
    const { user } = render(
      <RadioTile value="a" label="Option A" onChange={onChange} />,
    );

    await user.click(screen.getByText('Option A'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('does not call onChange when disabled', async () => {
    const onChange = vi.fn();
    const { user } = render(
      <RadioTile value="a" label="Option A" onChange={onChange} disabled />,
    );

    await user.click(screen.getByRole('radio'));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('applies className and style to the tile', () => {
    const { container } = render(
      <RadioTile
        label="Option A"
        className="custom-tile"
        style={{ fontFamily: 'Georgia' }}
      />,
    );

    const tile = container.querySelector('.radio-tile');
    expect(tile).toHaveClass('custom-tile');
    expect(tile).toHaveStyle({ fontFamily: 'Georgia' });
  });

  it.each([
    [{}, 'radio-tile--text'],
    [{ image: 'img.png' }, 'radio-tile--horizontal'],
    [
      { image: 'img.png', orientation: 'vertical' as const },
      'radio-tile--vertical',
    ],
    [{ image: 'img.png', hideLabel: true }, 'radio-tile--image'],
  ])('picks the layout from its props (%o)', (props, expectedClass) => {
    const { container } = render(<RadioTile label="Option A" {...props} />);

    expect(container.querySelector('.radio-tile')).toHaveClass(expectedClass);
  });

  it('renders an image URL as a decorative img', () => {
    const { container } = render(
      <RadioTile label="Option A" image="img.png" />,
    );

    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', 'img.png');
    expect(img).toHaveAttribute('alt', '');
  });

  it('renders a custom image node', () => {
    render(
      <RadioTile label="Option A" image={<span data-testid="preview" />} />,
    );

    expect(screen.getByTestId('preview')).toBeInTheDocument();
  });

  it('keeps a hidden label accessible', () => {
    render(<RadioTile label="Option A" image="img.png" hideLabel />);

    expect(screen.getByText('Option A')).toHaveClass('visually-hidden');
    expect(screen.getByRole('radio', { name: 'Option A' })).toBeInTheDocument();
  });

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<RadioTile ref={ref} label="Option A" />);

    expect(ref.current).toBe(screen.getByRole('radio'));
  });
});
