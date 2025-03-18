import { IframeTransformer } from './interface';

/**
 * This transformer is used to transform the pad URL to the embed URL inside the iframe
 * The embed URL is used to create a session for the pad before redirecting to the pad url
 */
export class PadIframeTransformer implements IframeTransformer {
  // Define the pad path
  private padPath = '/pad/';
  // Define the embed path
  private embedPath = '/collaborativeeditor/embed/';
  onRenderHTML({ HTMLAttributes }) {
    try {
      // Get host URL from the current window
      const currentUrl = window.location.href.split('?')[0];
      const baseUrl = new URL(currentUrl).origin;
      // Get Iframe src URL
      const srcUrl = new URL(HTMLAttributes.src);
      const pathMatch = srcUrl.pathname.match(
        new RegExp(`^${this.padPath}(.+)$`),
      );
      // Check if the src URL is from the same origin and matches the pad path
      if (srcUrl.origin === baseUrl && pathMatch && pathMatch[1]) {
        // Extract pad ID from the URL
        const padId = pathMatch[1].replace(/^p\//i, '');
        // Create a new URL with the embed path
        const newUrl = new URL(`${baseUrl}${this.embedPath}${padId}`);
        // Copy search params from the src URL to the new URL
        srcUrl.searchParams.forEach((value, key) => {
          newUrl.searchParams.set(key, value);
        });
        // Set the new URL
        HTMLAttributes.src = newUrl.toString();
      }
    } catch (e) {
      console.error('Error transforming pad URL:', e);
    }
  }
}
