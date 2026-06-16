import { createRef } from 'react';

import { render, screen } from '~/setup';
import Checkbox from './Checkbox';

describe('Checkbox component', () => {
  it('renders an unchecked, enabled checkbox by default', () => {
    render(<Checkbox />);
    const input = screen.getByRole('checkbox') as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input).not.toBeChecked();
    expect(input).toBeEnabled();
    expect(input).toHaveClass('form-check-input', 'c-pointer');
  });

  it('renders a label linked to the input when provided', () => {
    render(<Checkbox label="Accept terms" />);
    const input = screen.getByRole('checkbox');
    const label = screen.getByText('Accept terms');

    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', input.id);
  });

  it('does not render a label when none is provided', () => {
    const { container } = render(<Checkbox />);

    expect(container.querySelector('label')).toBeNull();
  });

  it('reflects the checked and disabled props', () => {
    render(<Checkbox checked disabled onChange={() => {}} />);
    const input = screen.getByRole('checkbox');

    expect(input).toBeChecked();
    expect(input).toBeDisabled();
  });

  it('sets the indeterminate DOM property from the prop', () => {
    render(<Checkbox indeterminate />);
    const input = screen.getByRole('checkbox') as HTMLInputElement;

    expect(input.indeterminate).toBe(true);
  });

  it('keeps the indeterminate DOM property false when not set', () => {
    render(<Checkbox />);
    const input = screen.getByRole('checkbox') as HTMLInputElement;

    expect(input.indeterminate).toBe(false);
  });

  it('forwards extra className alongside the default classes', () => {
    render(<Checkbox className="custom-class" />);
    const input = screen.getByRole('checkbox');

    expect(input).toHaveClass('custom-class', 'form-check-input', 'c-pointer');
  });

  it('populates the forwarded ref once mounted', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} />);

    expect(ref.current).not.toBeNull();
  });

  it('calls onChange when toggled', async () => {
    const handleChange = vi.fn();
    const { user } = render(<Checkbox onChange={handleChange} />);

    await user.click(screen.getByRole('checkbox'));

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
