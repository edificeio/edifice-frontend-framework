import { createRef } from 'react';
import { render, screen } from '~/setup';
import Switch from './Switch';

describe('Switch', () => {
  it('renders a checkbox with its label', () => {
    render(<Switch label="Notifications" readOnly />);

    expect(
      screen.getByRole('checkbox', { name: 'Notifications' }),
    ).toBeInTheDocument();
  });

  it('renders the label on the right of the toggle by default', () => {
    render(<Switch label="On" readOnly />);

    const root = screen.getByRole('checkbox').closest('label');
    expect(root).toHaveClass('switch');
    expect(root).not.toHaveClass('switch--label-left');
  });

  it('applies the label-left modifier when labelPosition is "left"', () => {
    render(<Switch label="On" labelPosition="left" readOnly />);

    expect(screen.getByRole('checkbox').closest('label')).toHaveClass(
      'switch',
      'switch--label-left',
    );
  });

  it('applies className on the root and labelClassName on the label', () => {
    render(
      <Switch
        label="On"
        className="custom-root"
        labelClassName="custom-label"
        readOnly
      />,
    );

    expect(screen.getByRole('checkbox').closest('label')).toHaveClass(
      'switch',
      'custom-root',
    );
    expect(screen.getByText('On')).toHaveClass('switch__label', 'custom-label');
  });

  it('ignores the deprecated size and variant props', () => {
    render(<Switch label="On" size="sm" variant="success" readOnly />);

    const input = screen.getByRole('checkbox');
    expect(input).not.toHaveAttribute('size');
    expect(input).not.toHaveAttribute('variant');
    expect(input.closest('label')?.className).toBe('switch');
  });

  it('reflects the controlled checked and disabled props', () => {
    render(<Switch checked disabled onChange={() => {}} />);

    const input = screen.getByRole('checkbox');
    expect(input).toBeChecked();
    expect(input).toBeDisabled();
  });

  it('calls onChange with a native event when toggled', async () => {
    const handleChange = vi.fn();
    const { user } = render(<Switch onChange={handleChange} />);

    await user.click(screen.getByRole('checkbox'));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0].target.checked).toBe(true);
  });

  it('toggles when its label is clicked', async () => {
    const handleChange = vi.fn();
    const { user } = render(<Switch label="On" onChange={handleChange} />);

    await user.click(screen.getByText('On'));

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('does not call onChange when disabled', async () => {
    const handleChange = vi.fn();
    const { user } = render(<Switch disabled onChange={handleChange} />);

    await user.click(screen.getByRole('checkbox'));

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('can be exposed with the switch role', () => {
    render(
      <Switch role="switch" aria-label="Notifications" readOnly checked />,
    );

    expect(screen.getByRole('switch', { name: 'Notifications' })).toBeChecked();
  });

  it('forwards the ref to the input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Switch ref={ref} readOnly />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
