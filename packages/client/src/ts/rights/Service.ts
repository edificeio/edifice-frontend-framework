import { IOdeServices } from '../services/OdeServices';
import { ResourceRight, RightRole, RightStringified } from './interface';

export class RightService {
  constructor(private context: IOdeServices) {}
  get session() {
    return this.context.session();
  }
  /**
   * Parse right concat as "$TYPE:$ID:$RIGHT"
   * $TYPE = user | group | creator
   * $ID: id of the resource
   * $RIGHT: read | contrib | manage
   *
   * @param right  a concat right
   * @returns Right parsed
   */
  parseResourceRight(right: RightStringified): ResourceRight | undefined {
    const parts = right.split(':');
    if (parts.length === 2) {
      if (parts[0] === 'creator') {
        return {
          id: parts[1],
          right: 'creator',
          type: 'creator',
        } as ResourceRight;
      }
    } else if (parts.length === 3) {
      return {
        id: parts[1],
        right: parts[2],
        type: parts[0],
      } as ResourceRight;
    } else {
      return undefined;
    }
  }
  /**
   * Parse an array of rights concat as "$TYPE:$ID:$RIGHT"
   * $TYPE = user | group | creator
   * $ID: id of the resource
   * $RIGHT: read | contrib | manage
   *
   * @param rights  a list of concat rights
   * @returns Array of Right parsed
   */
  parseResourceRights(rights: RightStringified[]): ResourceRight[] {
    const parsed = rights
      .map((right) => {
        return this.parseResourceRight(right);
      })
      .filter((right) => {
        return right !== undefined;
      }) as ResourceRight[];
    return parsed;
  }

  /**
   * Check wether a user has the expected right for a resource
   * @param user the userId and groupId concerned by the check
   * @param expect the expected right to check
   * @param rights array of Right for the resource
   * @returns true if has rights
   */
  hasResourceRight(
    { id, groupIds }: { id: string; groupIds: string[] },
    expect: RightRole,
    rights: ResourceRight[] | RightStringified[],
  ) {
    const safeRights = rights
      .map((right) => {
        if (typeof right === 'string') {
          return this.parseResourceRight(right);
        }
        return right;
      })
      .filter((right) => {
        return right !== undefined;
      }) as ResourceRight[];
    for (const right of safeRights) {
      if (right.id === id && right.type === 'creator') {
        return true;
      } else if (
        right.id === id &&
        right.type === 'user' &&
        right.right === expect
      ) {
        return true;
      } else if (
        groupIds.includes(right.id) &&
        right.type === 'group' &&
        right.right === expect
      ) {
        return true;
      }
    }
    return false;
  }
  /**
   * Check wether the current user have resource right
   * @param expect the expected right to check
   * @param rights array of Right for the resource
   * @returns true if has rights
   */
  async sessionHasResourceRight(
    expect: RightRole,
    rights: ResourceRight[] | RightStringified[],
  ): Promise<boolean> {
    try {
      const user = await this.session.getUser();
      return (
        !!user &&
        this.hasResourceRight(
          { groupIds: user.groupsIds, id: user.userId },
          expect,
          rights,
        )
      );
    } catch (e) {
      console.error(`Unexpected error ${e} in sessionHasResourceRight()`);
      return false;
    }
  }
  /**
   * Check wether the current user have at least one of resource right expected
   * @param expects array of expected right to check
   * @param rights array of Right for the resource
   * @returns true if has rights
   */
  async sessionHasAtLeastOneResourceRight(
    expects: RightRole[],
    rights: ResourceRight[] | RightStringified[],
  ): Promise<boolean> {
    for (const expect of expects) {
      const hasRight = await this.sessionHasResourceRight(expect, rights);
      if (hasRight) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check wether the current user has resource right for each right list
   * @param expect expected right to check
   * @param rightsArray array of array of Right for multiple resources
   * @returns true if has rights
   */
  async sessionHasResourceRightForEachList(
    expect: RightRole,
    rightsArray: ResourceRight[][] | RightStringified[][],
  ): Promise<boolean> {
    let count = 0;
    for (const rights of rightsArray) {
      const hasRight = await this.sessionHasResourceRight(expect, rights);
      if (hasRight) {
        count++;
      }
    }
    //each list has right
    if (count === rightsArray.length) {
      return true;
    }
    return false;
  }

  /**
   * Check wether the current user have at least one of resource right for each right list
   * @param expects array of expected right to check
   * @param rightsArray array of array of Right for multiple resources
   * @returns true if has rights
   */
  async sessionHasAtLeastOneResourceRightForEachList(
    expects: RightRole[],
    rightsArray: ResourceRight[][] | RightStringified[][],
  ): Promise<boolean> {
    for (const expect of expects) {
      let count = 0;
      for (const rights of rightsArray) {
        const hasRight = await this.sessionHasResourceRight(expect, rights);
        if (hasRight) {
          count++;
        }
      }
      //each list has right
      if (count === rightsArray.length) {
        return true;
      }
    }
    return false;
  }

  hasWorkflowRight(expect: string, right: string[]) {
    return (
      right.findIndex((workflowRight) => {
        return workflowRight === expect;
      }) !== -1
    );
  }

  /**
   * @param expect a workflow right
   * @returns true if current session has right on it
   */
  async sessionHasWorkflowRight(expect: string): Promise<boolean> {
    try {
      const user = await this.session.getUser();
      return (
        !!user &&
        this.hasWorkflowRight(
          expect,
          user.authorizedActions.map(
            (authorizedAction) => authorizedAction.name,
          ),
        )
      );
    } catch (e) {
      console.error(`Unexpected error ${e} in sessionHasWorkflowRight()`);
      return false;
    }
  }

  /**
   * @param expect a workflow right
   * @returns a record with right as key and boolean as value if current session has right on it
   */
  async sessionHasWorkflowRights(
    expects: string[],
  ): Promise<Record<string, boolean>> {
    const result: Record<string, boolean> = {};
    try {
      const user = await this.session.getUser();
      for (const expect of expects) {
        result[expect] =
          !!user &&
          this.hasWorkflowRight(
            expect,
            user.authorizedActions.map(
              (authorizedAction) => authorizedAction.name,
            ),
          );
      }
    } catch (e) {
      console.error(`Unexpected error ${e} in sessionHasWorkflowRights()`);
      for (const expect of expects) {
        result[expect] = false;
      }
    }
    return result;
  }
}
