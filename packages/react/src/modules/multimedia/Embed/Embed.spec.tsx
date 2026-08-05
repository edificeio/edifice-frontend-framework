import { render, screen } from '~/setup';
import Embed from './Embed';

const preview = () => document.querySelector('.embed-preview');

describe('Embed', () => {
  it('describes what the field expects', () => {
    render(<Embed onSuccess={vi.fn()} />);

    expect(
      screen.getByText(/copy the 'embed' or 'iframe' sharing code/i),
    ).toBeInTheDocument();
    expect(screen.getByText('Embed or iframe')).toBeInTheDocument();
  });

  it('shows a placeholder preview while nothing is typed', () => {
    render(<Embed onSuccess={vi.fn()} />);

    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(preview()).toHaveClass('bg-gray-300');
  });

  it('renders the typed markup as preview and reports it', async () => {
    const onSuccess = vi.fn();
    const { user } = render(<Embed onSuccess={onSuccess} />);

    await user.type(
      screen.getByPlaceholderText('Paste your code here'),
      '<b>hello</b>',
    );

    expect(preview()?.querySelector('b')).toHaveTextContent('hello');
    expect(onSuccess).toHaveBeenLastCalledWith('<b>hello</b>');
    expect(screen.queryByText('Preview')).not.toBeInTheDocument();
  });

  it('reports an empty selection once the field is cleared', async () => {
    const onSuccess = vi.fn();
    const { user } = render(<Embed onSuccess={onSuccess} />);
    const field = screen.getByPlaceholderText('Paste your code here');

    await user.type(field, '<b>hello</b>');
    await user.clear(field);

    expect(onSuccess).toHaveBeenLastCalledWith();
    expect(screen.getByText('Preview')).toBeInTheDocument();
  });
});
