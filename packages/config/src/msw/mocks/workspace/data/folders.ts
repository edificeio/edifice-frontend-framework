import { userInfo } from '../../../data/userinfo';
import { WorkspaceFolder } from '../workspace';

export const userFolders: WorkspaceFolder[] = [
  {
    _id: '0576e0dd-129b-4244-b36a-49bda713d273',
    name: 'Travaux en classe',
    owner: userInfo.userId,
  },
  {
    _id: '50c1b81b-d8b7-4474-9d69-b5e441b31a8c',
    name: 'Edumedia',
    owner: userInfo.userId,
  },
  {
    _id: 'a1aac5c0-6bfe-4308-8c43-812378e2d9bf',
    name: 'Test',
    owner: userInfo.userId,
  },
  {
    _id: 'd1ce8d21-0c5f-4c2b-bdf4-b5da1b8b3b2e',
    name: 'Sub Test',
    owner: userInfo.userId,
    eParent: 'a1aac5c0-6bfe-4308-8c43-812378e2d9bf',
  },
];
