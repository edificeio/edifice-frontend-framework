import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const DEFAULT_REPOS_ROOT = '/Volumes/Work';

// These are local, read-only commands (rev-parse/status) — a hang here would
// mean a genuinely broken repo, not a network issue, but bounding it costs
// nothing and keeps the local mode as resilient as the CI mode (remote-clone.ts).
const GIT_TIMEOUT_MS = 30_000;

/**
 * Root directory under which sibling app repos are expected to be cloned.
 * Overridable via IMPACT_ANALYZER_REPOS_ROOT so the tool isn't hard-coded to
 * one developer's disk layout.
 */
export function reposRoot(): string {
  return process.env.IMPACT_ANALYZER_REPOS_ROOT || DEFAULT_REPOS_ROOT;
}

export function resolveRepoPath(repo: string): string {
  return join(reposRoot(), repo);
}

export interface RepoState {
  branch: string;
  commit: string;
  dirty: boolean;
}

export class RepoNotFoundError extends Error {}

/**
 * Reads the current git state of a sibling repo. Read-only: only
 * rev-parse/status are ever run here. This tool must NEVER checkout, fetch,
 * or pull a sibling repo — those are the developer's own working trees,
 * possibly with uncommitted work.
 */
export function readRepoState(repoPath: string): RepoState {
  if (!existsSync(join(repoPath, '.git'))) {
    throw new RepoNotFoundError(`Not a git repository: ${repoPath}`);
  }

  const git = (...args: string[]) =>
    execFileSync('git', ['-C', repoPath, ...args], {
      encoding: 'utf-8',
      timeout: GIT_TIMEOUT_MS,
    }).trim();

  const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
  const commit = git('rev-parse', 'HEAD');
  const dirty = git('status', '--porcelain').length > 0;

  return { branch, commit, dirty };
}
