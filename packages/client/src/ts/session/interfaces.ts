import { App } from '../globals';
import { WidgetName } from '../widget/interfaces';
import { session } from './Framework';

//-------------------------------------
export abstract class SessionFrameworkFactory {
  //-------------------------------------
  static instance(): ISessionFramework {
    return session;
  }
}

//-------------------------------------
export interface ISessionFramework {
  //-------------------------------------
  /** Initialize once before use. */
  initialize(): Promise<void>;

  /** The current user session. */
  session: ISession;

  /** Log the current user in. */
  login(
    email: string,
    password: string,
    rememberMe?: boolean,
    secureLocation?: boolean,
  ): Promise<void>;

  /** Close the current user session. */
  logout(): Promise<void>;
}

//-------------------------------------
export interface ILoginModel {
  //-------------------------------------
  email: string;
  password: string;
  rememberMe?: boolean;
  secureLocation?: boolean;
  /* Let's drop these old features.
  callBack?: string;
  details?: string;
  */
}

export interface GetUserProfileOptions {
  options?: any;
  params?: Record<string, any>;
}

//-------------------------------------
export interface ISession {
  //-------------------------------------
  /** Language code (2-letters) actually applied. */
  readonly currentLanguage: string;
  /** Truthy when no user is connected. */
  readonly notLoggedIn: boolean;
  /** Additional information about the connected user. */
  readonly description: IUserDescription;
  /** Additional profile user information. */
  readonly profile: UserProfile;
  /**
   * Get the connected user's avatar URL, or a default one.
   * Append a query parameter to this URL for it to get resized, for example "?thumbnail=48x48"
   */
  readonly avatarUrl: string;
  /** Basic information about the connected user. */
  readonly user: IUserInfo;
  /** Retrieve the current main app, @see ConfigureFramework.Platform.apps */
  readonly currentApp: App | null;
  /** Retrieve the lastest storage + quota information. */
  readonly latestQuotaAndUsage: Promise<IQuotaAndUsage>;

  hasWorkflow(workflowName: string): boolean;
  hasRight(resource: any, right: any): boolean;

  /** Get User Profile */
  getUserProfile({
    options,
    params,
  }: Partial<GetUserProfileOptions>): Promise<UserProfile>;

  /** Verify if the logged-in user has a valid email address. */
  getEmailValidationInfos(): Promise<IEmailValidationInfos>;
  /**
   * Send a 6-digits code to an email address to validate it.
   * => when resolved successfully, the email validation infos will switch to the "pending" state.
   */
  checkEmail(email: string): Promise<void>;
  /** Send a 6-digits code to the server to try validating the pending email address. */
  tryEmailValidation(code: string): Promise<IEmailValidationState>;

  /** Verify if the logged-in user has a valid phone number. */
  getMobileValidationInfos(): Promise<IMobileValidationInfos>;
  /**
   * Send a 6-digits code to a phone number to validate it.
   * => when resolved successfully, the phone number infos will switch to the "pending" state.
   */
  checkMobile(mobile: string): Promise<void>;
  /** Send a 6-digits code to the server to try validating the pending phone number. */
  tryMobileValidation(code: string): Promise<IMobileValidationState>;

  /** Start an MFA for the logged-in user, unless already pending or done. */
  getMfaInfos(): Promise<IMfaInfos>;
  /** Send a 6-digits code to the server to validate a pending MFA. */
  tryMfaCode(code: string): Promise<IMfaCodeState>;
}

export type Hobby = {
  visibility: 'PRIVE' | 'PUBLIC';
  category: 'sport' | 'cinema' | 'animals' | 'music' | 'places' | 'books';
  values: string;
};
export type School = {
  classes: Array<string>; // ["TPS"]
  id: string; // "09772a06-1362-4802-a475-66a87d9cb679"
  name: string; // "MY DEV SCHOOL"
  UAI: string; // "1111888G"
  exports: string[]; // ["GAR-P0"]
};
export type UserProfile = Array<
  'Student' | 'Teacher' | 'Relative' | 'Personnel' | 'Guest'
>;
//-------------------------------------
export interface IUserDescription {
  //-------------------------------------
  /*---- From /directory/userbook/_user_id_ ----*/
  alertSize: boolean;
  health: string; // "" ?
  hobbies: Array<Hobby>;
  mood:
    | 'default'
    | 'happy'
    | 'proud'
    | 'dreamy'
    | 'love'
    | 'tired'
    | 'angry'
    | 'worried'
    | 'sick'
    | 'joker'
    | 'sad';
  motto: string; // "Carpe diem"
  oldPicture?: string; // "/workspace/document/aaaabbbb-ccdd-dead-beef-0123456789ab"
  picture: string; // "no-avatar.jpg"
  quota: number; // 1048576000
  storage: number; // 106653578
  theme: string; // "default"
  type: string; // "USERBOOK";
  userid: string; // "12345678-9abc-def0-1234-56789abcdef0"

  /*---- From /userbook/api/person ----*/
  address: string;
  birthdate: string; // "1980-01-20"
  displayName: string; // "LASTNAME Firstname"
  email: string;
  id: string; // "12345678-9abc-def0-1234-56789abcdef0"
  login: string;
  mobile: string;
  photo: string; // "no-avatar.jpg"
  relatedId?: any; // null
  relatedName?: any; // null
  relatedType?: any; // null
  schools: Array<School>;
  tel: string;
  profiles: UserProfile; // NOTE: initial field name is "type", but it is renamed to "profiles" internally.
  userId: string; // "12345678-9abc-def0-1234-56789abcdef0"
  visibleInfos: Array<string>; // ["SHOW_BIRTHDATE"]
}

