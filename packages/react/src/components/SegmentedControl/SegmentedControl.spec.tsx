import { render, screen } from '~/setup';
import SegmentedControl from './SegmentedControl';

const options = [
  { label: 'List', value: 'list' },
  { label: 'Kanban', value: 'kanban' },
];

describe('SegmentedControl', () => {
  beforeAll(() => {
    // antd Segmented relies on ResizeObserver, absent from jsdom.
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
  });

  it('renders every option', () => {
    render(<SegmentedControl options={options} value="list" />);

    expect(screen.getByText('List')).toBeInTheDocument();
    expect(screen.getByText('Kanban')).toBeInTheDocument();
    expect(screen.getByTestId('segmented-option-list')).toBeInTheDocument();
  });

  it('marks the controlled value as selected', () => {
    render(<SegmentedControl options={options} value="kanban" />);

    expect(
      screen.getByText('Kanban').closest('.ant-segmented-item'),
    ).toHaveClass('ant-segmented-item-selected');
  });

  it('calls onChange with the selected value string', async () => {
    const onChange = vi.fn();
    const { user } = render(
      <SegmentedControl options={options} value="list" onChange={onChange} />,
    );

    await user.click(screen.getByTestId('segmented-option-kanban'));

    expect(onChange).toHaveBeenCalledWith('kanban');
  });

  it('renders an optional badge next to the label', () => {
    render(
      <SegmentedControl
        options={[{ label: 'Inbox', value: 'inbox', badge: <span>5</span> }]}
        value="inbox"
      />,
    );

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('applies the ghost variant class', () => {
    const { container } = render(
      <SegmentedControl options={options} value="list" variant="ghost" />,
    );

    expect(container.querySelector('.ghost')).toBeInTheDocument();
  });
});
