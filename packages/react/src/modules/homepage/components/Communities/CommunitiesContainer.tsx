import { useCallback, useMemo } from 'react';
import Communities, { CommunitiesProps } from './Communities';
import CommunitiesSkeleton from './CommunitiesSkeleton';
import { CommunitiesModel, useCommunities } from './useCommunities';

export type CommunitiesContainerProps = {
  /** Handle a click on a community. If undefined, the community's home page will be opened. */
  onCommunityClick?: (community: CommunitiesModel) => void;
  /** Handle a click on the header action button. If undefined, communities (or the community creation flow) will be opened. */
  onHeaderActionClick?: () => void;
};

export function CommunitiesContainer({
  onCommunityClick: handleCommunityClick = (community: CommunitiesModel) => {
    window.open(`/communities/id/${community.id}/home`, '_self');
  },
  onHeaderActionClick: handleHeaderActionClick,
}: CommunitiesContainerProps) {
  const { communities, isLoading, error } = useCommunities();

  const handleActionClick = useCallback(() => {
    if (handleHeaderActionClick) {
      handleHeaderActionClick();
      return;
    }

    window.open(
      communities.length > 0 ? '/communities' : '/communities/create/step-type',
      '_self',
    );
  }, [handleHeaderActionClick, communities.length]);

  const mappedCommunities: NonNullable<CommunitiesProps['communitiesList']> =
    useMemo(
      () =>
        communities.map((community) => ({
          title: community.title,
          communityImage: community.image ?? '',
          onActionClick: () => handleCommunityClick(community),
        })),
      [communities, handleCommunityClick],
    );

  if (isLoading) {
    return <CommunitiesSkeleton />;
  }

  if (error) {
    return 'An error occurred while loading communities.';
  }

  return (
    <Communities
      communitiesList={mappedCommunities}
      handleActionClick={handleActionClick}
    />
  );
}

CommunitiesContainer.displayName = 'CommunitiesContainer';
