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
  /** Whether the book is overdue, as stated by the library. Computed from the due date when omitted. */
  overdue?: boolean;
}

/**
 * Number of books borrowed by a child, displayed to a relative instead of the
 * detail of the child's loans.
 */
export interface LibraryChildLoans {
  /** Unique identifier of the child. */
  id: string;
  /** First name of the child. */
  firstName: string;
  /** Number of books currently borrowed by the child. */
  loansCount: number;
}

/**
 * Loans of the user: the detail of a student's loans, or the number of books
 * borrowed by each child of a relative.
 */
export interface LibraryLoansResponse {
  /** Books currently borrowed by the user. */
  loans: LibraryLoan[];
  /** Number of books borrowed by each child of the user. */
  children: LibraryChildLoans[];
}
