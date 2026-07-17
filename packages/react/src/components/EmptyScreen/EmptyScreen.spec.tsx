import { render, screen } from '~/setup';
import EmptyScreen from './EmptyScreen';

describe('EmptyScreen', () => {
  it('renders the image, title and text when all are provided', () => {
    render(
      <EmptyScreen
        imageSrc="/empty.svg"
        imageAlt="Nothing here"
        title="No results"
        text="Try another search"
      />,
    );

    const img = screen.getByAltText('Nothing here');
    expect(img).toHaveAttribute('src', '/empty.svg');
    expect(img).toHaveAttribute('width', '250');
    expect(img).toHaveAttribute('height', '250');
    expect(
      screen.getByRole('heading', { name: 'No results' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Try another search')).toBeInTheDocument();
  });

  it('applies a custom size to the image', () => {
    const { container } = render(
      <EmptyScreen imageSrc="/empty.svg" size={100} />,
    );

    const img = container.querySelector('img') as HTMLElement;
    expect(img).toHaveAttribute('width', '100');
    expect(img).toHaveAttribute('height', '100');
  });

  it('omits the title and text blocks when not provided', () => {
    render(<EmptyScreen imageSrc="/empty.svg" />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(document.querySelector('.text')).not.toBeInTheDocument();
  });

  it('omits the image block when imageSrc is an empty string', () => {
    const { container } = render(
      <EmptyScreen imageSrc="" title="Title only" />,
    );

    expect(
      container.querySelector('.emptyscreen-image'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Title only' }),
    ).toBeInTheDocument();
  });

  it('merges the custom className onto the text block only', () => {
    const { container } = render(
      <EmptyScreen
        imageSrc="/empty.svg"
        text="Hello"
        className="custom-class"
      />,
    );

    const textBlock = screen.getByText('Hello');
    expect(textBlock).toHaveClass('text', 'custom-class');
    expect(container.firstChild).not.toHaveClass('custom-class');
  });
});
