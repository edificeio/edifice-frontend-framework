import { render, screen } from '~/setup';
import EditorPreview from './EditorPreview';

// Absolute URLs are used for <img src> so jsdom does not rewrite/resolve them
// against the document base URI, keeping assertions on `image.src` predictable.
const IMG_1 = 'https://example.com/image-1.png';
const IMG_2 = 'https://example.com/image-2.png';
const IMG_3 = 'https://example.com/image-3.png';
const IMG_4 = 'https://example.com/image-4.png';

describe('EditorPreview', () => {
  it('renders no summary text and no media when content is empty', () => {
    const { container } = render(<EditorPreview content="" />);

    expect(container.querySelector('.post-preview-content')).toHaveTextContent(
      '',
    );
    expect(container.querySelectorAll('img')).toHaveLength(0);
  });

  it('renders the plain text as summary when content has no media', () => {
    render(<EditorPreview content="<p>Just some text</p>" />);

    expect(screen.getByText('Just some text')).toBeInTheDocument();
  });

  it('renders an Image for a single img tag found in content', () => {
    const { container } = render(
      <EditorPreview content={`<p>Hello</p><img src="${IMG_1}" alt="a" />`} />,
    );

    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(1);
    expect(images[0].src).toContain(IMG_1);
    expect(images[0].alt).toBe('a');
  });

  it('caps the number of rendered images at maxMediaDisplayed (default 3)', () => {
    const content = [IMG_1, IMG_2, IMG_3, IMG_4]
      .map((src) => `<img src="${src}" alt="img" />`)
      .join('');

    const { container } = render(<EditorPreview content={content} />);

    expect(container.querySelectorAll('img')).toHaveLength(3);
  });

  it('strips video/iframe/audio/embed from the summary but keeps surrounding text, and does not render them as images', () => {
    const content =
      '<p>Before</p>' +
      '<video src="a.mp4"></video>' +
      '<iframe src="b.html"></iframe>' +
      '<audio src="c.mp3"></audio>' +
      '<embed src="d.swf" />' +
      '<p>After</p>';

    const { container } = render(<EditorPreview content={content} />);

    const summary = container.querySelector('.post-preview-content');
    expect(summary).toHaveTextContent('Before');
    expect(summary).toHaveTextContent('After');
    expect(summary?.textContent).not.toContain('.mp4');
    expect(summary?.textContent).not.toContain('.html');
    expect(summary?.textContent).not.toContain('.mp3');
    expect(summary?.textContent).not.toContain('.swf');
    expect(container.querySelectorAll('img')).toHaveLength(0);
  });

  it('falls back to an empty url/alt when the img element has no src', () => {
    const { container } = render(
      <EditorPreview content='<img alt="broken" />' />,
    );

    const image = container.querySelector('img');
    expect(image).not.toBeNull();
    expect(image?.getAttribute('alt')).toBe('');
  });

  it('shows the "more media" overlay on slide 0 and slide 2 when there are more images than maxMediaDisplayed', () => {
    const content = [IMG_1, IMG_2, IMG_3, IMG_4]
      .map((src) => `<img src="${src}" alt="img" />`)
      .join('');

    render(<EditorPreview content={content} />);

    // 4 images total, maxMediaDisplayed=3: slide 0 sees 3 more items after it
    // in the full media list, slide 2 sees 1 more.
    expect(screen.getByText('+3 images')).toBeInTheDocument();
    expect(screen.getByText('+1 images')).toBeInTheDocument();
  });

  it('does not show the slide-2 "more media" overlay when exactly maxMediaDisplayed images are provided', () => {
    const content = [IMG_1, IMG_2, IMG_3]
      .map((src) => `<img src="${src}" alt="img" />`)
      .join('');

    render(<EditorPreview content={content} />);

    // 3 images total, maxMediaDisplayed=3: slide 2 is the last item, so there
    // is nothing left after it and its overlay must not render.
    expect(screen.queryByText('+0 images')).not.toBeInTheDocument();
  });

  it('applies the border classes for the outline variant (default)', () => {
    const { container } = render(
      <EditorPreview content="" variant="outline" />,
    );

    expect(container.firstElementChild).toHaveClass(
      'border',
      'rounded-3',
      'py-12',
      'px-16',
    );
  });

  it('does not apply border classes for the ghost variant', () => {
    const { container } = render(<EditorPreview content="" variant="ghost" />);

    expect(container.firstElementChild).not.toHaveClass('border');
  });

  it('has no interactive role/tabIndex on the root when onDetailClick is not provided', () => {
    const { container } = render(<EditorPreview content="" />);
    const root = container.firstElementChild as HTMLElement;

    expect(root.getAttribute('role')).toBeNull();
    expect(root.hasAttribute('tabindex')).toBe(false);
  });

  it('calls onDetailClick when the root container is clicked', async () => {
    const onDetailClick = vi.fn();
    const { container, user } = render(
      <EditorPreview content="" onDetailClick={onDetailClick} />,
    );
    const root = container.firstElementChild as HTMLElement;

    expect(root.getAttribute('role')).toBe('button');

    await user.click(root);

    expect(onDetailClick).toHaveBeenCalledOnce();
  });

  it('calls onMediaClick when the media row is clicked and does not also trigger onDetailClick', async () => {
    const onDetailClick = vi.fn();
    const onMediaClick = vi.fn();
    const { container, user } = render(
      <EditorPreview
        content={`<img src="${IMG_1}" alt="a" />`}
        onDetailClick={onDetailClick}
        onMediaClick={onMediaClick}
      />,
    );

    const mediaRow = container.querySelector('img')?.parentElement
      ?.parentElement as HTMLElement;

    await user.click(mediaRow);

    expect(onMediaClick).toHaveBeenCalledOnce();
    expect(onDetailClick).not.toHaveBeenCalled();
  });

  it('lets the click bubble up to onDetailClick when onMediaClick is not provided', async () => {
    const onDetailClick = vi.fn();
    const { container, user } = render(
      <EditorPreview
        content={`<img src="${IMG_1}" alt="a" />`}
        onDetailClick={onDetailClick}
      />,
    );

    const mediaRow = container.querySelector('img')?.parentElement
      ?.parentElement as HTMLElement;

    await user.click(mediaRow);

    // handleMediaClick only calls stopPropagation when onMediaClick exists,
    // so without it the click bubbles up and triggers the root handler.
    expect(onDetailClick).toHaveBeenCalledOnce();
  });
});
