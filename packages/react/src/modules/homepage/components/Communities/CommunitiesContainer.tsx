import { useMemo } from 'react';
import { TextSkeleton } from '../../../../components';
import Communities, { CommunitiesProps } from './Communities';
import { useCommunities } from './useCommunities';

export function CommunitiesContainer() {
  const { communities, isLoading, error } = useCommunities();

  const mappedCommunities: NonNullable<CommunitiesProps['communitiesList']> =
    useMemo(
      () =>
        communities.map((community) => ({
          title: community.title,
          communityImage: community.communityImage ?? community.icon ?? '',
          nbNotifications: community.nbNotifications ?? community.notifications,
          onActionClick: () => undefined,
        })),
      [communities],
    );

  if (isLoading) {
    return (
      <>
        <TextSkeleton size="lg" />
        <TextSkeleton size="lg" />
        <TextSkeleton size="lg" />
      </>
    );
  }

  if (error) {
    return (error.message, 'An error occurred while loading communities.');
  }

  return (
    <Communities
      communitiesList={mappedCommunities}
      handleActionClick={() => {}}
    />
  );
}

CommunitiesContainer.displayName = 'CommunitiesContainer';
