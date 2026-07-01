import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

export interface RepoSnapshot {
  worktreePath: string;
  commit: string;
}

function git(repoRoot: string, ...args: string[]): string {
  return execFileSync('git', ['-C', repoRoot, ...args], {
    encoding: 'utf-8',
  }).trim();
}

/**
 * `node_modules` is gitignored, so `git worktree add` never materializes it
 * — without this, ts-morph can't resolve types from external packages
 * (`@tiptap/*`, `antd`, ...) inside the snapshot, which silently corrupts
 * `getExportedDeclarations()` for any file importing them (observed in
 * practice: symbols in packages/react's editor module spuriously reported
 * as changed). Symlinking is safe: it never touches the real node_modules
 * content, and `cleanupSnapshot` removes the symlinks (not their targets)
 * along with the rest of the worktree.
 */
function linkNodeModules(repoRoot: string, worktreePath: string): void {
  const packagesDir = join(repoRoot, 'packages');
  const packageDirs = existsSync(packagesDir)
    ? readdirSync(packagesDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => join('packages', d.name, 'node_modules'))
    : [];

  for (const relPath of ['node_modules', ...packageDirs]) {
    const source = join(repoRoot, relPath);
    if (!existsSync(source)) continue;
    const target = join(worktreePath, relPath);
    mkdirSync(dirname(target), { recursive: true });
    symlinkSync(source, target, 'dir');
  }
}

/**
 * Materializes `ref` in a disposable, detached worktree — never touches the
 * main worktree (no checkout/fetch/pull/reset on `repoRoot`), same rigor as
 * local-repo-resolver.ts for sibling apps. Caller MUST call
 * `cleanupSnapshot` in a `finally`.
 *
 * No `--force` on `worktree add`: a same-named leftover (shouldn't happen —
 * mkdtempSync gives a fresh path each time) should fail loudly, not be
 * silently overwritten.
 */
export function createSnapshot(repoRoot: string, ref: string): RepoSnapshot {
  const worktreePath = mkdtempSync(join(tmpdir(), 'impact-analyzer-snapshot-'));
  // mkdtempSync already created the directory; `worktree add` requires the
  // target path to not exist yet, so remove it and let git recreate it.
  rmSync(worktreePath, { recursive: true, force: true });

  git(repoRoot, 'worktree', 'add', '--detach', worktreePath, ref);
  const commit = git(repoRoot, 'rev-parse', ref);
  linkNodeModules(repoRoot, worktreePath);

  return { worktreePath, commit };
}

export function cleanupSnapshot(
  repoRoot: string,
  snapshot: RepoSnapshot,
): void {
  try {
    git(repoRoot, 'worktree', 'remove', '--force', snapshot.worktreePath);
  } finally {
    // Safety net: if `worktree remove` failed partway (e.g. process killed
    // mid-operation), never leave an orphaned directory in the OS tmpdir.
    rmSync(snapshot.worktreePath, { recursive: true, force: true });
  }
}
