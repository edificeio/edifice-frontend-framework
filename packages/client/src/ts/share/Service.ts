import { IOdeServices } from '../services/OdeServices';
import { StringUtils } from '../utilities/StringUtils';

import { Bookmark, Group, User } from '../directory/interface';
import {
  GetResourceRightPayload,
  PutSharePayload,
  PutShareResponse,
  ShareMapping,
  ShareRight,
  ShareRightAction,
  ShareRightActionDisplayName,
  ShareRightWithVisibles,
  ShareSubject,
  ShareUrls,
  SharingRight,
} from './interface';

export class ShareService {
  //
  // IMPLEMENTATION
  //
  constructor(protected context: IOdeServices) {}

  get directory() {
    return this.context.directory();
  }
  get http() {
    return this.context.http();
  }
  get cache() {
    return this.context.cache();
  }

  private getSearchUrl(
    app: string,
    resourceId: string,
    searchText: string,
    urlResourceRights?: string,
  ) {
    if (!urlResourceRights) {
      return `/${app}/share/json/${resourceId}?search=${searchText}`;
    }
    if (urlResourceRights.includes('?search=')) {
      const [beforeSearch] = urlResourceRights.split('?search=');
      return `${beforeSearch}?search=${searchText}`;
    } else if (urlResourceRights.includes('?')) {
      return `${urlResourceRights}&search=${searchText}`;
    } else {
      return `${urlResourceRights}?search=${searchText}`;
    }
  }

  async searchShareSubjects(
    app: string,
    resourceId: string,
    searchText: string,
    urlResourceRights?: string,
  ): Promise<ShareSubject[]> {
    const cleanSearchText = StringUtils.removeAccents(searchText).toLowerCase();
    const getUrl = this.getSearchUrl(
      app,
      resourceId,
      searchText,
      urlResourceRights,
    );
    const response =
      await this.cache.httpGetJson<GetResourceRightPayload>(getUrl);
    const resUsers = response.users.visibles
      .filter(({ username, firstName, lastName, login }) => {
        const cleanLastName = StringUtils.removeAccents(
          lastName || '',
        ).toLowerCase();
        const cleanFirstName = StringUtils.removeAccents(
          firstName || '',
        ).toLowerCase();
        const cleanDisplayName = StringUtils.removeAccents(
          username || '',
        ).toLowerCase();
        const cleanLogin = StringUtils.removeAccents(login || '').toLowerCase();
        return (
          cleanDisplayName.includes(cleanSearchText) ||
          cleanFirstName.includes(cleanSearchText) ||
          cleanLastName.includes(cleanSearchText) ||
          cleanLogin.includes(cleanSearchText)
        );
      })
      .map((user) => {
        return {
          avatarUrl: this.directory.getAvatarUrl(user.id, 'user'),
          directoryUrl: this.directory.getDirectoryUrl(user.id, 'user'),
          displayName: user.username,
          id: user.id,
          profile: user.profile,
          type: 'user',
        } as ShareSubject;
      });
    const resGroups = response.groups.visibles
      .filter(({ name }) => {
        const cleanName = StringUtils.removeAccents(name || '').toLowerCase();
        return cleanName.includes(cleanSearchText);
      })
      .map((group) => {
        return {
          avatarUrl: this.directory.getAvatarUrl(group.id, 'group'),
          directoryUrl: this.directory.getDirectoryUrl(group.id, 'group'),
          displayName: group.name,
          id: group.id,
          type: 'group',
          structureName: group.structureName,
        } as ShareSubject;
      });
    const bookmarks: Bookmark[] = await this.directory.getBookMarks();
    const resBookmarks = bookmarks
      .filter(({ displayName }) => {
        const cleanName = StringUtils.removeAccents(
          displayName || '',
        ).toLowerCase();
        return cleanName.includes(cleanSearchText);
      })
      .map((bookmark) => {
        return {
          avatarUrl: '',
          directoryUrl: '',
          profile: '',
          displayName: bookmark.displayName,
          id: bookmark.id,
          type: 'sharebookmark',
        } as ShareSubject;
      });

    return [...resBookmarks, ...resUsers, ...resGroups];
  }

