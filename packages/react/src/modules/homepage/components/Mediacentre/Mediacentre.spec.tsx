import { render, screen } from '~/setup';
import Mediacentre, { MAX_DISPLAYED_RESOURCES } from './Mediacentre';
import { MediacentreResource } from './types';

const mockResources: MediacentreResource[] = [
  {
    id: '1',
    title: 'Hyperbole | Mathématiques 3e',
    subtitle: 'Éditions Nathan',
    href: 'https://example.com/hyperbole',
    imageUrl: 'https://example.com/hyperbole.png',
  },
  {
    id: '2',
    title: 'Magellan Histoire-Géographie',
    href: 'https://example.com/magellan',
  },
];

describe('Mediacentre', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls handleActionClick when the see more button is clicked', async () => {
    const handleActionClick = vi.fn();
    const { user } = render(
      <Mediacentre handleActionClick={handleActionClick} resources={[]} />,
    );

    await user.click(screen.getByTestId('mediacentre-see-more-button'));

    expect(handleActionClick).toHaveBeenCalledTimes(1);
  });

  it('renders a link pill for each resource', () => {
    render(
      <Mediacentre handleActionClick={vi.fn()} resources={mockResources} />,
    );

    const links = screen.getAllByTestId('mediacentre-resource-link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', mockResources[0].href);
    expect(links[0]).toHaveTextContent('Éditions Nathan');
    expect(links[0].querySelector('img')).toHaveAttribute(
      'src',
      mockResources[0].imageUrl,
    );
    // Without a cover, the pill falls back to its default icon.
    expect(links[1].querySelector('img')).toBeNull();
  });

  it('displays at most MAX_DISPLAYED_RESOURCES resources', () => {
    const manyResources = Array.from({ length: 6 }, (_, index) => ({
      id: String(index),
      title: `Resource ${index}`,
      href: `https://example.com/${index}`,
    }));
    render(
      <Mediacentre handleActionClick={vi.fn()} resources={manyResources} />,
    );

    const links = screen.getAllByTestId('mediacentre-resource-link');
    expect(links).toHaveLength(MAX_DISPLAYED_RESOURCES);
    expect(links[0]).toHaveAttribute('href', manyResources[0].href);
  });

  it('renders the loading state', () => {
    render(
      <Mediacentre handleActionClick={vi.fn()} resources={[]} isLoading />,
    );

    expect(screen.getByTestId('mediacentre-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('mediacentre-empty')).not.toBeInTheDocument();
  });

  it('renders the empty state when there is no favorite', () => {
    render(<Mediacentre handleActionClick={vi.fn()} resources={[]} />);

    expect(screen.getByTestId('mediacentre-empty')).toBeInTheDocument();
  });

  it('renders the error state and keeps the Universalis search', () => {
    render(
      <Mediacentre
        handleActionClick={vi.fn()}
        resources={[]}
        isError
        uai="0012345A"
      />,
    );

    expect(screen.getByTestId('mediacentre-error')).toBeInTheDocument();
    expect(
      screen.getByTestId('mediacentre-universalis-link'),
    ).toBeInTheDocument();
  });

  it('always renders the Universalis search', () => {
    render(
      <Mediacentre handleActionClick={vi.fn()} resources={mockResources} />,
    );

    expect(
      screen.getByTestId('mediacentre-universalis-link'),
    ).toBeInTheDocument();
  });

  it('disables the Universalis search when the school has no UAI', () => {
    render(
      <Mediacentre handleActionClick={vi.fn()} resources={mockResources} />,
    );

    expect(
      screen.getByTestId('mediacentre-universalis-search-input'),
    ).toBeDisabled();
  });

  it('opens the Universalis search with the query and the UAI', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const { user } = render(
      <Mediacentre
        handleActionClick={vi.fn()}
        resources={mockResources}
        uai="0012345A"
      />,
    );

    await user.type(
      screen.getByTestId('mediacentre-universalis-search-input'),
      'volcans{Enter}',
    );

    expect(openSpy).toHaveBeenCalledTimes(1);
    const url = new URL(openSpy.mock.calls[0][0] as string);
    expect(`${url.origin}${url.pathname}`).toBe(
      'https://www.universalis-edu.com/nomade/precherche/',
    );
    expect(url.searchParams.get('q')).toBe('volcans');
    expect(url.searchParams.get('uai')).toBe('0012345A');
    expect(url.searchParams.get('r')).toBe('www');
  });
});
