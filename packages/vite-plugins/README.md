# Edifice Vite Plugins

![npm](https://img.shields.io/npm/v/@edifice.io/vite-plugins?style=flat-square)
![bundlephobia](https://img.shields.io/bundlephobia/min/@edifice.io/vite-plugins?style=flat-square)

Shared Vite plugins and config helpers used by Edifice frontend modules in their `vite.config.ts` —
dev-server proxy to a recette environment, local i18n file serving, bootstrap CSS cache-busting, and
dev-entry rewriting for multi-page builds. Node-only, no React dependency.

## Prerequisites

- `pnpm: >= 9`
- `node: >= 20`

## Getting Started

### Install

```bash
pnpm add -D @edifice.io/vite-plugins
```

## Exports

- `createDevProxyConfig` — dev-server proxy configuration, forwarding to a recette environment when a
  `.env` file is present.
- `serveLocalI18n` — serves local i18n JSON files on given routes instead of proxying them.
- `hashEdificeBootstrap` / `queryHashVersion` — cache-busts the bootstrap CSS bundle at build time.
- `rewriteToEntry` — rewrites matching dev-server routes to a custom HTML entry point (for multi-page
  builds).