  async getShareMapping(
    app: string,
    urlShareMapping?: string,
  ): Promise<ShareMapping> {
    const sharingMap = await this.cache.httpGetJson<ShareMapping>(
      urlShareMapping || `/${app}/rights/sharing`,
    );
    //fix keys app.role => role
    for (const key of Object.keys(sharingMap)) {
      if (key.includes('.')) {
        const newKey = key.split('.')[1];
        const value = (sharingMap as any)[key];
        delete (sharingMap as any)[key];
        (sharingMap as any)[newKey] = value;
      }
    }
    return sharingMap;
  }

  getActionsAvailableFor(
    { id, type }: { id: string; type: 'user' | 'group' },
    payload: GetResourceRightPayload,
    mapping: ShareMapping,
  ): ShareRightActionDisplayName[] {
    // get rights affected to this user or group
    const usafeRights =
      type === 'user' ? payload.users.checked[id] : payload.groups.checked[id];
    const rights = usafeRights || [];
    // get normalized actions names
    const actions = Object.keys(mapping) as ShareRightActionDisplayName[];
    const actionAvailable: ShareRightActionDisplayName[] = [];
    // for each normalized action, check whether current user or group has right for it
    for (const action of actions) {
      const rightsForAction = mapping[action];
      const intersection = rightsForAction.filter((right) =>
        rights.includes(right),
      );
      if (intersection.length > 0) {
        actionAvailable.push(action);
      }
    }
    return actionAvailable;
  }

  async getRightsForResource(
    app: string,
    resourceId: string,
    shareUrls?: ShareUrls,
  ): Promise<ShareRightWithVisibles> {
    // fetch bookmarks
    const visibleBookmarks = await this.directory.getBookMarks();
    // get rights for this resources
    const getResourceRightsUrl = this.getSearchUrl(
      app,
      resourceId,
      '',
      shareUrls?.getResourceRights,
    );
    const rightsPayload =
      await this.cache.httpGetJson<GetResourceRightPayload>(
        getResourceRightsUrl,
      );
    // get mapping between rights and normalized rights
    const sharingMap = await this.getShareMapping(
      app,
      shareUrls?.getShareMapping,
    );
    // get normalized rights infos
    const sharingRights = await this.cache.httpGetJson<SharingRight>(
      '/infra/public/json/sharing-rights.json',
    );
    // generate rows for users
    const userRights = Object.keys(rightsPayload.users.checked)
      .map((userId) => {
        // find user info
        const user = rightsPayload.users.visibles.find(
          (user) => user.id === userId,
        );
        return user;
      })
      .filter((user) => {
        // remove if user not found
        return user !== undefined;
      })
      .map((user) => {
        // get normalized actions for user
        const actions = this.getActionsAvailableFor(
          { id: user!.id, type: 'user' },
          rightsPayload,
          sharingMap,
        );
        // generate ShareRight row
        const right: ShareRight = {
          id: user!.id,
          type: 'user',
          displayName: user!.username,
          profile: user!.profile,
          avatarUrl: this.directory.getAvatarUrl(user!.id, 'user'),
          directoryUrl: this.directory.getDirectoryUrl(user!.id, 'user'),
          actions: actions.map((action) => {
            const act = sharingRights[action];
            return {
              displayName: action,
              id: action,
              priority: act.priority,
            };
          }),
        };
        return right;
      })
      .sort((a, b) => {
        // sort by user name ASC
        return (a.displayName || '').localeCompare(b.displayName);
      });
    // generate rows for groups
    const groupRights = Object.keys(rightsPayload.groups.checked)
      .map((groupId) => {
        // find group info
        const group = rightsPayload.groups.visibles.find(
          (group) => group.id === groupId,
        );
        return group;
      })
      .filter((group) => {
        // remove if group not found
        return group !== undefined;
      })
      .map((group) => {
        // get normalized actions for group
        const actions = this.getActionsAvailableFor(
          { id: group!.id, type: 'group' },
          rightsPayload,
          sharingMap,
        );
        const right: ShareRight = {
          id: group!.id,
          type: 'group',
          displayName: group!.name,
          profile: undefined,
          avatarUrl: this.directory.getAvatarUrl(group!.id, 'group'),
          directoryUrl: this.directory.getDirectoryUrl(group!.id, 'group'),
          actions: actions.map((action) => {
            const act = sharingRights[action];
            return {
              displayName: action,
              id: action,
              priority: act.priority,
            };
          }),
        };
        return right;
      })
      .sort((a, b) => {
        // sort by group name ASC
        return (a.displayName || '').localeCompare(b.displayName);
      });
    const rights = [...userRights, ...groupRights];
    // prepare list of visible groups
    const visibleGroups = rightsPayload.groups.visibles.map(
      ({ groupDisplayName, id, name, labels }) => {
        const group: Group = {
          labels,
          displayName: groupDisplayName || name,
          id,
        };
        return group;
      },
    );
    // prepare list of visible user
    const visibleUsers = rightsPayload.users.visibles.map(
      ({ id, profile, username, firstName, lastName, login }) => {
        const user: User = {
          displayName: username,
          firstName,
          lastName,
          login,
          profile,
          id,
        };
        return user;
      },
    );
    return {
      rights,
      visibleBookmarks,
      visibleGroups,
      visibleUsers,
    };
  }

