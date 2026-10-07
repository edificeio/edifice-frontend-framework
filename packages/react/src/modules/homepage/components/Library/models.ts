/**
 * A book from the library selection RSS feed.
 */
export interface LibraryBook {
  /** Unique identifier of the book (RSS `guid`, `link` or generated). */
  id: string;
  /** Title of the book. */
  title: string;
  /** Author of the book. */
  author?: string;
  /** URL of the book cover image. */
  cover?: string;
  /** Link to the book details page. */
  link?: string;
}

/**
 * A book currently borrowed by the user.
 */
export interface LibraryLoan {
  /** Unique identifier of the loan. */
  id: string;
  /** Title of the borrowed book. */
  title: string;
  /** URL of the book cover image. */
  cover?: string;
  /** Date the book must be returned, in ISO format. i.e. "2026-04-30" */
  dueDate: string;
}
