import { http, HttpResponse } from 'msw';

const mockSharing = {
  'thread.contrib': [
    'net-atos-entng-actualites-controllers-InfoController|unsubmit',
    'net-atos-entng-actualites-controllers-InfoController|createDraft',
    'net-atos-entng-actualites-controllers-InfoController|shareInfoSubmit',
    'net-atos-entng-actualites-controllers-InfoController|shareInfoRemove',
    'net-atos-entng-actualites-controllers-InfoController|shareInfo',
    'net-atos-entng-actualites-controllers-ThreadController|getThread',
    'net-atos-entng-actualites-controllers-InfoController|updateDraft',
    'net-atos-entng-actualites-controllers-InfoController|listInfosByThreadId',
    'net-atos-entng-actualites-controllers-InfoController|createPending',
    'net-atos-entng-actualites-controllers-InfoController|shareResourceInfo',
    'net-atos-entng-actualites-controllers-InfoController|submit',
  ],
  'thread.publish': [
    'net-atos-entng-actualites-controllers-InfoController|getInfoTimeline',
    'net-atos-entng-actualites-controllers-InfoController|createPublished',
    'net-atos-entng-actualites-controllers-InfoController|updatePending',
    'net-atos-entng-actualites-controllers-InfoController|unpublish',
    'net-atos-entng-actualites-controllers-InfoController|updatePublished',
    'net-atos-entng-actualites-controllers-InfoController|publish',
  ],
  'info.comment': [
    'net-atos-entng-actualites-controllers-CommentController|deleteComment',
    'net-atos-entng-actualites-controllers-CommentController|comment',
    'net-atos-entng-actualites-controllers-CommentController|updateComment',
  ],
  'thread.manager': [
    'net-atos-entng-actualites-controllers-ThreadController|shareResource',
    'net-atos-entng-actualites-controllers-ThreadController|updateThread',
    'net-atos-entng-actualites-controllers-InfoController|delete',
    'net-atos-entng-actualites-controllers-ThreadController|deleteThread',
    'net-atos-entng-actualites-controllers-ThreadController|shareThreadRemove',
    'net-atos-entng-actualites-controllers-ThreadController|shareThreadSubmit',
    'net-atos-entng-actualites-controllers-ThreadController|shareThread',
  ],
  'info.read': [
    'net-atos-entng-actualites-controllers-InfoController|getSingleInfo',
    'net-atos-entng-actualites-controllers-DisplayController|viewOldInfoById',
    'net-atos-entng-actualites-controllers-InfoController|getInfo',
    'net-atos-entng-actualites-controllers-InfoController|getInfoComments',
    'net-atos-entng-actualites-controllers-CommentController|getInfoComments',
    'net-atos-entng-actualites-controllers-InfoController|getInfoShared',
  ],
};

