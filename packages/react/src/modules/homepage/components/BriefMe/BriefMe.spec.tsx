import { render, screen } from '~/setup';
import BriefMe, { BriefMeArticle } from './BriefMe';

const articles: BriefMeArticle[] = [
  {
    id: '1',
    date: '8 juin 2026',
    title: 'La france en retard sur la transparence salariale',
    url: 'https://brief.me/article-1',
  },
];

describe('BriefMe', () => {
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

  it('calls handleActionClick when the open button is clicked', async () => {
    const handleActionClick = vi.fn();
    const { user } = render(
      <BriefMe
        handleActionClick={handleActionClick}
        status="default"
        category="briefme"
        onCategoryChange={vi.fn()}
        articles={articles}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Ouvrir' }));

    expect(handleActionClick).toHaveBeenCalledTimes(1);
  });

  it('calls onCategoryChange with the selected category', async () => {
    const onCategoryChange = vi.fn();
    const { user } = render(
      <BriefMe
        handleActionClick={vi.fn()}
        status="default"
        category="briefme"
        onCategoryChange={onCategoryChange}
        articles={articles}
      />,
    );

    await user.click(screen.getByTestId('segmented-option-brief-eco'));

    expect(onCategoryChange).toHaveBeenCalledWith('brief-eco');
  });

  it('does not render the category selector in the error status', () => {
    render(
      <BriefMe
        handleActionClick={vi.fn()}
        status="error"
        category="briefme"
        onCategoryChange={vi.fn()}
        articles={[]}
      />,
    );

    expect(
      screen.queryByTestId('segmented-option-briefme'),
    ).not.toBeInTheDocument();
  });

  it('renders the article list with a link per article in the default status', () => {
    render(
      <BriefMe
        handleActionClick={vi.fn()}
        status="default"
        category="briefme"
        onCategoryChange={vi.fn()}
        articles={articles}
      />,
    );

    const link = screen.getByRole('link', {
      name: 'La france en retard sur la transparence salariale',
    });
    expect(link).toHaveAttribute('href', 'https://brief.me/article-1');
  });

  it('keeps the category selector visible while loading', () => {
    render(
      <BriefMe
        handleActionClick={vi.fn()}
        status="loading"
        category="briefme"
        onCategoryChange={vi.fn()}
        articles={[]}
      />,
    );

    expect(screen.getByTestId('briefme-loading')).toBeInTheDocument();
    expect(screen.getByTestId('segmented-option-briefme')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('shows the empty message only in the empty status', () => {
    const { rerender } = render(
      <BriefMe
        handleActionClick={vi.fn()}
        status="default"
        category="briefme"
        onCategoryChange={vi.fn()}
        articles={articles}
      />,
    );

    expect(
      screen.queryByText('Il n’y a pas d’articles à afficher.'),
    ).not.toBeInTheDocument();

    rerender(
      <BriefMe
        handleActionClick={vi.fn()}
        status="empty"
        category="briefme"
        onCategoryChange={vi.fn()}
        articles={[]}
      />,
    );

    expect(
      screen.getByText('Il n’y a pas d’articles à afficher.'),
    ).toBeInTheDocument();
  });
});
