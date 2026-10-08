import { render, screen } from '~/setup';
import { Rss, RssProps } from './Rss';
import { RssArticle, RssFeed } from './types';

const feeds: RssFeed[] = [
  { title: 'Le Monde', link: 'https://www.lemonde.fr/rss/une.xml' },
  { title: 'Eduscol', link: 'https://eduscol.education.fr/rss.xml' },
];

const articles: RssArticle[] = [
  {
    title: 'Premier article',
    link: 'https://www.lemonde.fr/article/1',
    description: '<p>Un <strong>extrait</strong> en HTML</p>',
    pubDate: 'Tue, 21 Jul 2026 08:00:00 +0200',
  },
];

const renderRss = (props: Partial<RssProps> = {}) =>
  render(
    <Rss
      feeds={feeds}
      selectedIndex={0}
      onSelectFeed={vi.fn()}
      articles={articles}
      articlesStatus="success"
      onEditClick={vi.fn()}
      {...props}
    />,
  );

describe('Rss', () => {
  it('opens the feeds management from the "Ajouter" button when no feed is set', async () => {
    const onEditClick = vi.fn();
    const { user } = renderRss({ feeds: [], onEditClick });

    expect(screen.queryByTestId('rss-button-edit')).not.toBeInTheDocument();
    await user.click(screen.getByTestId('rss-button-add'));

    expect(onEditClick).toHaveBeenCalledTimes(1);
  });

  it('opens the feeds management from the edit button when feeds are set', async () => {
    const onEditClick = vi.fn();
    const { user } = renderRss({ onEditClick });

    expect(screen.queryByTestId('rss-button-add')).not.toBeInTheDocument();
    await user.click(screen.getByTestId('rss-button-edit'));

    expect(onEditClick).toHaveBeenCalledTimes(1);
  });

  it('marks only the selected feed as pressed and selects a feed on click', async () => {
    const onSelectFeed = vi.fn();
    const { user } = renderRss({ selectedIndex: 1, onSelectFeed });

    expect(screen.getByTestId('rss-button-feed-0')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByTestId('rss-button-feed-1')).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByTestId('rss-button-feed-0'));

    expect(onSelectFeed).toHaveBeenCalledWith(0);
  });

  it('links each article to its page in a new tab', () => {
    renderRss();

    const article = screen.getByTestId('rss-link-article-0');
    expect(article).toHaveAttribute('href', 'https://www.lemonde.fr/article/1');
    expect(article).toHaveAttribute('target', '_blank');
    expect(article).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the HTML description as plain text', () => {
    renderRss();

    expect(screen.getByText('Un extrait en HTML')).toBeInTheDocument();
  });

  it('formats the publication date as a full calendar date', () => {
    renderRss();

    expect(screen.getByText('mardi 21 juillet 2026')).toBeInTheDocument();
  });

  it('shows the no-articles state when the feed has no article', () => {
    renderRss({ articles: [] });

    expect(screen.getByText('Pas d’articles à afficher')).toBeInTheDocument();
  });

  it('shows the error state when the feed cannot be read', () => {
    renderRss({ articlesStatus: 'error' });

    expect(
      screen.getByText(/ne semble pas être un flux RSS valide/),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('rss-link-article-0')).not.toBeInTheDocument();
  });

  it('shows a skeleton while the articles are loading', () => {
    renderRss({ articlesStatus: 'loading' });

    expect(screen.getByTestId('rss-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('rss-link-article-0')).not.toBeInTheDocument();
  });

  it('shows only a skeleton, without actions, while the feeds are loading', () => {
    renderRss({ feeds: [], isLoading: true });

    expect(screen.getByTestId('rss-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('rss-button-add')).not.toBeInTheDocument();
    expect(screen.queryByTestId('rss-button-edit')).not.toBeInTheDocument();
  });
});
