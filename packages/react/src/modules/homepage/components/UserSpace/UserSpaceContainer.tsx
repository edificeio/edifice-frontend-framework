import { ReactNode } from 'react';
import { useUser } from '../../../..';
import UserSpace from './UserSpace';

export interface UserSpaceContainerProps {
  children?: ReactNode;
  onCustomizeWidgetsClick?: () => void;
}

export function UserSpaceContainer({
  children,
  onCustomizeWidgetsClick,
}: UserSpaceContainerProps) {
  const { user, avatar, userDescription } = useUser();

  if (!user || !userDescription) return null;

  const name = user.username || '';
  const profile = userDescription.profiles?.[0] || 'Guest';

  return (
    <UserSpace
      name={name}
      profile={profile}
      avatar={avatar}
      onCustomizeWidgetsClick={onCustomizeWidgetsClick}
    >
      {children}
    </UserSpace>
  );
}

UserSpaceContainer.displayName = 'UserSpaceContainer';
