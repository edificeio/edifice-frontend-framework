import { IWebApp } from '@edifice.io/client';

import { useEdificeClient } from '../../providers/EdificeClientProvider/EdificeClientProvider.hook';

export default function useBookmark(): IWebApp[] | undefined {
  const { sessionQuery } = useEdificeClient();

  const set = new Set();
  const bookmarkedApps = sessionQuery?.data?.bookmarkedApps.filter(
    (el: { displayName: unknown }) => {
      const duplicate = set.has(el.displayName);
      set.add(el.displayName);
      return !duplicate;
    },
  );

  return bookmarkedApps;
}
