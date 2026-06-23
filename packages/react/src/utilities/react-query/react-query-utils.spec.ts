import { QueryClient } from '@tanstack/react-query';

import { invalidateQueriesWithFirstPage } from './react-query-utils';

describe('invalidateQueriesWithFirstPage', () => {
  it('does nothing and returns undefined when no queryKey is provided', () => {
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const result = invalidateQueriesWithFirstPage(queryClient, {});

    expect(result).toBeUndefined();
    expect(invalidateSpy).not.toHaveBeenCalled();
  });

  it('invalidates the matching queries', () => {
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    invalidateQueriesWithFirstPage(queryClient, { queryKey: ['users'] });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['users'] });
  });

  it('keeps only the first page of infinite query data', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(['users'], {
      pages: [['a'], ['b'], ['c']],
      pageParams: [0, 1, 2],
    });

    invalidateQueriesWithFirstPage(queryClient, { queryKey: ['users'] });

    expect(queryClient.getQueryData(['users'])).toEqual({
      pages: [['a']],
      pageParams: [0],
    });
  });

  it('leaves non-infinite query data untouched', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(['count'], { value: 42 });

    invalidateQueriesWithFirstPage(queryClient, { queryKey: ['count'] });

    expect(queryClient.getQueryData(['count'])).toEqual({ value: 42 });
  });
});
