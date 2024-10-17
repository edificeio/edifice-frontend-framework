import { IUserDescription, IUserInfo } from '@edifice.io/ts-client';
import { useOdeClient } from '../OdeClientProvider';
import { useOdeTheme } from '../ThemeProvider';

export interface useUserProps {
  user: IUserInfo | undefined;
  avatar: string;
  userDescription: Partial<IUserDescription> | undefined;
}

export default function useUser(): useUserProps {
  const { user, userDescription } = useOdeClient();
  const { theme } = useOdeTheme();

  function avatarUrl(): string {
    let avatar = userDescription?.picture;
    if (!avatar || avatar === 'no-avatar.jpg' || avatar === 'no-avatar.svg') {
      avatar = `${theme?.basePath}/img/illustrations/no-avatar.svg`;
    }
    return avatar;
  }

  return {
    user,
    avatar: avatarUrl(),
    userDescription,
  };
}
