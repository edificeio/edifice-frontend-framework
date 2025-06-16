import { IUserInfo, IWebApp } from '@edifice.io/client';

import { libraryMaps } from '@edifice.io/utilities';
import { useEdificeClient } from '../../providers/EdificeClientProvider/EdificeClientProvider.hook';

/**
 * Search for Library app in userinfo apps and return Library URL as a string.
 *
 * @returns the Library URL as a string. Returns null if no library was found in user apps.
 */
const useLibraryUrl = (appCodeName?: string): string | null => {
  const { user, appCode } = useEdificeClient();

  const appCodeToUse = (appCodeName ?? appCode) as string;
  const appName = libraryMaps[appCodeToUse];

  // get library app from userinfo apps
  const libraryApp: IWebApp | undefined = (user as IUserInfo)?.apps.find(
    (app) => app.isExternal && app.address.includes('library'),
  );

  if (!libraryApp) {
    return null;
  }

  // libraryUrl from userinfo.apps is like: https://libraryhost?platformURL=userPlatformURL
  const libraryUrlSplit = libraryApp.address?.split('?');
  if (!libraryUrlSplit || libraryUrlSplit.length < 2) {
    return null;
  }

  let libraryHost = libraryUrlSplit[0];
  // add a "/" to library host if not already there
  if (!libraryHost.endsWith('/')) {
    libraryHost = `${libraryHost}/`;
  }

  const platformURLParam = libraryUrlSplit?.[1];
  const searchParams = `application%5B0%5D=${appName}&page=1&sort_field=views&sort_order=desc`;

  return `${libraryHost}search/?${platformURLParam}&${searchParams}`;
};

export default useLibraryUrl;
