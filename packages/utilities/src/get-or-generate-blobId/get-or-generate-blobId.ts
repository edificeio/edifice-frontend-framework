import { StringUtils } from '../string-utils';

/**
 * Get or generate a virtual ID for a blob object.
 * Virtual ID is immutable once generated.
 *
 * @param blob the Blob or File
 * @param id (optional) Use this ID instead of generating one the first time.
 * @return the blog virtual ID
 */
export const getOrGenerateBlobId = (blob: Blob | File, id?: string) => {
  const KEY = 'virtualID';
  if (!Object.hasOwnProperty.apply(blob, [KEY])) {
    const value = id ?? `${StringUtils.generateVirtualId()}#${blob.size}`;
    Object.defineProperty(blob, KEY, {
      value,
      writable: false,
    });
  }
  return (blob as any)[KEY];
};
