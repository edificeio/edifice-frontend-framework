import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { listAppSourceFiles } from './source-files.js';

describe('listAppSourceFiles', () => {
  let dir: string;

  afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
  });

  it('lists .ts/.tsx files recursively, excluding tests/stories/declarations', () => {
    dir = mkdtempSync(join(tmpdir(), 'impact-analyzer-src-'));
    mkdirSync(join(dir, 'features'), { recursive: true });
    writeFileSync(join(dir, 'App.tsx'), '');
    writeFileSync(join(dir, 'App.spec.tsx'), '');
    writeFileSync(join(dir, 'App.stories.tsx'), '');
    writeFileSync(join(dir, 'types.d.ts'), '');
    writeFileSync(join(dir, 'features', 'Widget.tsx'), '');
    writeFileSync(join(dir, 'features', 'Widget.test.ts'), '');
    writeFileSync(join(dir, 'README.md'), '');

    const files = listAppSourceFiles(dir)
      .map((f) => f.slice(dir.length + 1))
      .sort();
    expect(files).toEqual(['App.tsx', 'features/Widget.tsx']);
  });

  it('returns an empty array when the src root does not exist', () => {
    expect(listAppSourceFiles('/nonexistent/src/root')).toEqual([]);
  });
});
