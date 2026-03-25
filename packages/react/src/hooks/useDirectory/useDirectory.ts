import { ID, odeServices } from '@edifice.io/client';
import { AvatarType } from '../../types';

const useDirectory = () => {
  function getAvatarURL(userId: ID, type: AvatarType): string | undefined {
    if (userId === '') return undefined;
    return odeServices.directory().getAvatarUrl(userId, type);
  }

  function getUserbookURL(userId: ID, type: AvatarType): string {
    return odeServices.directory().getDirectoryUrl(userId, type);
  }

  return {
    getAvatarURL,
    getUserbookURL,
  };
};

export default useDirectory;