const mockShareResources = {
  actions: [
    {
      name: [
        'net-atos-entng-actualites-controllers-CommentController|getInfoComments',
        'net-atos-entng-actualites-controllers-InfoController|getInfo',
        'net-atos-entng-actualites-controllers-InfoController|getInfoComments',
        'net-atos-entng-actualites-controllers-InfoController|getSingleInfo',
        'net-atos-entng-actualites-controllers-InfoController|getInfoShared',
        'net-atos-entng-actualites-controllers-DisplayController|viewOldInfoById',
      ],
      displayName: 'info.read',
      type: 'RESOURCE',
    },
    {
      name: [
        'net-atos-entng-actualites-controllers-CommentController|deleteComment',
        'net-atos-entng-actualites-controllers-CommentController|comment',
        'net-atos-entng-actualites-controllers-CommentController|updateComment',
      ],
      displayName: 'info.comment',
      type: 'RESOURCE',
    },
  ],
  groups: {
    visibles: [
      {
        id: '326440-1692622333299',
        name: 'Personnels du groupe 00-Edifice.',
        groupDisplayName: null,
        structureName: null,
        labels: ['ProfileGroup', 'Visible', 'Group'],
      },
      {
        id: '92766-1510043922665',
        name: 'Enseignants du groupe Collège Charlemagne.',
        groupDisplayName: null,
        structureName: null,
        labels: ['ProfileGroup', 'Visible', 'Group'],
      },
      {
        id: '6aef49b6-c877-47f4-9f6c-48a1ebadc20a',
        name: 'Personnels de fonction DIRECTION.',
        groupDisplayName: null,
        structureName: 'Ecole Arthur Rimbaud',
        labels: ['FunctionGroup', 'FuncGroup', 'Visible', 'Group'],
      },
      {
        id: 'd58e5350-7726-4947-b0e1-753b736364b1',
        name: 'Personnels de fonction Direction.',
        groupDisplayName: null,
        structureName: 'Ecole Arthur Rimbaud',
        labels: ['FunctionGroup', 'FuncGroup', 'Visible', 'Group'],
      },
      {
        id: '59657-1434377022433',
        name: 'Élèves du groupe MS et GS.',
        groupDisplayName: null,
        structureName: 'Ecole Arthur Rimbaud',
        labels: ['ProfileGroup', 'Visible', 'Group'],
      },
      {
        id: '59656-1434377022433',
        name: 'Enseignants du groupe MS et GS.',
        groupDisplayName: null,
        structureName: 'Ecole Arthur Rimbaud',
        labels: ['ProfileGroup', 'Visible', 'Group'],
      },
      {
        id: '59690-1434377022494',
        name: 'Enseignants du groupe ULIS.',
        groupDisplayName: null,
        structureName: 'Ecole Arthur Rimbaud',
        labels: ['ProfileGroup', 'Visible', 'Group'],
      },
      {
        id: '7f5c1640-21ab-4e13-9563-5af26efcd8f5',
        name: 'enseignants Présences',
        groupDisplayName: 'enseignants Présences',
        structureName: null,
        labels: ['ManualGroup', 'Visible', 'Group'],
      },
    ],
    checked: {},
  },
  users: {
    visibles: [
      {
        id: 'a5d64f8f-f78f-4818-bf50-dcbdfd4a554a',
        login: 'baptiste.auguste',
        username: 'AUGUSTE Baptiste',
        lastName: 'AUGUSTE',
        firstName: 'Baptiste',
        profile: 'Student',
      },
      {
        id: '42c04999-94ef-4146-bb9b-97ea10dcdcbc',
        login: 'baran.auguste',
        username: 'AUGUSTE Baran',
        lastName: 'AUGUSTE',
        firstName: 'Baran',
        profile: 'Student',
      },
      {
        id: '134ff587-b83b-41ca-9cbe-d830a01b1fab',
        login: 'sevket.auguste',
        username: 'AUGUSTE Sevket',
        lastName: 'AUGUSTE',
        firstName: 'Sevket',
        profile: 'Relative',
      },
      {
        id: '530593b7-199c-4ed7-b542-5a88829dee26',
        login: 'ethan.avignon',
        username: 'AVIGNON Ethan',
        lastName: 'AVIGNON',
        firstName: 'Ethan',
        profile: 'Student',
      },
      {
        id: 'd81cfb43-7d16-49e6-bf24-bcae9886ad82',
        login: 'laurane.avignon',
        username: 'AVIGNON Laurane',
        lastName: 'AVIGNON',
        firstName: 'Laurane',
        profile: 'Student',
      },
      {
        id: '437e664a-5bc6-4793-b190-4681d1796357',
        login: 'mickael.avignon',
        username: 'AVIGNON Mickaël',
        lastName: 'AVIGNON',
        firstName: 'Mickaël',
        profile: 'Relative',
      },
      {
        id: 'e1a90286-1ad2-4700-ae13-36ae1806de15',
        login: 'danny.nota',
        username: 'NOTA Danny',
        lastName: 'NOTA',
        firstName: 'Danny',
        profile: 'Student',
      },
      {
        id: '2c7f6175-a781-4d07-9e93-0f8e8dbcc6b9',
        login: 'thierry.vermont',
        username: 'VERMONT Thierry',
        lastName: 'VERMONT',
        firstName: 'Thierry',
        profile: 'Teacher',
      },
    ],
    checked: {},
  },
  owner: 'b92e3d37-16b0-4ed9-b4c3-992091687132',
  rights: ['creator:b92e3d37-16b0-4ed9-b4c3-992091687132'],
};

export const handlers = [
  http.get('/actualites/rights/sharing', () => {
    return HttpResponse.json(mockSharing);
  }),
  http.get('/actualites/api/v1/rights/sharing', () => {
    return HttpResponse.json(mockSharing);
  }),
  http.get('/actualites/share/json/resource-1?search=', () => {
    return HttpResponse.json(mockShareResources);
  }),
  http.get('/actualites/api/v1/infos/resource-1/shares', () => {
    return HttpResponse.json(mockShareResources);
  }),
];
