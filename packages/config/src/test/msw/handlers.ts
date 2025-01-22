import {
  authHandlers,
  blogHandlers,
  commonHandlers,
  directoryHandlers,
  publicConfigHandlers,
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
  ...themeHandlers,
  ...wikiHandlers,
  ...publicConfigHandlers,
];
