import { createRef } from 'react';
import { render, screen } from '~/setup';
import Switch from './Switch';

describe('Switch', () => {
  it('renders a checkbox with its label', () => {
    render(<Switch label="Notifications" readOnly />);

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('applies size, variant and disabled classes on the wrapping label', () => {
    render(<Switch label="On" size="sm" variant="success" disabled readOnly />);

    const label = screen.getByRole('checkbox').closest('label');
    expect(label).toHaveClass('switch', 'switch-sm', 'switch-success');
    expect(label).toHaveClass('switch-disabled');
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

  it('does not call onChange when disabled', async () => {
    const handleChange = vi.fn();
    const { user } = render(<Switch disabled onChange={handleChange} />);

    await user.click(screen.getByRole('checkbox'));

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('forwards the ref to the input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Switch ref={ref} readOnly />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