//-------------------------------------
export interface IQuotaAndUsage {
  //-------------------------------------
  /** Maximum use of the storage space. */
  quota: number;
  /** Current use of the storage space. */
  storage: number;
}

////////////////////////////////////////// LEGACY

//-------------------------------------
export interface IUserInfo {
  //-------------------------------------
  apps: Array<IWebApp>;
  authorizedActions: Array<IWorkflowAuth>;
  birthDate: string; // "1980-01-13"
  children: any;
  childrenIds: Array<string>;
  classNames: Array<string>;
  classes: Array<any>;
  deletePending: boolean;
  externalId: string;
  federated?: any;
  federatedIDP?: any;
  firstName: string;
  forceChangePassword?: any;
  functions: {
    ADMIN_LOCAL?: { code: string; scope: Array<string> };
    SUPER_ADMIN: { code: string; scope: Array<string> };
  };
  groupsIds: Array<string>;
  hasApp: boolean;
  hasPw: boolean;
  lastName: string;
  level: string;
  login: string;
  needRevalidateTerms: any;
  optionEnabled: Array<any>;
  preferences?: { save: (pref: any, data: any) => void };
  sessionMetadata: { _id: string; userId: string };
  structureNames: Array<string>;
  structures: Array<string>;
  type: 'ENSEIGNANT' | 'ELEVE' | 'PERSRELELEVE' | 'SUPERADMIN' | 'PERSEDUCNAT';
  uai: Array<any>;
  userId: string;
  username: string;
  widgets: Array<IWidgetModel>;
}

//-- Widgets position
export const WIDGET_POSITION = {
  LEFT: 'left',
  RIGHT: 'right',
  // TODO: position pourrait être étendu à d'autres valeurs: |“top” ou “bottom” ou “fixed”...
} as const;
export type WidgetPosition =
  (typeof WIDGET_POSITION)[keyof typeof WIDGET_POSITION];

//-------------------------------------
export interface IWidgetModel {
  //-------------------------------------
  application?: string; // "Actualites"
  position?: WidgetPosition;
  i18n: string; // "/actualites/public/widgets/last-infos-widget/i18n"
  id: string;
  js: string; // "/actualites/public/widgets/last-infos-widget/last-infos-widget.js"
  mandatory: boolean;
  name: WidgetName; // "last-infos-widget"
  path: string; // "/actualites/public/widgets/last-infos-widget/last-infos-widget.html"
}

//-------------------------------------
export interface IWebApp {
  //-------------------------------------
  address: string; // "/mindmap"
  casType?: string; // "null"
  display: boolean; // true
  displayName: string; // "mindmap"
  icon: string; // "mindmap-large"
  isExternal: boolean; // false
  name: string; // "Mindmap"
  prefix?: string; // "/mindmap"
  scope: Array<string>; // [""]
  target?: any; // "_blank"
  version?: string; // "BETA"
}

//-------------------------------------
export interface IWorkflowAuth {
  //-------------------------------------
  displayName: string;
  name: string;
  type: string;
}

//-------------------------------------
export interface IEmailValidationInfos {
  //-------------------------------------
  /** The current email address of the user (maybe not verified) */
  email: string;
  /** State of the current email address. */
  emailState: IEmailValidationState | null;
  /** Suggested time to wait for the validation mail to be sent (platform configuration) */
  waitInSeconds: number;
}
//-------------------------------------
export interface IEmailValidationState {
  //-------------------------------------
  /** Validation state */
  state: 'unchecked' | 'outdated' | 'pending' | 'valid';
  /** Last known valid email address, or empty string. */
  valid: string;
  /** (optional) Current pending (or outdated) email address being checked. */
  pending?: string;
  /** (optional) Seconds remaining for the user to type in the correct validation code. */
  ttl?: number;
  /** (optional) Remaining number of times a validation code can be typed in. */
  tries?: number;
}

//-------------------------------------
export interface IMobileValidationInfos {
  //-------------------------------------
  /** The current phone number of the user (maybe not verified) */
  mobile: string;
  /** State of the current phone number. */
  mobileState: IMobileValidationState | null;
  /** Suggested time to wait for the validation phone number to be sent (platform configuration) */
  waitInSeconds: number;
}
//-------------------------------------
export interface IMobileValidationState {
  //-------------------------------------
  /** Validation state */
  state: 'unchecked' | 'outdated' | 'pending' | 'valid';
  /** Last known valid phone number, or empty string. */
  valid: string;
  /** (optional) Current pending (or outdated) phone number being checked. */
  pending?: string;
  /** (optional) Seconds remaining for the user to type in the correct validation code. */
  ttl?: number;
  /** (optional) Remaining number of times a validation code can be typed in. */
  tries?: number;
}

//-------------------------------------
export interface IMfaInfos {
  //-------------------------------------
  /** The type of MFA used. */
  type: 'sms' | 'email';
  /** State of the generated MFA code. */
  state: IMfaCodeState | null;
  /** Suggested time to wait for the MFA code to be sent (platform configuration) */
  waitInSeconds: number;
}
//-------------------------------------
export interface IMfaCodeState {
  //-------------------------------------
  /** Validation state */
  state: 'outdated' | 'pending' | 'valid';
  /** (optional) Seconds remaining for the user to type in the correct code. */
  ttl?: number;
  /** (optional) Remaining number of times a code can be typed in. */
  tries?: number;
}

export interface IGetSession {
  user?: IUserInfo;
  currentLanguage?: string;
  quotaAndUsage: IQuotaAndUsage;
  userDescription: Partial<IUserDescription>;
  userProfile?: UserProfile;
  bookmarkedApps: IWebApp[];
}

export type PersonApiResult = {
  status: 'ok' | string;
  result: Array<IUserDescription>;
};
