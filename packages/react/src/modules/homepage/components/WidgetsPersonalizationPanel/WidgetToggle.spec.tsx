import { render, screen } from '~/setup';
import { WidgetToggle } from './WidgetToggle';

describe('WidgetToggle', () => {
  it('reflects the checked state via aria-checked', () => {
    render(
      <WidgetToggle
        checked
        onChange={vi.fn()}
        aria-label="Activer le widget X"
      />,
    );

    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('reflects the unchecked state via aria-checked', () => {
    render(
      <WidgetToggle
        checked={false}
        onChange={vi.fn()}
        aria-label="Activer le widget X"
      />,
    );

    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onChange when clicked', async () => {
    const onChange = vi.fn();
    const { user } = render(
      <WidgetToggle
        checked={false}
        onChange={onChange}
        aria-label="Activer le widget X"
      />,
    );

    await user.click(screen.getByRole('switch'));

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('is disabled when the disabled prop is set', () => {
    render(
      <WidgetToggle
        checked={false}
        onChange={vi.fn()}
        aria-label="Activer le widget X"
        disabled
      />,
    );

    expect(screen.getByRole('switch')).toBeDisabled();
  });
});
