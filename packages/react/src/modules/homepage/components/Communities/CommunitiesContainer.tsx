import { TextSkeleton } from '../../../../components';
import Communities, { CommunitiesProps } from './Communities';
import { useCommunities } from './useCommunities';

export function CommunitiesContainer() {
  const { communities, isLoading, error } = useCommunities();

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
    return error.message;
  }

  const mappedCommunities: NonNullable<CommunitiesProps['communitiesList']> =
    communities.map((community) => ({
      title: community.title,
      communityImage: community.communityImage ?? community.icon ?? '',
      nbNotifications: community.nbNotifications ?? community.notifications,
      onActionClick: () => undefined,
    }));

  return <Communities communitiesList={mappedCommunities} />;
}

CommunitiesContainer.displayName = 'CommunitiesContainer';
