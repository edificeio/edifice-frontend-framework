import { render, screen } from '~/setup';
import DatePicker from './DatePicker';

describe('DatePicker', () => {
  beforeAll(() => {
    // antd's DatePicker (rc-picker) relies on ResizeObserver, absent from jsdom.
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
  });

  it('displays the given value formatted per dateFormat', () => {
    render(
      <DatePicker
        value={new Date(2026, 0, 15)}
        dateFormat="YYYY-MM-DD"
        data-testid="date-picker"
      />,
    );

    expect(screen.getByTestId('date-picker')).toHaveValue('2026-01-15');
  });

  it('uses the default dateFormat when none is provided', () => {
    render(
      <DatePicker value={new Date(2026, 0, 15)} data-testid="date-picker" />,
    );

    expect(screen.getByTestId('date-picker')).toHaveValue('15 / 01 / 2026');
  });

  it('renders empty when no value is provided', () => {
    render(<DatePicker data-testid="date-picker" />);

    expect(screen.getByTestId('date-picker')).toHaveValue('');
  });

  it('calls onChange with a native Date when a day cell is picked', async () => {
    const onChange = vi.fn();
    const { user } = render(
      <DatePicker
        value={new Date(2026, 0, 15)}
        onChange={onChange}
        data-testid="date-picker"
      />,
    );

    await user.click(screen.getByTestId('date-picker'));
    await user.click(screen.getByText('20'));

    expect(onChange).toHaveBeenCalledTimes(1);
    const [calledDate] = onChange.mock.calls[0];
    expect(calledDate).toBeInstanceOf(Date);
    expect(calledDate.getDate()).toBe(20);
    expect(calledDate.getMonth()).toBe(0);
    expect(calledDate.getFullYear()).toBe(2026);
  });

  it('calls onChange with undefined when the value is cleared', async () => {
    const onChange = vi.fn();
    const { user, container } = render(
      <DatePicker
        value={new Date(2026, 0, 15)}
        onChange={onChange}
        data-testid="date-picker"
        allowClear
      />,
    );

    await user.hover(screen.getByTestId('date-picker'));
    await user.click(
      container.querySelector('.ant-picker-clear') as HTMLElement,
    );

    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});
