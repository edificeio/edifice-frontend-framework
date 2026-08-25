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
#
# Base images pinned by digest (tag kept alongside for readability) —
# reproducible builds, immune to a tag being silently repointed upstream.
# Bump both the tag and digest together on a deliberate upgrade (no
# automation wired up for this yet).
FROM node:22-slim@sha256:83f487e0a63425e5b4d146fb5e5be574bcbe1b7b843d3ebafdd95eaf7767a7e5 AS build
WORKDIR /workspace
RUN corepack enable

# Selective copy: every workspace member's package.json (+ the root
# manifests pnpm needs to resolve the workspace graph), nothing else —
# `pnpm install` only needs these, not any actual source. Keeps the
# `pnpm install` layer cached across source-only changes elsewhere in the
# monorepo, instead of invalidating on every commit (previously `COPY . .`
# ran before install).
COPY --parents package.json pnpm-workspace.yaml .npmrc '**/package.json' ./

# pnpm-lock.yaml is intentionally NOT committed in this repo (gitignored) —
# every other workflow here uses plain `pnpm install` for the same reason;
# --frozen-lockfile would fail in a clean checkout with no lockfile to
# freeze against.
RUN pnpm install

# The rest of the source, now that dependency resolution is cached separately.
COPY . .
RUN pnpm --filter @edifice.io/impact-analyzer-viewer build

# Resolves prom-client's version from the workspace catalog (single source
# of truth, pnpm-workspace.yaml) instead of a hardcoded duplicate here that
# could silently drift from it.
RUN mkdir -p /runtime-deps && cd /runtime-deps && \
    PROM_CLIENT_VERSION=$(cd /workspace && pnpm --filter @edifice.io/impact-analyzer-viewer exec node -p "require('prom-client/package.json').version") && \
    npm install --no-save --omit=dev "prom-client@${PROM_CLIENT_VERSION}"

FROM gcr.io/distroless/nodejs22-debian12:nonroot@sha256:13593b7570658e8477de39e2f4a1dd25db2f836d68a0ba771251572d23bb4f8e AS run
WORKDIR /app

COPY --from=build /runtime-deps/node_modules ./node_modules
COPY --from=build /workspace/tools/impact-analyzer/viewer/dist ./dist
COPY --from=build /workspace/tools/impact-analyzer/viewer/server ./server

EXPOSE 8080
CMD ["server/serve.mjs"]
