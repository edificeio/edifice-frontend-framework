import { render, screen } from '~/setup';
import { TextCounter } from './TextCounter';

describe('TextCounter', () => {
  it('renders the current length and maxLength', () => {
    render(<TextCounter content="hello" maxLength={100} />);
    expect(screen.getByText('5 / 100')).toBeInTheDocument();
  });

  it('shows 0 as length when content is an empty string', () => {
    render(<TextCounter content="" maxLength={200} />);
    expect(screen.getByText('0 / 200')).toBeInTheDocument();
  });

  it('shows the correct count as content length grows', () => {
    const { rerender } = render(<TextCounter content="hi" maxLength={50} />);
    expect(screen.getByText('2 / 50')).toBeInTheDocument();

    rerender(<TextCounter content="hello world" maxLength={50} />);
    expect(screen.getByText('11 / 50')).toBeInTheDocument();
  });

  it('renders a <p> element with the expected classes', () => {
    render(<TextCounter content="test" maxLength={10} />);
    const el = screen.getByText('4 / 10');
    expect(el.tagName).toBe('P');
    expect(el).toHaveClass('small', 'text-gray-700', 'p-2', 'text-end');
  });

  it('displays maxLength correctly when content equals maxLength', () => {
    const content = 'a'.repeat(140);
    render(<TextCounter content={content} maxLength={140} />);
    expect(screen.getByText('140 / 140')).toBeInTheDocument();
  });

  it('displays count above maxLength when content exceeds it', () => {
    const content = 'a'.repeat(160);
    render(<TextCounter content={content} maxLength={140} />);
    expect(screen.getByText('160 / 140')).toBeInTheDocument();
  });
});
