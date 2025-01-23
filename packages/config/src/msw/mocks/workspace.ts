import { http, HttpResponse } from 'msw';

export const handlers = [
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
      return HttpResponse.json([
        {
          _id: 'document-id-1',
          protected: true,
          eParent: null,
          name: 'document1.avif',
          metadata: {
            'name': 'file',
            'filename': 'document1.avif',
            'content-type': 'image/avif',
            'content-transfer-encoding': '7bit',
            'charset': 'UTF-8',
            'size': 27010,
          },
          file: 'file-id-1',
          application: 'app1',
          shared: [],
          inheritedShares: [],
          isShared: false,
          ancestors: [],
          created: '2023-11-22 11:12.49.795',
          modified: '2023-11-22 11:12.49.795',
          owner: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
          ownerName: 'User Name',
          eType: 'file',
        },
        {
          _id: 'document-id-2',
          protected: true,
          eParent: null,
          name: 'document2.png',
          metadata: {
            'name': 'file',
            'filename': 'document2.png',
            'content-type': 'image/png',
            'content-transfer-encoding': '7bit',
            'charset': 'UTF-8',
            'size': 600910,
          },
          file: 'file-id-2',
          application: 'app2',
          shared: [],
          inheritedShares: [],
          isShared: false,
          ancestors: [],
          created: '2024-01-16 11:36.06.896',
          modified: '2024-01-16 11:36.06.896',
          owner: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
          ownerName: 'User Name',
          eType: 'file',
          thumbnails: {
            '120x120': 'thumbnail-id-1',
            '150x150': 'thumbnail-id-2',
            '80x80': 'thumbnail-id-3',
          },
        },
        {
          _id: '9700d609-7a99-4e0f-97a8-7e76a5707775',
          created: '2024-04-26 17:07.01.586',
          modified: '2024-04-26 17:07.01.586',
          owner: 'f6c5ea40-5405-4cea-a755-8a0170bc6741',
          ownerName: 'admc clement',
          protected: false,
          name: 'filename2.mp4',
          metadata: {
            'content-type': 'video/mp4',
            'filename': 'filename2.mp4',
            'captation': true,
            'duration': 4500,
            'size': 1694150,
            'bitrate': 3404,
            'framerate': 30,
          },
          file: '5af20408-2797-4b28-b62z-98caa1020935',
          application: 'mediaLibrary',
          shared: [],
          inheritedShares: [],
          isShared: false,
          ancestors: [],
          eType: 'file',
          thumbnails: {
            '0x0': '15216f88-f32d-43da-b726-0f2e4c00f1b3',
          },
        },
        {
          _id: '3789d00e-7f3d-4db8-afc4-2aa114583e81',
          created: '2024-04-30 14:24.04.059',
          modified: '2024-04-30 14:24.04.059',
          owner: 'f6c5ea40-5405-4cea-a755-8a0170bc6741',
          ownerName: 'admc clement',
          protected: true,
          name: 'hi-simon.mp3',
          metadata: {
            'content-type': 'audio/mp3',
            'filename': 'hi-simon.mp3',
            'size': 61824,
          },
          file: 'c72e145a-8b14-45b3-9229-05fd38ae65a4',
          application: 'mediaLibrary',
          shared: [],
          inheritedShares: [],
          isShared: false,
          ancestors: [],
          eType: 'file',
        },
      ]);
    } else if (filter === 'protected') {
      return HttpResponse.json([
        {
          _id: '3789d00e-7f3d-4db8-afc4-2aa114583e81',
          created: '2024-04-30 14:24.04.059',
          modified: '2024-04-30 14:24.04.059',
          owner: 'f6c5ea40-5405-4cea-a755-8a0170bc6741',
          ownerName: 'admc clement',
          protected: true,
          name: 'my-audio.mp3',
          metadata: {
            'content-type': 'audio/mp3',
            'filename': 'my-audio.mp3',
            'size': 61824,
          },
          file: 'c72e145a-8b14-45b3-9229-05fd38ae65a4',
          application: 'mediaLibrary',
          shared: [],
          inheritedShares: [],
          isShared: false,
          ancestors: [],
          eType: 'file',
        },
        {
          _id: '4ec9e8a1-e436-4891-95b2-350477ab8892',
          protected: true,
          eParent: null,
          name: 'Capture d’écran 2023-12-05 à 09.50.17.png',
          metadata: {
            'name': 'file',
            'filename': 'Capture d’écran 2023-12-05 à 09.50.17.png',
            'content-type': 'image/png',
            'content-transfer-encoding': '7bit',
            'charset': 'UTF-8',
            'size': 612615,
          },
          file: 'cb1e34d1-419a-4d13-87db-bacb1c280512',
          application: 'blog',
          shared: [],
          inheritedShares: [],
          isShared: false,
          ancestors: [],
          created: '2024-01-16 12:47.00.112',
          modified: '2024-01-16 12:47.00.112',
          owner: 'f6c5ea40-5405-4cea-a755-8a0170bc6741',
          ownerName: 'admc clement',
          eType: 'file',
          thumbnails: {
            '120x120': '2fd0134d-595b-4319-bf31-24669e17a44f',
            '150x150': 'e9f78305-7971-43b9-8863-672599cdecde',
          },
        },
        {
          _id: '9700d609-7a99-4e0f-97a9-7e76a5707775',
          created: '2024-04-26 17:07.01.586',
          modified: '2024-04-26 17:07.01.586',
          owner: 'f6c5ea40-5405-4cea-a755-8a0170bc6741',
          ownerName: 'admc clement',
          protected: true,
          name: 'filename.mp4',
          metadata: {
            'content-type': 'video/mp4',
            'filename': 'filename.mp4',
            'captation': true,
            'duration': 4500,
            'size': 1694150,
            'bitrate': 3404,
            'framerate': 30,
          },
          file: '5af20408-2797-4b28-b62e-98caa1020935',
          application: 'mediaLibrary',
          shared: [],
          inheritedShares: [],
          isShared: false,
          ancestors: [],
          eType: 'file',
          thumbnails: {
            '0x0': '15216f88-f32d-43da-b726-0f2e4c00f1b2',
          },
        },
        {
          _id: 'e91bf95f-0d65-4d62-9191-332c2fb22db5',
          protected: true,
          eParent: null,
          name: 'Capture d’écran 2023-12-05 à 09.49.59.png',
          metadata: {
            'name': 'file',
            'filename': 'Capture d’écran 2023-12-05 à 09.49.59.png',
            'content-type': 'image/png',
            'content-transfer-encoding': '7bit',
            'charset': 'UTF-8',
            'size': 600910,
          },
          file: 'dbbcf579-02a9-4e03-b79b-a194b52a0e7f',
          application: 'blog',
          shared: [],
          inheritedShares: [],
          isShared: false,
          ancestors: [],
          created: '2024-01-16 12:47.12.256',
          modified: '2024-01-16 12:47.12.256',
          owner: 'f6c5ea40-5405-4cea-a755-8a0170bc6741',
          ownerName: 'admc clement',
          eType: 'file',
          thumbnails: {
            '120x120': '7a89eb98-7633-4308-8c78-491ed619409e',
            '150x150': 'f21f9c92-99ce-48f6-bce7-3cc177c95f11',
          },
        },
      ]);
    } else {
      return HttpResponse.json([]);
    }
  }),
];
