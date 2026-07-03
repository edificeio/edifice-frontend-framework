# syntax=docker/dockerfile:1
#
# Build context MUST be the monorepo root (pnpm workspace), e.g.:
#   docker build -f tools/impact-analyzer/viewer/Dockerfile -t impact-analyzer-viewer .
#
# Multi-stage: the build stage installs the full workspace (needed for pnpm
# to resolve the workspace graph correctly) and is discarded entirely — only
# the runtime stage below ships. Server-side runtime deps are installed
# separately from the workspace install (plain npm, isolated dir) to avoid
# shipping react/react-dom into the final image: they're bundled into the
# static JS by Vite and never imported by the Node server itself.

FROM node:22-slim AS build
WORKDIR /workspace
RUN corepack enable

# pnpm-lock.yaml is intentionally NOT committed in this repo (gitignored) —
# every other workflow here uses plain `pnpm install` for the same reason;
# --frozen-lockfile would fail in a clean checkout with no lockfile to
# freeze against.
COPY . .
RUN pnpm install
RUN pnpm --filter @edifice.io/impact-analyzer-viewer build

# Keep this version in sync with `prom-client` in the root pnpm-workspace.yaml catalog.
RUN mkdir -p /runtime-deps && cd /runtime-deps && npm install --no-save --omit=dev prom-client@15.1.3

FROM gcr.io/distroless/nodejs22-debian12:nonroot AS run
WORKDIR /app

COPY --from=build /runtime-deps/node_modules ./node_modules
COPY --from=build /workspace/tools/impact-analyzer/viewer/dist ./dist
COPY --from=build /workspace/tools/impact-analyzer/viewer/server ./server

EXPOSE 8080
CMD ["server/serve.mjs"]
