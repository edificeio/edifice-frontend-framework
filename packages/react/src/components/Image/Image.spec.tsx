import { fireEvent, render, screen } from '~/setup';
import Image from './Image';

describe('Image', () => {
  it('renders an img with the given src and alt', () => {
    render(<Image src="/photo.png" alt="Photo" />);

    const img = screen.getByAltText('Photo');
    expect(img).toHaveAttribute('src', '/photo.png');
  });

  it('swaps to the default placeholder on load error', () => {
    render(<Image src="/broken.png" alt="Photo" />);

    const img = screen.getByAltText('Photo');
    fireEvent.error(img);

    expect(img.getAttribute('src')).not.toBe('/broken.png');
  });

  it('swaps to a custom imgPlaceholder on load error', () => {
    render(
      <Image
        src="/broken.png"
        alt="Photo"
        imgPlaceholder="/custom-placeholder.png"
      />,
    );

    const img = screen.getByAltText('Photo');
    fireEvent.error(img);

    expect(img).toHaveAttribute('src', '/custom-placeholder.png');
  });

  it('resyncs the image source when src changes', () => {
    const { rerender } = render(<Image src="/first.png" alt="Photo" />);
    expect(screen.getByAltText('Photo')).toHaveAttribute('src', '/first.png');

    rerender(<Image src="/second.png" alt="Photo" />);
    expect(screen.getByAltText('Photo')).toHaveAttribute('src', '/second.png');
  });

  it('wraps the image in a ratio div when ratio is set', () => {
    const { container } = render(
      <Image src="/photo.png" alt="Photo" ratio="16" />,
    );

    expect(container.querySelector('.ratio-16x9')).toBeInTheDocument();
  });

  it('does not wrap the image when ratio is not set', () => {
    const { container } = render(<Image src="/photo.png" alt="Photo" />);

    expect(container.querySelector('.ratio')).not.toBeInTheDocument();
  });

  it('applies the objectFit class on the img itself', () => {
    render(<Image src="/photo.png" alt="Photo" objectFit="cover" />);

    expect(screen.getByAltText('Photo')).toHaveClass('object-fit-cover');
  });
});
