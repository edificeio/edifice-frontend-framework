import { useCallback, useMemo } from 'react';
import Communities, { CommunitiesProps } from './Communities';
import CommunitiesSkeleton from './CommunitiesSkeleton';
import { CommunitiesModel, useCommunities } from './useCommunities';
import { useHasWorkflow } from 'src/hooks';

const COMMUNITY_ACCESS_WORKFLOW = 'community.access';
const COMMUNITY_CREATE_WORKFLOW = 'community.create';

const COMMUNITY_WORKFLOWS = [
  COMMUNITY_ACCESS_WORKFLOW,
  COMMUNITY_CREATE_WORKFLOW,
];

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
  // Undefined while the rights are loading, otherwise a map of workflow -> boolean.
  const rights = useHasWorkflow(COMMUNITY_WORKFLOWS) as
    | Record<string, boolean>
    | undefined;
  const canCreateCommunity = rights?.[COMMUNITY_CREATE_WORKFLOW] === true;
  const hasCommunitiesRight =
    canCreateCommunity || rights?.[COMMUNITY_ACCESS_WORKFLOW] === true;

  const { communities, isLoading, error } = useCommunities({
    enabled: hasCommunitiesRight,
  });

  const handleActionClick = useCallback(() => {
    if (handleHeaderActionClick) {
      handleHeaderActionClick();
      return;
    }

    window.open(
      communities.length === 0 && canCreateCommunity
        ? '/communities/create/step-type'
        : '/communities',
      '_self',
    );
  }, [handleHeaderActionClick, communities.length, canCreateCommunity]);

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

  if (rights === undefined || isLoading) {
    return <CommunitiesSkeleton />;
  }

  if (!hasCommunitiesRight) {
    return null;
  }

  if (error) {
    return 'An error occurred while loading communities.';
  }

  return (
    <Communities
      communitiesList={mappedCommunities}
      handleActionClick={handleActionClick}
      canCreateCommunity={canCreateCommunity}
    />
  );
}

CommunitiesContainer.displayName = 'CommunitiesContainer';
