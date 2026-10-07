import { render, screen } from '~/setup';
import { Library } from './Library';
import { LibraryBook, LibraryLoan } from './models';
import { parseRssFeed } from './services/api';

const books = [
  {
    id: 'book-1',
    title: '1984',
    author: 'George Orwell',
    cover: 'https://library.example.com/covers/1984.jpg',
    link: 'https://library.example.com/books/1984',
  },
  {
    id: 'book-2',
    title: 'Le Meilleur des mondes',
    author: 'Aldous Huxley',
  },
] satisfies Array<LibraryBook>;

const loans = [
  {
    id: 'loan-1',
    title: "Journal d'un dégonflé - Tome 3",
    cover: 'https://library.example.com/covers/loan.jpg',
    dueDate: '2099-04-30',
  },
] satisfies Array<LibraryLoan>;

const mockScrollMetrics = () => {
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(600);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300);
};

describe('Library', () => {
  it('renders the widget title', () => {
    render(<Library loans={loans} books={books} />);

    expect(
      screen.getByRole('heading', { name: 'Bibliothèque' }),
    ).toBeInTheDocument();
  });

  it('renders the "see more" button and calls the callback when clicked', async () => {
    const onSeeMoreClick = vi.fn();
    const { user } = render(
      <Library loans={loans} books={books} onSeeMoreClick={onSeeMoreClick} />,
    );

    const button = screen.getByTestId('home-card-header-action');
    expect(button).toHaveTextContent('Voir plus');

    await user.click(button);
    expect(onSeeMoreClick).toHaveBeenCalledTimes(1);
  });

  it('does not render the "see more" button when no callback is provided', () => {
    render(<Library loans={loans} books={books} />);

    expect(
      screen.queryByTestId('home-card-header-action'),
    ).not.toBeInTheDocument();
  });
});

describe('LibraryLoans', () => {
  it('renders the loans with their formatted due date', () => {
    render(<Library loans={loans} books={books} />);

    expect(
      screen.getByRole('heading', { name: 'Mes prêts' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Journal d'un dégonflé - Tome 3"),
    ).toBeInTheDocument();
    expect(screen.getByText('À rendre avant le 30/04')).toBeInTheDocument();
  });

  it('does not highlight a loan due in the future', () => {
    render(<Library loans={loans} books={books} />);

    expect(screen.getByText('À rendre avant le 30/04')).not.toHaveClass(
      'library-loan-due--overdue',
    );
  });

  it('highlights an overdue loan', () => {
    render(
      <Library
        loans={[{ id: 'loan-2', title: '1984', dueDate: '2020-01-15' }]}
        books={books}
      />,
    );

    expect(screen.getByText('À rendre avant le 15/01')).toHaveClass(
      'library-loan-due--overdue',
    );
  });

  it('hides the section when there is no loan', () => {
    render(<Library loans={[]} books={books} />);

    expect(
      screen.queryByRole('heading', { name: 'Mes prêts' }),
    ).not.toBeInTheDocument();
  });
});

describe('LibrarySelection', () => {
  it('renders the books with title and author', () => {
    render(<Library loans={loans} books={books} />);

    expect(
      screen.getByRole('heading', { name: 'Sélection du moment' }),
    ).toBeInTheDocument();
    expect(screen.getByText('1984')).toBeInTheDocument();
    expect(screen.getByText('George Orwell')).toBeInTheDocument();
    expect(screen.getByText('Le Meilleur des mondes')).toBeInTheDocument();
    expect(screen.getByText('Aldous Huxley')).toBeInTheDocument();
  });

  it('renders a book as an external link when it provides one', () => {
    render(<Library loans={loans} books={books} />);

    const link = screen.getByRole('link', { name: '1984' });
    expect(link).toHaveAttribute(
      'href',
      'https://library.example.com/books/1984',
    );
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('hides the section when there is no book', () => {
    render(<Library loans={loans} books={[]} />);

    expect(
      screen.queryByRole('heading', { name: 'Sélection du moment' }),
    ).not.toBeInTheDocument();
  });

  it('disables the previous button when the carousel is at the beginning', () => {
    mockScrollMetrics();
    render(<Library loans={loans} books={books} />);

    expect(screen.getByRole('button', { name: 'Précédent' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Suivant' })).toBeEnabled();
  });

  it('scrolls the carousel by one page when clicking the next button', async () => {
    mockScrollMetrics();
    const scrollBySpy = vi.fn();
    HTMLElement.prototype.scrollBy =
      scrollBySpy as unknown as typeof HTMLElement.prototype.scrollBy;

    const { user } = render(<Library loans={loans} books={books} />);

    await user.click(screen.getByRole('button', { name: 'Suivant' }));

    expect(scrollBySpy).toHaveBeenCalledWith({
      left: 300,
      behavior: 'smooth',
    });
  });
});

describe('parseRssFeed', () => {
  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
      <channel>
        <title>Sélection du CDI</title>
        <item>
          <title>1984</title>
          <link>https://library.example.com/books/1984</link>
          <guid>book-1984</guid>
          <dc:creator>George Orwell</dc:creator>
          <enclosure url="https://library.example.com/covers/1984.jpg" type="image/jpeg"/>
        </item>
        <item>
          <title>Le Meilleur des mondes</title>
          <link>https://library.example.com/books/le-meilleur-des-mondes</link>
          <author>Aldous Huxley</author>
          <enclosure url="https://library.example.com/extract.mp3" type="audio/mpeg"/>
          <media:thumbnail url="https://library.example.com/covers/le-meilleur-des-mondes.jpg"/>
        </item>
        <item>
          <title>Fahrenheit 451</title>
          <description>&lt;p&gt;&lt;img src="https://library.example.com/covers/fahrenheit-451.jpg"/&gt;Un roman de Ray Bradbury&lt;/p&gt;</description>
        </item>
      </channel>
    </rss>`;

  it('parses items into books', () => {
    const parsedBooks = parseRssFeed(rssFeed);

    expect(parsedBooks).toHaveLength(3);
    expect(parsedBooks[0]).toEqual({
      id: 'book-1984',
      title: '1984',
      author: 'George Orwell',
      cover: 'https://library.example.com/covers/1984.jpg',
      link: 'https://library.example.com/books/1984',
    });
  });

  it('falls back to the author element and the media thumbnail, skipping non-image enclosures', () => {
    const parsedBooks = parseRssFeed(rssFeed);

    expect(parsedBooks[1]).toEqual({
      id: 'https://library.example.com/books/le-meilleur-des-mondes',
      title: 'Le Meilleur des mondes',
      author: 'Aldous Huxley',
      cover: 'https://library.example.com/covers/le-meilleur-des-mondes.jpg',
      link: 'https://library.example.com/books/le-meilleur-des-mondes',
    });
  });

  it('falls back to the description image and generates an id when guid and link are missing', () => {
    const parsedBooks = parseRssFeed(rssFeed);

    expect(parsedBooks[2]).toEqual({
      id: 'library-book-2',
      title: 'Fahrenheit 451',
      author: undefined,
      cover: 'https://library.example.com/covers/fahrenheit-451.jpg',
      link: undefined,
    });
  });

  it('throws on an invalid feed', () => {
    expect(() => parseRssFeed('not an xml document')).toThrow(
      'Invalid RSS feed',
    );
  });
});
