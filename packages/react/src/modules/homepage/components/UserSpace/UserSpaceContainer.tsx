import { ReactNode } from 'react';
import { useUser } from '../../../..';
import { HomeCard } from '../HomeCard';
import UserSpace from './UserSpace';

export function UserSpaceContainer({ children }: { children?: ReactNode }) {
  const { user, avatar, userDescription } = useUser();

  if (!user || !userDescription) return null;

  const name = user.username || '';
  const profile = userDescription.profiles?.[0] || 'Guest';

  return (
    <HomeCard variant="user">
      <HomeCard.Content>
        <UserSpace name={name} profile={profile} avatar={avatar} />
        {children}
      </HomeCard.Content>
    </HomeCard>
  );
}

UserSpaceContainer.displayName = 'UserSpaceContainer';
