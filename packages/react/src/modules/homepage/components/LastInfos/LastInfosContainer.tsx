import { LastInfosProps } from './LastInfos';
import { LastInfosList } from './LastInfosList';
import { useLastInfos } from './useLastInfos';

export function LastInfosContainer() {
  const { infos, isLoading, error } = useLastInfos();

  return isLoading ? (
    <LastInfosList infos={[]} isLoading />
  ) : error ? (
    error.message
  ) : (
    <LastInfosList
      infos={
        infos?.map(
          ({
            id,
            content,
            title,
            username,
            thread,
            modifiedDate,
            headline: isHeadline,
          }) =>
            ({
              id,
              content,
              title,
              username,
              icon: thread.icon,
              threadId: thread.id,
              threadName: thread.title,
              publicationDate: modifiedDate,
              isHeadline,
            }) satisfies LastInfosProps,
        ) ?? []
      }
    />
  );
}

LastInfosContainer.displayName = 'LastInfosContainer';
