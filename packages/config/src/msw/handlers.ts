import {
  actualitesHandlers,
  authHandlers,
  blogHandlers,
  commonHandlers,
  directoryHandlers,
  publicConfigHandlers,
  shareHandlers,
  themeHandlers,
  timelineHandlers,
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
  ...themeHandlers,
  ...wikiHandlers,
  ...publicConfigHandlers,
  ...shareHandlers,
  ...actualitesHandlers,
  ...timelineHandlers,
];
