import { render } from '~/setup';
import Divider from './Divider';

describe('Divider component', () => {
  it('renders a horizontal divider by default', () => {
    const { container } = render(<Divider />);
    const divider = container.querySelector('.ant-divider');

    expect(divider).toBeInTheDocument();
    expect(divider).toHaveClass('ant-divider-horizontal');
  });

  it('renders a vertical divider when "vertical" is set', () => {
    const { container } = render(<Divider vertical />);
    const divider = container.querySelector('.ant-divider');

    expect(divider).toHaveClass('ant-divider-vertical');
  });

  it('applies the default className when none is provided', () => {
    const { container } = render(<Divider />);
    const divider = container.querySelector('.ant-divider');

    expect(divider).toHaveClass('border-gray-500');
  });

  it('applies a custom className', () => {
    const { container } = render(<Divider className="border-red-500" />);
    const divider = container.querySelector('.ant-divider');

    expect(divider).toHaveClass('border-red-500');
    expect(divider).not.toHaveClass('border-gray-500');
  });

  it('renders its children as content', () => {
    const { getByText } = render(<Divider>Section Title</Divider>);

    expect(getByText('Section Title')).toBeInTheDocument();
  });
});
