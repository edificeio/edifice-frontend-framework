import { ResourceRight, odeServices, type RightRole } from '@edifice.io/client';

export interface IObjectWithRights {
  rights: string[];
}

type Roles = RightRole | RightRole[];

interface UseHasRightsProps {
  roles: Roles;
  rights:
    | string
    | string[]
    | IObjectWithRights
    | IObjectWithRights[]
    | undefined;
}

const convertToArray = (rights: string | string[]) =>
  rights instanceof Array ? rights : [rights];

const checkRightForMultipleResources = async (
  roles: Roles,
  rights: ResourceRight[][] | string[][],
) => {
  const can = Array.isArray(roles)
    ? await odeServices
        .rights()
        .sessionHasAtLeastOneResourceRightForEachList(roles, rights)
    : await odeServices
        .rights()
        .sessionHasResourceRightForEachList(roles, rights);
  return can;
};

const checkRights = async (roles: Roles, rights: string | string[]) => {
  const safeRights = convertToArray(rights);
  const can = Array.isArray(roles)
    ? await odeServices
        .rights()
        .sessionHasAtLeastOneResourceRight(roles, safeRights)
    : await odeServices.rights().sessionHasResourceRight(roles, safeRights);
  return can;
};

const checkHasRights = async ({ roles, rights }: UseHasRightsProps) => {
  if (roles === undefined) {
    return;
  }
  if (Array.isArray(rights)) {
    if (rights.length > 0) {
      if (typeof rights[0] === 'string') {
        const can = await checkRights(roles, rights as string[]);
        return can;
      } else {
        const rightsArray = (rights as IObjectWithRights[]).map(
          (right) => right.rights,
        );
        const can = await checkRightForMultipleResources(roles, rightsArray);
        return can;
      }
    } else {
      return false;
    }
  } else {
    if (typeof rights === 'string') {
      const can = await checkRights(roles, rights);
      return can;
    } else if (rights) {
      const can = await checkRights(roles, rights.rights);
      return can;
    }
  }
};

export const checkUserRight = async (
  rights: UseHasRightsProps['rights'],
  additionalRoles?: RightRole | RightRole[],
) => {
  const defaultRoles: Roles = ['contrib', 'creator', 'manager', 'read'];
  let roles: Roles = defaultRoles;

  if (Array.isArray(additionalRoles)) {
    roles = [...roles, ...additionalRoles];
  } else if (additionalRoles) {
    roles = [...roles, additionalRoles];
  }

  const userRights: Record<RightRole, boolean> = {
    creator: false,
    contrib: false,
    manager: false,
    read: false,
  };

  for (const role of roles) {
    const hasRight = (await checkHasRights({
      roles: role,
      rights: rights,
    })) as boolean;
    userRights[role] = hasRight;
  }

  return userRights;
};