  async getPutSharePayload(
    app: string,
    rights: ShareRight[],
    urlGetShareMapping?: string,
  ): Promise<PutSharePayload> {
    const payload: PutSharePayload = {
      users: {},
      groups: {},
      bookmarks: {},
    };
    // get mapping between action and java names
    const mapping = await this.getShareMapping(app, urlGetShareMapping);

    for (const right of rights) {
      // get java rights for each available actions
      const duplicates = right.actions
        .map((action) => mapping[action.id])
        .reduce((previous, current) => {
          if (Array.isArray(current)) {
            return [...previous, ...current];
          }
          return previous;
        }, []);

      const rights = [...new Set(duplicates)];
      // for each user/group/bookmark add a record
      if (rights.length > 0) {
        if (right.type === 'user') {
          payload.users[right.id] = rights;
        } else if (right.type === 'group') {
          payload.groups[right.id] = rights;
        } else {
          payload.bookmarks[right.id] = rights;
        }
      }
    }

    return payload;
  }

  async saveRights(
    app: string,
    resourceId: string,
    rights: ShareRight[],
    urls?: ShareUrls,
  ): Promise<PutShareResponse> {
    const payload = await this.getPutSharePayload(
      app,
      rights,
      urls?.getShareMapping,
    );
    const putUrl =
      urls?.saveResourceRights || `/${app}/share/resource/${resourceId}`;

    const getUrl = this.getSearchUrl(
      app,
      resourceId,
      '',
      urls?.getResourceRights,
    );
    //clear cache for rights
    this.cache.clearCache(getUrl);
    const res = await this.http.putJson<PutShareResponse>(putUrl, payload);
    return res;
  }

  async getActionsForApp(
    app: string,
    urlShareMapping?: string,
  ): Promise<ShareRightAction[]> {
    // get normalized rights infos
    const sharingRights = await this.cache.httpGetJson<SharingRight>(
      '/infra/public/json/sharing-rights.json',
    );
    // get mapping for rights
    const sharingMap = await this.getShareMapping(app, urlShareMapping);
    const rightActions: ShareRightAction[] = Object.keys(sharingRights)
      .map((key) => {
        const value = sharingRights[key as ShareRightActionDisplayName];
        return {
          displayName: key as ShareRightActionDisplayName,
          id: key as ShareRightActionDisplayName,
          priority: value.priority,
          requires: value.requires,
        };
      })
      .filter((right) => {
        // if app does not manage this role => remove it
        if (sharingMap[right.id as ShareRightActionDisplayName]?.length > 0) {
          return true;
        }
        return false;
      })
      .sort((a, b) => {
        // sort by priority ASC
        return a.priority - b.priority;
      });
    return rightActions;
  }
}
