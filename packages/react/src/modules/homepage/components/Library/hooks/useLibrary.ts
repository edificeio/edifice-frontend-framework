import { LibraryBook, LibraryChildLoans, LibraryLoan } from '../models';
import {
  useLibraryLoans,
  useLibrarySelection,
} from '../services/queries/library';

export interface UseLibraryProps {
  /** URL of the RSS feed listing the current books selection. */
  rssFeedUrl: string;
  /** URL of the endpoint returning the user's loans. */
  loansUrl: string;
}

export interface UseLibraryReturn {
  /** Books of the current selection. */
  books: LibraryBook[];
  /** Books currently borrowed by the user. */
  loans: LibraryLoan[];
  /** Number of books borrowed by each child, when the user is a relative. */
  childrenLoans: LibraryChildLoans[];
  /** Loading state of the selection and loans queries. */
  isLoading: boolean;
  /** Error state of the selection query. */
  selectionError: Error | null;
  /** Error state of the loans query. */
  loansError: Error | null;
}

/**
 * Custom hook providing the library widget data: the books selection coming
 * from an RSS feed and the user's current loans. A relative gets the number of
 * books borrowed by each child instead of loans.
 *
 * Each source is fetched independently so a failing one does not prevent the
 * other from being displayed.
 *
 * @returns Object containing books, loans, children loans, loading and error states.
 */
export const useLibrary = ({
  rssFeedUrl,
  loansUrl,
}: UseLibraryProps): UseLibraryReturn => {
  const selectionQuery = useLibrarySelection(rssFeedUrl);
  const loansQuery = useLibraryLoans(loansUrl);

  return {
    books: selectionQuery.data ?? [],
    loans: loansQuery.data?.loans ?? [],
    childrenLoans: loansQuery.data?.children ?? [],
    isLoading: selectionQuery.isLoading || loansQuery.isLoading,
    selectionError: selectionQuery.error,
    loansError: loansQuery.error,
  };
};
