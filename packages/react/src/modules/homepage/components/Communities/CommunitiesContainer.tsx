import { useMemo } from 'react';
import { TextSkeleton } from '../../../../components';
import Communities, { CommunitiesProps } from './Communities';
import { CommunitiesModel, useCommunities } from './useCommunities';

export type CommunitiesContainerProps = {
  onCommunityClick?: (community: CommunitiesModel) => void;
  onHeaderActionClick: () => void;
};

export function CommunitiesContainer({
  onCommunityClick,
  onHeaderActionClick,
}: CommunitiesContainerProps) {
  const { communities, isLoading, error } = useCommunities();

  const mappedCommunities: NonNullable<CommunitiesProps['communitiesList']> =
    useMemo(
      () =>
        communities.map((community) => ({
          title: community.title,
          communityImage: community.communityImage ?? community.icon ?? '',
          nbNotifications: community.nbNotifications ?? community.notifications,
          onActionClick: () => onCommunityClick?.(community),
        })),
      [communities, onCommunityClick],
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
    return 'An error occurred while loading communities.';
  }

  return (
    <Communities
      communitiesList={mappedCommunities}
      handleActionClick={onHeaderActionClick}
    />
  );
}

CommunitiesContainer.displayName = 'CommunitiesContainer';
