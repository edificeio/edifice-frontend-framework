import { MimeTypeUtils } from '@edifice.io/utilities';
import { WorkspaceElement } from '../services';

export type RoleMapperParams = {
  type: string;
  previewRole: boolean;
  extension?: string;
};

// Role mappers
const defaultMappers = {
  csv: function ({ type, extension }: RoleMapperParams) {
    return MimeTypeUtils.INSTANCE.isCsvLike(type, extension);
  },
  doc: function ({ type, extension }: RoleMapperParams) {
    if (MimeTypeUtils.INSTANCE.isWordLike(type, extension)) {
      return true;
    }
    return (
      type.indexOf('document') !== -1 && type.indexOf('wordprocessing') !== -1
    );
  },
  xls: function ({ type, extension }: RoleMapperParams) {
    if (MimeTypeUtils.INSTANCE.isExcelLike(type, extension)) {
      return true;
    }
    return (
      (type.indexOf('document') !== -1 && type.indexOf('spreadsheet') !== -1) ||
      type.indexOf('ms-excel') !== -1
    );
  },
  img: function ({ type }: RoleMapperParams) {
    return type.indexOf('image') !== -1;
  },
  pdf: function ({ type }: RoleMapperParams) {
    return type.indexOf('pdf') !== -1 || type === 'application/x-download';
  },
  ppt: function ({ type, extension }: RoleMapperParams) {
    if (MimeTypeUtils.INSTANCE.isPowerpointLike(type, extension)) {
      return true;
    }
    return (
      (type.indexOf('document') !== -1 &&
        type.indexOf('presentation') !== -1) ||
      type.indexOf('powerpoint') !== -1
    );
  },
  txt: function ({ type, extension }: RoleMapperParams) {
    return MimeTypeUtils.INSTANCE.isTxtLike(type, extension);
  },
  md: function ({ type, extension }: RoleMapperParams) {
    return MimeTypeUtils.INSTANCE.isMdLike(type, extension);
  },
  video: function ({ type }: RoleMapperParams) {
    return type.indexOf('video') !== -1;
  },
  audio: function ({ type }: RoleMapperParams) {
    return type.indexOf('audio') !== -1;
  },
  zip: function ({ type }: RoleMapperParams) {
    return (
      type.indexOf('zip') !== -1 ||
      type.indexOf('rar') !== -1 ||
      type.indexOf('tar') !== -1 ||
      type.indexOf('7z') !== -1
    );
  },
} as const;

export type Role = keyof typeof defaultMappers;
export type RoleMapper = (params: RoleMapperParams) => Role | undefined;

export abstract class DocumentHelper {
  // FIXME add edumedia support

  private static roleMappers: RoleMapper[] = [
    (params: RoleMapperParams): Role | undefined => {
      const keys: Role[] = Object.keys(defaultMappers) as Role[];
      return keys.find((key) => defaultMappers[key as unknown as Role](params));
    },
  ];

  /* Similar role notion as in infra-front > workspace > Model.ts */
  static getRole(doc: WorkspaceElement): Role | 'unknown' {
    return DocumentHelper.role(
      doc.metadata?.['content-type'],
      false,
      doc.metadata?.['extension'],
    );
  }

  /* Similar role notion as in infra-front > workspace > Model.ts */
  static role(
    contentType: string | undefined,
    previewRole: boolean = false,
    extension?: string,
  ): Role | 'unknown' {
    extension && (extension = extension.trim());
    if (!contentType) return 'unknown';
    if (!this.roleMappers) {
      console.warn('[DocumentHelper.role] should not have empty roles', this);
    }
    const params = { type: contentType, previewRole, extension };
    for (const roleMapper of this.roleMappers) {
      const role = roleMapper(params);
      if (role) {
        return role;
      }
    }
    return 'unknown';
  }
}
