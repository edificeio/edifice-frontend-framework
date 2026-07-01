import { execFileSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanupTempDir,
  commitFile,
  createTempGitRepo,
} from '../discovery/test-utils.js';
import type {
  CssComponentEntry,
  CssGlobalRisk,
} from '../types/index-schema.js';
import { diffCss } from './css-diff.js';

describe('diffCss', () => {
  let repoPath: string;

  afterEach(() => {
    if (repoPath) cleanupTempDir(repoPath);
  });

  function bootstrapDir(): string {
    return `${repoPath}/packages/bootstrap/src`;
  }

  it('classifies a changed, high-confidence localized component as likely-breaking', () => {
    repoPath = createTempGitRepo();
    const baseCommit = commitFile(
      repoPath,
      'packages/bootstrap/src/components/_dropdown.scss',
      '.dropdown { width: 1px; }',
      'base',
    );
    commitFile(
      repoPath,
      'packages/bootstrap/src/components/_dropdown.scss',
      '.dropdown { width: 2px; }',
      'head',
    );

    const headCssComponents: CssComponentEntry[] = [
      {
        file: 'components/_dropdown.scss',
        reactPeer: 'Dropdown',
        selectors: ['dropdown'],
        confidence: 'high',
        consumers: [
          {
            app: 'communities',
            appBranch: 'develop',
            matchedSelectors: ['dropdown'],
            files: [],
            matchCount: 3,
          },
        ],
      },
    ];

    const [entry] = diffCss({
      baseRef: baseCommit,
      headRepoRoot: repoPath,
      bootstrapSrcDir: bootstrapDir(),
      headCssComponents,
      headCssGlobalRisks: [],
    });

    expect(entry).toMatchObject({
      file: 'components/_dropdown.scss',
      scope: 'component',
      reactPeer: 'Dropdown',
      confidence: 'high',
      severity: 'likely-breaking',
      affectedApps: ['communities'],
    });
  });

  it('classifies a low-confidence/uncorrelated component change as needs-review', () => {
    repoPath = createTempGitRepo();
    const baseCommit = commitFile(
      repoPath,
      'packages/bootstrap/src/components/_orphan.scss',
      '.orphan { color: red; }',
      'base',
    );
    commitFile(
      repoPath,
      'packages/bootstrap/src/components/_orphan.scss',
      '.orphan { color: blue; }',
      'head',
    );

    const headCssComponents: CssComponentEntry[] = [
      {
        file: 'components/_orphan.scss',
        selectors: ['orphan'],
        confidence: 'low',
        consumers: [],
      },
    ];

    const [entry] = diffCss({
      baseRef: baseCommit,
      headRepoRoot: repoPath,
      bootstrapSrcDir: bootstrapDir(),
      headCssComponents,
      headCssGlobalRisks: [],
    });

    expect(entry).toMatchObject({
      scope: 'component',
      confidence: 'low',
      severity: 'needs-review',
    });
  });

  it('classifies a theme change as breaking, and token/abstract/base as likely-breaking', () => {
    repoPath = createTempGitRepo();
    const baseCommit = commitFile(
      repoPath,
      'packages/bootstrap/src/themes/_colors.scss',
      '$c: red;',
      'base',
    );
    commitFile(
      repoPath,
      'packages/bootstrap/src/themes/_colors.scss',
      '$c: blue;',
      'theme change',
    );
    commitFile(
      repoPath,
      'packages/bootstrap/src/tokens/_spacing.scss',
      '$s: 4px;',
      'token change',
    );

    const headCssGlobalRisks: CssGlobalRisk[] = [
      {
        file: 'themes/_colors.scss',
        scope: 'theme',
        affectedApps: ['communities', 'blog'],
      },
      {
        file: 'tokens/_spacing.scss',
        scope: 'token',
        affectedApps: ['communities', 'blog'],
      },
    ];

    const entries = diffCss({
      baseRef: baseCommit,
      headRepoRoot: repoPath,
      bootstrapSrcDir: bootstrapDir(),
      headCssComponents: [],
      headCssGlobalRisks,
    });

    const theme = entries.find((e) => e.file === 'themes/_colors.scss');
    const token = entries.find((e) => e.file === 'tokens/_spacing.scss');
    expect(theme).toMatchObject({
      scope: 'global',
      globalScope: 'theme',
      severity: 'breaking',
      affectedApps: ['communities', 'blog'],
    });
    expect(token).toMatchObject({
      scope: 'global',
      globalScope: 'token',
      severity: 'likely-breaking',
    });
  });

  it('still reports a component file deleted between base and head, with an undetermined confidence', () => {
    repoPath = createTempGitRepo();
    const baseCommit = commitFile(
      repoPath,
      'packages/bootstrap/src/components/_gone.scss',
      '.gone { color: red; }',
      'base',
    );
    execFileSync('git', [
      '-C',
      repoPath,
      'rm',
      'packages/bootstrap/src/components/_gone.scss',
    ]);
    execFileSync('git', ['-C', repoPath, 'commit', '-m', 'delete']);

    const entries = diffCss({
      baseRef: baseCommit,
      headRepoRoot: repoPath,
      bootstrapSrcDir: bootstrapDir(),
      headCssComponents: [], // no longer present at head
      headCssGlobalRisks: [],
    });

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      file: 'components/_gone.scss',
      scope: 'component',
      confidence: undefined,
      severity: 'needs-review',
      affectedApps: [],
    });
  });
});
