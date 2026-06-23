import { render, screen } from '~/setup';
import Radio from './Radio';

describe('Radio component', () => {
  it('renders an enabled radio input by default', () => {
    render(<Radio model="a" value="a" checked onChange={() => {}} />);
    const input = screen.getByRole('radio');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'radio');
    expect(input).toHaveClass('form-check-input', 'c-pointer');
  });

  it('does not render a label by default', () => {
    const { container } = render(<Radio model="a" value="a" />);

    expect(container.querySelector('label')).toBeNull();
  });

  it('renders a text label linked to the input when provided', () => {
    render(<Radio model="a" value="a" label="Option A" />);
    const input = screen.getByRole('radio');
    const label = screen.getByText('Option A');

    expect(label).toHaveAttribute('for', input.id);
    expect(label).toHaveClass('form-check-label');
  });

  it('reflects the checked and disabled props', () => {
    render(<Radio model="a" value="a" checked disabled onChange={() => {}} />);
    const input = screen.getByRole('radio');

    expect(input).toBeChecked();
    expect(input).toBeDisabled();
  });

  it('renders an icon instead of the text label and hides the input', () => {
    render(
      <Radio model="a" value="a" label="Ignored" icon={<span>icon</span>} />,
    );
    const input = screen.getByRole('radio');

    expect(screen.getByText('icon')).toBeInTheDocument();
    expect(screen.queryByText('Ignored')).toBeNull();
    expect(input).toHaveClass('d-none');
  });

  it('mutes the icon label when the model does not match the value', () => {
    render(<Radio model="b" value="a" icon={<span>icon</span>} />);
    const label = screen.getByText('icon').closest('label');

    expect(label).toHaveClass('text-muted');
  });

  it('does not mute the icon label when the model matches the value', () => {
    render(<Radio model="a" value="a" icon={<span>icon</span>} />);
    const label = screen.getByText('icon').closest('label');

    expect(label).not.toHaveClass('text-muted');
  });

  it('calls onChange when selected', async () => {
    const handleChange = vi.fn();
    const { user } = render(
      <Radio model="a" value="a" onChange={handleChange} />,
    );

    await user.click(screen.getByRole('radio'));

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
