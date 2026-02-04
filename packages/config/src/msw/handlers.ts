import {
  actualitesHandlers,
  authHandlers,
  blogHandlers,
  commonHandlers,
  directoryHandlers,
  embedHandlers,
  publicConfigHandlers,
  shareHandlers,
  themeHandlers,
  userbookHandlers,
  wikiHandlers,
  workspaceHandlers,
} from './mocks';

export const handlers = [
  ...userbookHandlers,
  ...workspaceHandlers,
  ...authHandlers,
  ...blogHandlers,
  ...commonHandlers,
  ...directoryHandlers,
  ...embedHandlers,
  ...themeHandlers,
  ...wikiHandlers,
  ...publicConfigHandlers,
  ...shareHandlers,
  ...actualitesHandlers,
];
