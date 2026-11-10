import { OfficeToolType } from './Tools';

const LOOL_CREATE_DOCUMENT_PATH = '/lool/document';

const OFFICE_TOOL_EXTENSIONS: Record<OfficeToolType, string> = {
  word: 'docx',
  powerpoint: 'pptx',
  excel: 'xlsx',
};

const FORBIDDEN_NAME_CHARS = /[/\\<>|]/g;

/**
 * Build the URL creating an office document with the LOOL connector.
 *
 * The connector creates the document in the user's workspace, then redirects
 * to its edition page: open it in a new tab.
 */
export const buildLoolCreateUrl = (
  type: OfficeToolType,
  name: string,
): string => {
  const params = new URLSearchParams({
    type: OFFICE_TOOL_EXTENSIONS[type],
    name: name.trim().replace(FORBIDDEN_NAME_CHARS, ''),
    protected: 'false',
  });
  return `${LOOL_CREATE_DOCUMENT_PATH}?${params.toString()}`;
};
