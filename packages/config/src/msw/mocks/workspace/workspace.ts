import { delay, http, HttpResponse } from 'msw';
import { userInfo } from '../../data/userinfo';
import { userFolders } from './data/folders';
import {
  sharedFolders,
  userContribRightInheritedShare,
} from './data/sharedFolders';
import { protectedDocuments, userDocuments } from './data/documents';

const RESPONSE_DELAY = 500;

export interface WorkspaceFolder {
  _id: string;
  name: string;
  owner: string;
  eParent?: string;
  isShared?: boolean;
  inheritedShares?: Record<string, boolean | string>[];
}

export const handlers = [
  http.all('/workspace/*', async () => {
    await delay(RESPONSE_DELAY);
  }),
  http.get('/workspace/folders/list', async ({ request }) => {
    const url = new URL(request.url);
    const filter = url.searchParams.get('filter');
    if (filter === 'owner') {
      return HttpResponse.json(userFolders);
    }

    if (filter === 'shared') {
      return HttpResponse.json(sharedFolders);
    }
  }),

  http.get('/workspace/quota/user/91c22b66-ba1b-4fde-a3fe-95219cc18d4a', () => {
    return HttpResponse.json({ quota: 104857600, storage: 27683216 });
  }),
  http.get('/workspace/document/:id', ({ request }) => {
    const url = new URL(request.url);
    const thumbnail = url.searchParams.get('thumbnail');

    if (thumbnail !== '48x48') {
      return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
    }
    return HttpResponse.text('https://mdbcdn.b-cdn.net/img/new/avatars/4.webp');
  }),
  http.get('/workspace/documents', ({ request }) => {
    const url = new URL(request.url);
    const filter = url.searchParams.get('filter');

    // ?filter=owner&parentId=&includeall=true&_=1737038472943 => { filter: 'owner', parentId: '', includeall: 'true' }

    if (filter === 'owner') {
      return HttpResponse.json(userDocuments);
    } else if (filter === 'protected') {
      return HttpResponse.json(protectedDocuments);
    } else {
      return HttpResponse.json([]);
    }
  }),

  http.post('/workspace/folder', async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const parentFolderId = formData.get('parentFolderId') as string;

    if (!name.trim()) {
      return HttpResponse.json(
        { error: 'Folder name is required' },
        { status: 400 },
      );
    }

    const newFolder: WorkspaceFolder = {
      _id: `new-folder-${Date.now()}`,
      name,
      owner: userInfo.userId,
      eParent: parentFolderId,
      isShared: false,
      inheritedShares: [],
    };
    const inSharedFolder = sharedFolders.find(
      (folder) => folder._id === parentFolderId,
    );
    if (inSharedFolder) {
      newFolder.isShared = true;
      newFolder.inheritedShares = [userContribRightInheritedShare];
    }
    const folderToFeed = inSharedFolder ? sharedFolders : userFolders;

    folderToFeed.push(newFolder);
    return HttpResponse.json(newFolder, { status: 201 });
  }),
];
