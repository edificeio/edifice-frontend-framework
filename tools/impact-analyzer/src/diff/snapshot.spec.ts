import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanupTempDir,
  commitFile,
  createTempGitRepo,
} from '../discovery/test-utils.js';
import { cleanupSnapshot, createSnapshot } from './snapshot.js';

function git(repoRoot: string, ...args: string[]): string {
  return execFileSync('git', ['-C', repoRoot, ...args], {
    encoding: 'utf-8',
  }).trim();
}

describe('createSnapshot / cleanupSnapshot', () => {
  let repoPath: string;

  afterEach(() => {
    if (repoPath) cleanupTempDir(repoPath);
  });

  it('materializes the content of the base ref, not the current HEAD', () => {
    repoPath = createTempGitRepo();
    commitFile(repoPath, 'a.txt', 'base content', 'base commit');
    const baseCommit = git(repoPath, 'rev-parse', 'HEAD');
    commitFile(repoPath, 'a.txt', 'head content', 'head commit');

    const snapshot = createSnapshot(repoPath, baseCommit);
    try {
      expect(snapshot.commit).toBe(baseCommit);
      expect(readFileSync(join(snapshot.worktreePath, 'a.txt'), 'utf-8')).toBe(
        'base content',
      );
    } finally {
      cleanupSnapshot(repoPath, snapshot);
    }
  });

  it('removes the worktree on cleanup, leaving no residue', () => {
    repoPath = createTempGitRepo();
    commitFile(repoPath, 'a.txt', 'content', 'commit');

    const snapshot = createSnapshot(repoPath, 'HEAD');
    cleanupSnapshot(repoPath, snapshot);

    expect(existsSync(snapshot.worktreePath)).toBe(false);
    expect(git(repoPath, 'worktree', 'list')).not.toContain(
      snapshot.worktreePath,
    );
  });

  it('never mutates HEAD or the branch of the main worktree', () => {
    repoPath = createTempGitRepo();
    commitFile(repoPath, 'a.txt', 'content', 'commit');
    const headBefore = git(repoPath, 'rev-parse', 'HEAD');
    const branchBefore = git(repoPath, 'rev-parse', '--abbrev-ref', 'HEAD');

    const snapshot = createSnapshot(repoPath, headBefore);
    cleanupSnapshot(repoPath, snapshot);

    expect(git(repoPath, 'rev-parse', 'HEAD')).toBe(headBefore);
    expect(git(repoPath, 'rev-parse', '--abbrev-ref', 'HEAD')).toBe(
      branchBefore,
    );
  });

  it('symlinks root and per-package node_modules into the snapshot (gitignored, never checked out)', () => {
    repoPath = createTempGitRepo();
    commitFile(repoPath, 'packages/react/src/index.ts', 'export {}', 'commit');
    // node_modules is gitignored — simulate it existing on disk without committing it.
    mkdirSync(join(repoPath, 'node_modules', 'some-dep'), { recursive: true });
    writeFileSync(join(repoPath, 'node_modules', 'some-dep', 'index.js'), '');
    mkdirSync(
      join(repoPath, 'packages', 'react', 'node_modules', 'local-dep'),
      { recursive: true },
    );
    writeFileSync(
      join(
        repoPath,
        'packages',
        'react',
        'node_modules',
        'local-dep',
        'index.js',
      ),
      '',
    );

    const snapshot = createSnapshot(repoPath, 'HEAD');
    try {
      expect(
        existsSync(
          join(snapshot.worktreePath, 'node_modules', 'some-dep', 'index.js'),
        ),
      ).toBe(true);
      expect(
        existsSync(
          join(
            snapshot.worktreePath,
            'packages',
            'react',
            'node_modules',
            'local-dep',
            'index.js',
          ),
        ),
      ).toBe(true);
      // Real symlinks, not copies — pointing back at the main repo's node_modules.
      expect(realpathSync(join(snapshot.worktreePath, 'node_modules'))).toBe(
        realpathSync(join(repoPath, 'node_modules')),
      );
    } finally {
      cleanupSnapshot(repoPath, snapshot);
    }
  });
});
