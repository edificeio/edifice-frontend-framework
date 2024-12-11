import { IUserDescription, IUserInfo } from '@edifice.io/client';
import { useEdificeClient } from '../../providers/EdificeClientProvider/EdificeClientProvider.hook';
import { useEdificeTheme } from '../../providers/EdificeThemeProvider/EdificeThemeProvider.hook';

export interface useUserProps {
  user: IUserInfo | undefined;
  avatar: string;
  userDescription: Partial<IUserDescription> | undefined;
}

export default function useUser(): useUserProps {
  const { user, userDescription } = useEdificeClient();
  const { theme } = useEdificeTheme();

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
