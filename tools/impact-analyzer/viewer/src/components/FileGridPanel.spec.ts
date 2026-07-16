// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { commonDirPrefix } from './FileGridPanel.js';

describe('commonDirPrefix', () => {
  it('returns the longest shared directory prefix', () => {
    expect(
      commonDirPrefix([
        'frontend/src/features/a/One.tsx',
        'frontend/src/features/b/Two.tsx',
        'frontend/src/components/Three.tsx',
      ]),
    ).toBe('frontend/src/');
  });

  it('returns the whole directory for a single file', () => {
    expect(commonDirPrefix(['frontend/src/a/One.tsx'])).toBe('frontend/src/a/');
  });

  it('returns empty when nothing is shared or for root-level files', () => {
    expect(commonDirPrefix(['frontend/a.tsx', 'src/b.tsx'])).toBe('');
    expect(commonDirPrefix(['a.tsx', 'b.tsx'])).toBe('');
    expect(commonDirPrefix([])).toBe('');
  });
});
