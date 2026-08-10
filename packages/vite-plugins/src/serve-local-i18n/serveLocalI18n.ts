import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

export type ServeLocalI18nRoute = {
  /** Dev-server route to intercept, e.g. `/timeline/i18n`. */
  routePath: string;
  /** Path to the local i18n JSON file to serve, resolved against `rootDir`. */
  filePath: string;
};

export type ServeLocalI18nOptions = {
  routes: ServeLocalI18nRoute[];
  /** Base directory `filePath` is resolved against. Defaults to the Vite server root. */
  rootDir?: string;
};

/**
 * Dev-only middleware that serves local i18n JSON files on the given routes,
 * instead of letting the request hit the dev proxy (the remote backend).
 *
 * This is the canonical, multi-route form of a plugin that existed under three
 * different single-purpose signatures across Edifice frontends; each maps to
 * this one without any loss of behavior:
 * - a single hardcoded route with no `rootDir` param → one entry in `routes`.
 * - a single route with a `rootDir` param → one entry in `routes`, `rootDir` passed through.
 * - several routes sharing a `rootDir` → the native use case of this plugin.
 */
export function serveLocalI18n({
  routes,
  rootDir,
}: ServeLocalI18nOptions): Plugin {
  return {
    name: 'serve-local-i18n',
    apply: 'serve',
    configureServer(server) {
      const baseDir = rootDir ?? server.config.root ?? process.cwd();
      const resolvedRoutes = routes.map(({ routePath, filePath }) => ({
        routePath,
        filePath: resolve(baseDir, filePath),
      }));

      server.middlewares.use((req, res, next) => {
        const matchingRoute = resolvedRoutes.find(({ routePath }) =>
          req.url?.startsWith(routePath),
        );

        if (!matchingRoute) {
          next();
          return;
        }

        try {
          const fileContents = readFileSync(matchingRoute.filePath, 'utf-8');
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(fileContents);
        } catch (err) {
          next(err as Error);
        }
      });
    },
  };
}
