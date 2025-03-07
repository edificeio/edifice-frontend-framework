/**
 * Identify the type of "user"
 */
export type RightSubject = 'user' | 'group' | 'creator';

/**
 * Identify the role of the right
 */
export type RightRole =
  | 'read'
  | 'contrib'
  | 'manager'
  | 'creator'
  | (string & {});

/**
 * Right of a resource
 */
export interface ResourceRight {
  type: RightSubject;
  id: string;
  right: RightRole;
}

/** FIXME */
export type RightStringified = string;
