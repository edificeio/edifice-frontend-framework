import { ReactNode } from 'react';
import { useUser } from '../../../..';
import UserSpace from './UserSpace';

export function UserSpaceContainer({ children }: { children?: ReactNode }) {
  const { user, avatar, userDescription } = useUser();

  if (!user || !userDescription) return null;

  const name = user.username || '';
  const profile = userDescription.profiles?.[0] || 'Guest';

  return (
    <UserSpace name={name} profile={profile} avatar={avatar}>
      {children}
    </UserSpace>
  );
}

UserSpaceContainer.displayName = 'UserSpaceContainer';
