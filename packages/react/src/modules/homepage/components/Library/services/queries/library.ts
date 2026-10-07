import { queryOptions, useQuery } from '@tanstack/react-query';

import { LibraryBook, LibraryLoan } from '../../models';
import { libraryService } from '../api';

export const libraryQueryKeys = {
  all: () => ['library'] as const,
  selection: (feedUrl: string) =>
    [...libraryQueryKeys.all(), 'selection', feedUrl] as const,
  loans: (loansUrl: string) =>
    [...libraryQueryKeys.all(), 'loans', loansUrl] as const,
};

export const libraryQueryOptions = {
  getSelection(feedUrl: string) {
    return queryOptions({
      queryKey: libraryQueryKeys.selection(feedUrl),
      queryFn: (): Promise<LibraryBook[]> =>
        libraryService.getSelection(feedUrl),
    });
  },

  getLoans(loansUrl: string) {
    return queryOptions({
      queryKey: libraryQueryKeys.loans(loansUrl),
      queryFn: (): Promise<LibraryLoan[]> => libraryService.getLoans(loansUrl),
    });
  },
};

export const useLibrarySelection = (feedUrl: string) => {
  return useQuery(libraryQueryOptions.getSelection(feedUrl));
};

export const useLibraryLoans = (loansUrl: string) => {
  return useQuery(libraryQueryOptions.getLoans(loansUrl));
};
