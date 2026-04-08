import { TextSkeleton } from '../../../../components';
import { LastInfosProps } from './LastInfos';
import { useLastInfos } from './useLastInfos';

export function LastInfosContainer() {
  const { infos, isLoading, error } = useLastInfos();

  return isLoading ? (
    <>
      <TextSkeleton size="lg" />
      <TextSkeleton size="lg" />
      <TextSkeleton size="lg" />
    </>
  ) : error ? (
    error.message
  ) : (
    infos?.map(
      ({ content, title, username, thread }) =>
        ({
          content,
          title,
          username,
          icon: thread.icon,
          thread: thread.title,
        }) satisfies LastInfosProps,
    )
  );
}

LastInfosContainer.displayName = 'LastInfosContainer';
