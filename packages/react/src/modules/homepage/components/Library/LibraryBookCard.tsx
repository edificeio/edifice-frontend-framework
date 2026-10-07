import { IconLibrary } from '../../../icons/components';
import { LibraryBook } from './models';

export interface LibraryBookCardProps {
  /** Book to display. */
  book: LibraryBook;
}

/**
 * A book of the library selection: cover, title and author.
 * Rendered as an external link when the book provides one.
 */
const LibraryBookCard = ({ book }: LibraryBookCardProps) => {
  const content = (
    <>
      <div className="library-book-card-cover">
        {book.cover ? (
          <img
            src={book.cover}
            alt=""
            loading="lazy"
            className="library-book-card-cover-image"
          />
        ) : (
          <IconLibrary width={32} height={32} aria-hidden="true" />
        )}
      </div>
      <div className="library-book-card-caption">
        <span className="library-book-card-title">{book.title}</span>
        {book.author && (
          <span className="library-book-card-author">{book.author}</span>
        )}
      </div>
    </>
  );

  if (book.link) {
    return (
      <a
        className="library-book-card"
        href={book.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={book.title}
      >
        {content}
      </a>
    );
  }

  return <article className="library-book-card">{content}</article>;
};

LibraryBookCard.displayName = 'LibraryBookCard';

export default LibraryBookCard;
