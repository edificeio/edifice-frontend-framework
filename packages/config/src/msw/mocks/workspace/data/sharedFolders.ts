import { userInfo } from '../../../data/userinfo';
import { WorkspaceFolder } from '../workspace';

export const userContribRightInheritedShare = {
  'userId': userInfo.userId,
  'org-entcore-workspace-controllers-WorkspaceController|updateDocument': true,
};
export const folderOfUser = {
  _id: 'cdfc982f-421a-462f-9045-90f292bb3f33',
  owner: userInfo.userId,
  name: 'Images',
  isShared: true,
  inheritedShares: [userContribRightInheritedShare],
};

export const subFolderOfUser = {
  _id: 'ddfc982f-421a-462f-9045-90f292bb3f34',
  owner: userInfo.userId,
  name: 'Sub Images',
  eParent: 'cdfc982f-421a-462f-9045-90f292bb3f33',
  isShared: true,
  inheritedShares: [userContribRightInheritedShare],
};

export const folderOfOtherWithoutContribRights = {
  _id: '0d9ec0ee-97b5-4d33-b636-a4ca2ad1d332',
  owner: '1493a7fb-fb90-4acb-a1d8-7c579eba7583',
  ownerName: 'Jeanne Martin',
  name: 'Périscolaire',
  isShared: true,
  inheritedShares: [
    {
      'userId': '1493a7fb-fb90-4acb-a1d8-7c579eba7583',
      'org-entcore-workspace-controllers-WorkspaceController|updateDocument':
        true,
    },
  ],
};

export const subFolderOfOtherWithUserContribRights = {
  _id: 'bdab9120-2142-447a-94b0-382a34fecc06',
  name: 'ParaScolaire',
  inheritedShares: [userContribRightInheritedShare],
  owner: '1493a7fb-fb90-4acb-a1d8-7c579eba7583',
  ownerName: 'Jeanne Martin',
  eParent: '0d9ec0ee-97b5-4d33-b636-a4ca2ad1d332',
  isShared: true,
};

export const folderOfOtherWithUserContribRights = {
  _id: 'adab9120-2142-447a-94b0-382a34fecc05',
  name: "Lettres d'informations",
  inheritedShares: [userContribRightInheritedShare],
  owner: '971d1c4a-b784-4d0e-84d3-77efb70c4479',
  isShared: true,
};

export const folderOfOtherWithGroupContribRights = {
  _id: '6e5e644f-fc5c-4d10-bf2f-4540141f7d4c',
  name: 'Mathématiques',
  inheritedShares: [
    {
      'groupId': userInfo.groupsIds[1],
      'org-entcore-workspace-controllers-WorkspaceController|updateDocument':
        true,
    },
  ],
  owner: 'b92e3d37-16b0-4ed9-b4c3-992091687132',
  isShared: true,
};

export const sharedFolders: WorkspaceFolder[] = [
  folderOfUser,
  subFolderOfUser,
  folderOfOtherWithoutContribRights,
  subFolderOfOtherWithUserContribRights,
  folderOfOtherWithUserContribRights,
  folderOfOtherWithGroupContribRights,
];
