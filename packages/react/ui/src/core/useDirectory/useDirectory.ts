import { ID, odeServices } from "edifice-ts-client";

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
