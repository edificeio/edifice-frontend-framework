import { useDirectory, useUser } from '../../../../../hooks';
import { ScreenTimeKid } from '../types';

/**
 * Kids = `user.children` from the session. A user without children (a
 * student) is their own only kid.
 */
export function useScreenTimeKids(): ScreenTimeKid[] {
  const { user } = useUser();
  const { getAvatarURL } = useDirectory();

  if (!user) return [];

  const children = user.children as
    | Record<string, { firstName: string; lastName: string }>
    | undefined;
  const people = Object.entries(children ?? {});
  if (people.length === 0) people.push([user.userId, user]);

  return people.map(([id, { firstName, lastName }]) => ({
    id,
    firstName,
    lastName,
    displayName: `${firstName} ${lastName}`,
    avatarUrl: getAvatarURL(id, 'user'),
  }));
}
