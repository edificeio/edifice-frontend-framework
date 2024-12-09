/**
 *
 * @param imageUrl : string
 * @returns workspace file path with timestamp
 */
export function addTimestampToImageUrl(imageUrl: string) {
  const timestamp = new Date().getTime();
  const separator = imageUrl.includes('?') ? '&' : '?';
  return `${imageUrl}${separator}timestamp=${timestamp}`;
}
