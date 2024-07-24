import {
  ID,
  IUserDescription,
  IUserInfo,
  odeServices,
} from "edifice-ts-client";

export interface useUserProps {
  user: IUserInfo | undefined;
  avatar: string;
  userDescription: Partial<IUserDescription> | undefined;
}

export const useDirectory = () => {
  function getAvatarURL(userId: ID, type: "user" | "group"): string {
    return odeServices.directory().getAvatarUrl(userId, type);
  }

  function getUserbookURL(userId: ID, type: "user" | "group"): string {
    return odeServices.directory().getDirectoryUrl(userId, type);
  }

  return {
    getAvatarURL,
    getUserbookURL,
  };
};
