import type { Plugin } from 'vite';

export type RewriteToEntryOptions = {
  /** Dev-server URL to rewrite matching requests to, e.g. `/homepage.html`. */
  entry: string;
  /** Exact-match routes that should be rewritten. Defaults to `['/']`. */
  routes?: string[];
  /** Route prefixes (matched with `startsWith`) that should be rewritten. */
  prefixes?: string[];
};

/**
 * Dev-only middleware that rewrites requests for the given routes/prefixes to
 * a custom HTML entry point, for apps whose build has a non-`index.html`
 * entry (multi-page `rollupOptions.input`).
 */
export function rewriteToEntry({
  entry,
  routes = ['/'],
  prefixes = [],
}: RewriteToEntryOptions): Plugin {
  return {
    name: 'rewrite-to-entry',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const matches =
          (req.url !== undefined && routes.includes(req.url)) ||
          prefixes.some((prefix) => req.url?.startsWith(prefix));

        if (matches) {
          req.url = entry;
        }
        next();
      });
    },
  };
}
