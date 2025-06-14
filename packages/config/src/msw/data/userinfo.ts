export const userInfo = {
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
  userId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
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
};
