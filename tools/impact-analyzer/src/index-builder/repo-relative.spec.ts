import { describe, expect, it } from 'vitest';
import { toRepoRelativeFiles } from './repo-relative.js';

describe('toRepoRelativeFiles', () => {
  it('strips the repo root and keeps the app layout prefix', () => {
    expect(
      toRepoRelativeFiles('/tmp/clone-abc123', [
        '/tmp/clone-abc123/frontend/src/features/Post/PostDate.tsx',
        '/tmp/clone-abc123/src/main.tsx',
      ]),
    ).toEqual(['frontend/src/features/Post/PostDate.tsx', 'src/main.tsx']);
  });

  it('produces identical output for the same file scanned from two different clone dirs', () => {
    const fromFirstRun = toRepoRelativeFiles('/tmp/clone-run1', [
      '/tmp/clone-run1/frontend/src/app.tsx',
    ]);
    const fromSecondRun = toRepoRelativeFiles('/tmp/clone-run2', [
      '/tmp/clone-run2/frontend/src/app.tsx',
    ]);
    expect(fromFirstRun).toEqual(fromSecondRun);
  });
});
