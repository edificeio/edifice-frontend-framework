import { render } from '~/setup';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  });

  it('renders Ant Design pagination with expected classes', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Pagination
        current={2}
        total={120}
        pageSize={20}
        onChange={onChange}
        className="custom-pagination"
      />,
    );

    expect(container.querySelector('.ant-pagination')).toBeInTheDocument();
    expect(
      container.querySelector('.ant-pagination.custom-pagination'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('.ant-pagination-item-active'),
    ).toHaveTextContent('2');
  });

  it('calls onChange when user changes page', async () => {
    const onChange = vi.fn();
    const { container, user } = render(
      <Pagination current={1} total={40} pageSize={10} onChange={onChange} />,
    );

    const page2 = container.querySelector('.ant-pagination-item-2');
    expect(page2).toBeInTheDocument();
    await user.click(page2 as HTMLElement);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toBe(2);
  });
});
