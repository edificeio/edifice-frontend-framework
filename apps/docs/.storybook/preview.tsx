import { Preview } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HttpResponse, http } from 'msw';
import { initialize, mswLoader } from 'msw-storybook-addon';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import '../../../packages/bootstrap/dist/index.css';
import {
  EdificeClientProvider,
  EdificeThemeProvider,
} from '../../../packages/react/src/providers';

import i18n from '../i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const preview: Preview = {
  beforeAll: async () => {
    // Initialize MSW
    initialize({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: './mockServiceWorker.js',
      },
    });
  },
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      name: 'theme',
      description: 'Select theming',
      defaultValue: 'one',
      toolbar: {
        icon: 'switchalt',
        items: ['one', 'neo', 'side-by-side'],
      },
    },
    app: {
      defaultValue: 'wiki',
    },
  },
  parameters: {
    viewMode: 'docs',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Introduction',
          ['Welcome', 'Getting Started', '*'],
          'Design System',
          'Components',
          ['Base', '*'],
          'Forms',
          'Hooks',
          'Client',
          'Layout',
          'Modules',
        ],
      },
    },
    msw: {
      handlers: {
        config: [
          http.get('/blog/conf/public', () => {
            return HttpResponse.json({
              ID_SERVICE: {
                default: 2,
              },
              LIBELLE_SERVICE: {
                default: 'PRODUCTION_COLLABORATIVE',
              },
            });
          }),
          http.get(`/wiki/conf/public`, () => {
            return HttpResponse.json({
              ID_SERVICE: {
                default: 2,
              },
              LIBELLE_SERVICE: {
                default: 'PRODUCTION_COLLABORATIVE',
              },
            });
          }),
        ],
        userbook: [
          http.get('/userbook/preference/rgpdCookies', () => {
            return HttpResponse.json({ preference: '{"showInfoTip":false}' });
          }),
          http.get('/userbook/api/person', () => {
            return HttpResponse.json({
              status: 'ok',
              result: [
                {
                  id: 'user-id',
                  login: 'user.login',
                  displayName: 'User Name',
                  type: ['Teacher'],
                  visibleInfos: [],
                  schools: [
                    {
                      exports: null,
                      classes: [],
                      name: 'School Name',
                      id: 'school-id',
                      UAI: null,
                    },
                  ],
                  relatedName: null,
                  relatedId: null,
                  relatedType: null,
                  userId: 'user-id',
                  motto: '',
                  photo: '/userbook/avatar/user-id',
                  mood: 'default',
                  health: '',
                  address: '',
                  email: '',
                  tel: null,
                  mobile: '',
                  birthdate: '2023-09-25',
                  hobbies: [],
                },
              ],
            });
          }),
          http.get('/userbook/preference/language', () => {
            return HttpResponse.json({
              preference: { 'default-domaine': 'en' },
            });
          }),
          http.get('/userbook/preference/apps', () => {
            return HttpResponse.json({
              preference: '{"bookmarks":[],"applications":["Blog"]}',
            });
          }),
        ],
        theme: [
          http.get('/theme', () => {
            return HttpResponse.json({
              template: '/public/template/portal.html',
              logoutCallback: '',
              skin: '/assets/themes/cg77/skins/default/',
              themeName: 'cg77',
              skinName: 'default',
            });
          }),
          http.get('/assets/theme-conf.js', () => {
            return HttpResponse.json({
              overriding: [
                {
                  parent: 'theme-open-ent',
                  child: 'cg77',
                  skins: ['default', 'dyslexic'],
                  help: '/help-2d',
                  bootstrapVersion: 'ode-bootstrap-one',
                  edumedia: {
                    uri: 'https://www.edumedia-sciences.com',
                    pattern: 'uai-token-hash-[[uai]]',
                    ignoreSubjects: ['n-92', 'n-93'],
                  },
                },
                {
                  parent: 'panda',
                  child: 'cg771d',
                  skins: [
                    'circus',
                    'desert',
                    'neutre',
                    'ocean',
                    'panda-food',
                    'sparkly',
                    'default',
                    'monthly',
                  ],
                  help: '/help-1d',
                  bootstrapVersion: 'ode-bootstrap-one',
                  edumedia: {
                    uri: 'https://junior.edumedia-sciences.com',
                    pattern: 'uai-token-hash-[[uai]]',
                  },
                },
              ],
            });
          }),
        ],
        directory: [
          http.get('/directory/userbook/f6c5ea40', () => {
            return HttpResponse.json({
              mood: 'default',
              health: '',
              alertSize: false,
              storage: 27683216,
              type: 'USERBOOK',
              userid: 'f6c5ea40',
              picture: '/userbook/avatar/f6c5ea40',
              quota: 104857600,
              motto: '',
              theme: 'default',
              hobbies: [],
            });
          }),
        ],
        workspace: [
          http.get('/workspace/quota/user/f6c5ea40', () => {
            return HttpResponse.json({ quota: 104857600, storage: 27683216 });
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
                  owner: 'user-id',
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
                  owner: 'user-id',
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
        ],
        default: [
          http.get('/resources-applications', () => {
            return HttpResponse.json(['blog', 'wiki']);
          }),

          http.get('/locale', () => {
            return HttpResponse.json({ locale: 'en' });
          }),

          http.get('/auth/oauth2/userinfo', () => {
            return HttpResponse.json({
              classNames: null,
              level: '',
              login: 'user.login',
              lastName: 'Last Name',
              firstName: 'First Name',
              externalId: 'external-id',
              federated: null,
              birthDate: '2023-09-25',
              forceChangePassword: null,
              needRevalidateTerms: false,
              deletePending: false,
              username: 'user.name',
              type: 'USER_TYPE',
              hasPw: true,
              functions: {
                SUPER_ADMIN: {
                  code: 'SUPER_ADMIN',
                  scope: null,
                },
              },
              groupsIds: ['group-id-1', 'group-id-2'],
              federatedIDP: null,
              optionEnabled: [],
              userId: 'user-id',
              structures: ['structure-id'],
              structureNames: ['Structure Name'],
              uai: [],
              hasApp: false,
              ignoreMFA: true,
              classes: [],
              authorizedActions: [
                {
                  name: 'org.entcore.blog.controllers.FoldersController|add',
                  displayName: 'blog.createFolder',
                  type: 'SECURED_ACTION_WORKFLOW',
                },
                {
                  name: 'org.entcore.blog.controllers.FoldersController|list',
                  displayName: 'blog.listFolders',
                  type: 'SECURED_ACTION_WORKFLOW',
                },
                {
                  name: 'org.entcore.blog.controllers.BlogController|print',
                  displayName: 'blog.print',
                  type: 'SECURED_ACTION_WORKFLOW',
                },
                {
                  name: 'org.entcore.blog.controllers.BlogController|blog',
                  displayName: 'blog.view',
                  type: 'SECURED_ACTION_WORKFLOW',
                },
                {
                  name: 'org.entcore.blog.controllers.FoldersControllerProxy|list',
                  displayName: 'blog.listFolders',
                  type: 'SECURED_ACTION_WORKFLOW',
                },
                {
                  name: 'org.entcore.blog.controllers.BlogController|list',
                  displayName: 'blog.list',
                  type: 'SECURED_ACTION_WORKFLOW',
                },
                {
                  name: 'org.entcore.blog.controllers.FoldersControllerProxy|add',
                  displayName: 'blog.createFolder',
                  type: 'SECURED_ACTION_WORKFLOW',
                },
                {
                  name: 'org.entcore.workspace.controllers.WorkspaceController|listDocuments',
                  displayName: 'workspace.documents.list',
                  type: 'SECURED_ACTION_WORKFLOW',
                },
                {
                  name: 'org.entcore.workspace.controllers.WorkspaceController|listFolders',
                  displayName: 'workspace.document.list.folders',
                  type: 'SECURED_ACTION_WORKFLOW',
                },
                {
                  name: 'org.entcore.workspace.controllers.WorkspaceController|addDocument',
                  displayName: 'workspace.document.add',
                  type: 'SECURED_ACTION_WORKFLOW',
                },
              ],
              apps: [
                {
                  name: 'App1',
                  address: '/app1',
                  icon: 'app1-icon',
                  target: '',
                  displayName: 'App 1',
                  display: true,
                  prefix: '/app1',
                  casType: null,
                  scope: [''],
                  isExternal: false,
                },
                {
                  name: 'App2',
                  address: '/app2',
                  icon: 'app2-icon',
                  target: '',
                  displayName: 'App 2',
                  display: true,
                  prefix: '/app2',
                  casType: null,
                  scope: [''],
                  isExternal: false,
                },
              ],
              childrenIds: [],
              children: {},
              widgets: [],
              sessionMetadata: {},
            });
          }),
          http.get('/applications-list', () => {
            return HttpResponse.json({
              apps: [
                {
                  name: 'Blog',
                  address: '/blog',
                  icon: 'blog-large',
                  target: '',
                  displayName: 'blog',
                  display: true,
                  prefix: '/blog',
                  casType: null,
                  scope: [''],
                  isExternal: false,
                },
                {
                  name: 'Wiki',
                  address: '/wiki',
                  icon: 'wiki-large',
                  target: '',
                  displayName: 'wiki',
                  display: true,
                  prefix: '/wiki',
                  casType: null,
                  scope: [''],
                  isExternal: false,
                },
              ],
            });
          }),
        ],
        wiki: http.get('/wiki/listallpages', () => {
          return HttpResponse.json([
            {
              _id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              title: 'Sample Wiki',
              pages: [
                {
                  _id: 'b2c3d4e5-f6a7-8901-bcde-f1234567890a',
                  title: 'Page One',
                  contentPlain: 'Sample content',
                  author: 'c3d4e5f6-a7b8-9012-cdef-1234567890ab',
                  authorName: 'Jane Doe',
                  modified: {
                    $date: 1700000000000,
                  },
                  contentVersion: 1,
                  jsonContent: {
                    type: 'doc',
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            text: 'This is a sample paragraph.',
                          },
                        ],
                      },
                    ],
                  },
                  position: 0,
                  parentId: null,
                },
                {
                  _id: 'd4e5f6a7-b8c9-0123-def0-4567890abc12',
                  title: 'Video Page',
                  contentPlain: '',
                  author: 'e5f6a7b8-c9d0-1234-ef01-67890abc1234',
                  authorName: 'John Smith',
                  modified: {
                    $date: 1700000001000,
                  },
                  contentVersion: 1,
                  jsonContent: {
                    type: 'doc',
                    content: [
                      {
                        type: 'video',
                        attrs: {
                          textAlign: 'left',
                          src: '/workspace/document/abcdef12-3456-7890-abcd-ef1234567890',
                          controls: 'true',
                          documentId: 'abcdef12-3456-7890-abcd-ef1234567890',
                          isCaptation: 'true',
                          videoResolution: '350x197',
                          width: '350',
                          height: '197',
                        },
                      },
                    ],
                  },
                  position: 3,
                  parentId: null,
                },
                {
                  _id: 'f6a7b8c9-d0e1-2345-f012-34567890abcd',
                  title: 'Content Page',
                  contentPlain: 'Sample plain text content.',
                  author: 'g7h8i9j0-k1l2-3456-m789-0123456789ab',
                  authorName: 'Alice Brown',
                  modified: {
                    $date: 1700000002000,
                  },
                  contentVersion: 1,
                  jsonContent: {
                    type: 'doc',
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            text: 'More sample text.',
                          },
                        ],
                      },
                      {
                        type: 'heading',
                        attrs: {
                          textAlign: 'left',
                          level: 2,
                        },
                        content: [
                          {
                            type: 'text',
                            text: 'Sample Heading',
                          },
                        ],
                      },
                      {
                        type: 'paragraph',
                        attrs: {
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  color: null,
                                  fontSize: '18px',
                                  lineHeight: null,
                                  fontFamily: null,
                                },
                              },
                            ],
                            text: 'Stylized text.',
                          },
                        ],
                      },
                      {
                        type: 'paragraph',
                        attrs: {
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  color: null,
                                  fontSize: '16px',
                                  lineHeight: null,
                                  fontFamily: null,
                                },
                              },
                            ],
                            text: 'More ',
                          },
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  color: '#7C2C96',
                                  fontSize: '16px',
                                  lineHeight: null,
                                  fontFamily: null,
                                },
                              },
                            ],
                            text: 'important text',
                          },
                        ],
                      },
                    ],
                  },
                  position: 4,
                  parentId: null,
                },
                {
                  _id: 'h8i9j0k1-l2m3-4567-n890-1234567890ab',
                  title: 'Create Page',
                  contentPlain: '123456',
                  author: 'i9j0k1l2-m3n4-5678-o901-234567890abc',
                  authorName: 'Bob Green',
                  modified: {
                    $date: 1700000003000,
                  },
                  lastContributer: 'j0k1l2m3-n4o5-6789-p012-34567890abcd',
                  lastContributerName: 'Carol White',
                  contentVersion: 1,
                  jsonContent: {
                    type: 'doc',
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            text: '123456',
                          },
                        ],
                      },
                    ],
                  },
                  position: 1,
                  parentId: 'b2c3d4e5-f6a7-8901-bcde-f1234567890a',
                },
                {
                  _id: 'k1l2m3n4-o5p6-7890-q123-4567890abcde',
                  title: 'New Wiki',
                  author: 'l2m3n4o5-p6q7-8901-r234-567890abcdef',
                  authorName: 'Dave Black',
                  modified: {
                    $date: 1700000004000,
                  },
                  created: {
                    $date: 1700000004000,
                  },
                  contentVersion: 1,
                  jsonContent: {
                    type: 'doc',
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          textAlign: 'left',
                        },
                      },
                    ],
                  },
                  contentPlain: '',
                  position: 5,
                  parentId: null,
                },
                {
                  _id: 'm3n4o5p6-q7r8-9012-s345-67890abcdefg',
                  title: 'Test Page',
                  author: 'n4o5p6q7-r8s9-0123-t456-7890abcdefg1',
                  authorName: 'Eve Grey',
                  modified: {
                    $date: 1700000005000,
                  },
                  created: {
                    $date: 1700000005000,
                  },
                  contentVersion: 1,
                  jsonContent: {
                    type: 'doc',
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            text: 'Sample test content.',
                          },
                        ],
                      },
                    ],
                  },
                  contentPlain: 'Sample test content.',
                  position: 6,
                  parentId: null,
                },
                {
                  _id: 'o5p6q7r8-s9t0-1234-u567-890abcdefghi',
                  title: 'Another Page',
                  author: 'p6q7r8s9-t0u1-2345-v678-90abcdefghi2',
                  authorName: 'Frank Yellow',
                  modified: {
                    $date: 1700000006000,
                  },
                  created: {
                    $date: 1700000006000,
                  },
                  contentVersion: 1,
                  jsonContent: {
                    type: 'doc',
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          textAlign: 'left',
                        },
                      },
                    ],
                  },
                  contentPlain: '',
                  position: 7,
                  parentId: null,
                },
              ],
              thumbnail:
                '/workspace/document/abcdef12-3456-7890-abcd-ef1234567890',
              modified: {
                $date: 1700000007000,
              },
              owner: {
                userId: 'q7r8s9t0-u1v2-3456-w789-0123456789ab',
                displayName: 'George Blue',
              },
              shared: [
                {
                  'userId': 'r8s9t0u1-v2w3-4567-x890-1234567890ab',
                  'net-atos-entng-wiki-controllers-WikiController|getPage':
                    true,
                  'net-atos-entng-wiki-controllers-WikiController|listPages':
                    true,
                  'net-atos-entng-wiki-controllers-WikiController|getWiki':
                    true,
                  'net-atos-entng-wiki-controllers-WikiController|comment':
                    true,
                },
                {
                  'userId': 's9t0u1v2-w3x4-5678-y901-234567890abc',
                  'net-atos-entng-wiki-controllers-WikiController|listRevisions':
                    true,
                  'net-atos-entng-wiki-controllers-WikiController|getPage':
                    true,
                  'net-atos-entng-wiki-controllers-WikiController|listPages':
                    true,
                  'net-atos-entng-wiki-controllers-WikiController|createPage':
                    true,
                  'net-atos-entng-wiki-controllers-WikiController|getWiki':
                    true,
                  'net-atos-entng-wiki-controllers-WikiController|updatePage':
                    true,
                  'net-atos-entng-wiki-controllers-WikiController|comment':
                    true,
                  'net-atos-entng-wiki-controllers-WikiController|getRevisionById':
                    true,
                  'net-atos-entng-wiki-controllers-WikiController|updatePageList':
                    true,
                },
              ],
              description: 'This is a sample description.',
            },
          ]);
        }),
        blog: http.get('/blog/linker', () => {
          return HttpResponse.json(null);
        }),
      },
    },
  },
  // Provide the MSW addon loader globally
  loaders: [mswLoader],
  decorators: [
    (Story, context) => {
      /**
       * App value default to "one"
       */
      const theme = context.globals.theme;
      /**
       * App value default to "wiki"
       */
      const app = context.globals.app;

      const StoryTheme = ({ themePath }: { themePath: string }) => {
        return (
          <div data-product={themePath} className="my-12">
            <Story />
          </div>
        );
      };

      const renderStoryTheme = () => {
        switch (theme) {
          case 'side-by-side': {
            return (
              <>
                <StoryTheme themePath="one" />
                <StoryTheme themePath="neo" />
              </>
            );
          }
          case 'one': {
            return <StoryTheme themePath="one" />;
          }
          case 'neo': {
            return <StoryTheme themePath="neo" />;
          }
          case 'default': {
            return <StoryTheme themePath={theme} />;
          }
        }
      };

      return (
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <EdificeClientProvider
              params={{
                app,
              }}
            >
              <EdificeThemeProvider defaultTheme="none">
                {renderStoryTheme()}
              </EdificeThemeProvider>
            </EdificeClientProvider>
          </I18nextProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export default preview;
