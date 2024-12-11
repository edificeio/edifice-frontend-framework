/**
 * Get the thumbnail query string for an image source
 * @param src Image source
 * @param width Width of the thumbnail (0 if you when to keep the aspect ratio and only set the height)
 * @param height Height of the thumbnail (0 if you when to keep the aspect ratio and only set the width)
 * @returns Image source with the thumbnail query string
 */
export function getThumbnail(
  src: string,
  width: number = 0,
  height: number = 0,
): string {
  if (!src.includes('data:image') && !src.includes('thumbnail')) {
    src =
      src +
      (src.includes('?') ? '&thumbnail=' : '?thumbnail=') +
      `${width}x${height}`;
  }
  return src;
}
