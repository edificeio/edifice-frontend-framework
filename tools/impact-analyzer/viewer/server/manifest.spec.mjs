// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { buildManifest, classifyDataFileNames } from './manifest.mjs';

describe('classifyDataFileNames', () => {
  it('splits index and diff files, ignoring anything else', () => {
    const { indexFiles, diffFiles } = classifyDataFileNames([
      'index.develop.json',
      'diff.develop..feat-x.json',
      'manifest.json',
      'README.md',
      'index.develop.json.bak',
    ]);
    expect(indexFiles).toEqual(['index.develop.json']);
    expect(diffFiles).toEqual(['diff.develop..feat-x.json']);
  });

  it('returns empty arrays for an empty or irrelevant listing', () => {
    expect(classifyDataFileNames([])).toEqual({
      indexFiles: [],
      diffFiles: [],
    });
    expect(classifyDataFileNames(['README.md'])).toEqual({
      indexFiles: [],
      diffFiles: [],
    });
  });
});

describe('buildManifest', () => {
  it('derives branch names from index file names', () => {
    const { branches } = buildManifest([
      'index.develop.json',
      'index.develop-enabling.json',
    ]);
    expect(branches.sort()).toEqual(['develop', 'develop-enabling']);
  });

  it('splits a diff file name into base/head at the ".." separator', () => {
    const { diffs } = buildManifest([
      'diff.develop..feat-ENABLING-1023-impact-analyzer.json',
    ]);
    expect(diffs).toEqual([
      {
        base: 'develop',
        head: 'feat-ENABLING-1023-impact-analyzer',
        file: 'diff.develop..feat-ENABLING-1023-impact-analyzer.json',
      },
    ]);
  });

  it('passes through indexFiles/diffFiles unchanged alongside the derived fields', () => {
    const fileNames = ['index.develop.json', 'diff.develop..head.json'];
    const manifest = buildManifest(fileNames);
    expect(manifest.indexFiles).toEqual(['index.develop.json']);
    expect(manifest.diffFiles).toEqual(['diff.develop..head.json']);
  });
});
