import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

/**
 * Creates a throwaway git repo for tests. This is NEVER one of the user's
 * sibling app repos — it lives under the OS tmpdir and is deleted by the
 * caller after the test. Safe to `git checkout`/`commit` here, unlike the
 * real sibling repos the tool reads in local mode.
 */
export function createTempGitRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'impact-analyzer-test-'));
  const git = (...args: string[]) =>
    execFileSync('git', ['-C', dir, ...args], { encoding: 'utf-8' });

  git('init', '--initial-branch=develop');
  git('config', 'user.email', 'test@example.com');
  git('config', 'user.name', 'Impact Analyzer Test');
  git('commit', '--allow-empty', '-m', 'init');

  return dir;
}

export function cleanupTempDir(dir: string): void {
  rmSync(dir, { recursive: true, force: true });
}

/**
 * Writes a file, stages it and commits it in a temp git repo created by
 * createTempGitRepo() — a building block for tests that need a base/head
 * history (e.g. the diff module). Never used against a real sibling repo.
 */
export function commitFile(
  repoPath: string,
  relPath: string,
  content: string,
  message: string,
): string {
  const fullPath = join(repoPath, relPath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content);

  const git = (...args: string[]) =>
    execFileSync('git', ['-C', repoPath, ...args], { encoding: 'utf-8' });

  git('add', relPath);
  git('commit', '-m', message);
  return git('rev-parse', 'HEAD').trim();
}

export function writePackageJson(
  repoPath: string,
  subdir: string | null,
  content: unknown,
): void {
  const dir = subdir ? join(repoPath, subdir) : repoPath;
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'package.json'), JSON.stringify(content, null, 2));
}
