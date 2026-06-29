import { TextSkeleton } from '../../../../components';
import CommunityCard, { CommunityCardProps } from './Communities';
import { useCommunities } from './useCommunities';

export function CommunityCardContainer() {
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

  const mappedCommunities: NonNullable<CommunityCardProps['communitiesList']> =
    communities.map((community) => ({
      title: community.title,
      communityImage: community.communityImage ?? community.icon ?? '',
      nbNotifications: community.nbNotifications ?? community.notifications,
      onActionClick: () => undefined,
    }));

  return <CommunityCard communitiesList={mappedCommunities} />;
}

CommunityCardContainer.displayName = 'CommunityCardContainer';
