import { describe, expect, it } from 'vitest';
import type { ThemeDotPathEntry } from '../types.js';
import { patchThemeFile } from './patch-theme-file.js';

const BASE_THEME = [
  '$neo: (',
  '  color: (',
  '    primary: (',
  '      pale: $neo-orange-200,',
  '      default: $neo-orange-500,',
  '    ),',
  '    profil: (',
  '      guest: $neo-pink-500,',
  '    ),',
  '  ),',
  ');',
  '',
].join('\n');

function entries(...pairs: Array<[string, string]>): ThemeDotPathEntry[] {
  return pairs.map(([dotPath, value]) => ({ dotPath, value }));
}

describe('patchThemeFile', () => {
  it('updates a changed leaf value in place', () => {
    const result = patchThemeFile(
      BASE_THEME,
      entries(
        ['color.primary.pale', '$neo-orange-200'],
        ['color.primary.default', '$neo-orange-700'],
      ),
    );
    expect(result.changes).toEqual([
      {
        dotPath: 'color.primary.default',
        from: '$neo-orange-500',
        to: '$neo-orange-700',
      },
    ]);
    expect(result.text).toContain('default: $neo-orange-700,');
  });

  it('adds a brand-new leaf directly under an existing container, not wrapped in a new sub-map', () => {
    const result = patchThemeFile(
      BASE_THEME,
      entries(
        ['color.primary.pale', '$neo-orange-200'],
        ['color.primary.default', '$neo-orange-500'],
        ['color.primary.feather', '$neo-orange-200'],
      ),
    );
    expect(result.text).toContain('feather: $neo-orange-200,');
    expect(result.text).not.toContain('feather: (');
  });

  it('creates a brand-new nested section that did not exist before, without double-nesting it', () => {
    const result = patchThemeFile(
      BASE_THEME,
      entries(
        ['color.primary.pale', '$neo-orange-200'],
        ['color.primary.default', '$neo-orange-500'],
        ['color.profil.guest', '$neo-pink-500'],
        ['color.app.communicate', '$neo-orange-500'],
        ['color.app.produce', '$neo-blue-500'],
      ),
    );
    expect(result.text).toContain(
      'app: (\n      communicate: $neo-orange-500,\n      produce: $neo-blue-500,\n    ),',
    );
    // the double-nesting bug looked like "app: (\n  app: (\n ..."
    expect(result.text).not.toMatch(/app:\s*\(\s*app:/);
  });

  it('positions a new section using Figma order, not alphabetical order or end-of-file', () => {
    // In Figma's order, "background" and "app" both come before "profil".
    const result = patchThemeFile(
      BASE_THEME,
      entries(
        ['color.primary.pale', '$neo-orange-200'],
        ['color.primary.default', '$neo-orange-500'],
        ['color.background.default', '$white'],
        ['color.app.communicate', '$neo-orange-500'],
        ['color.profil.guest', '$neo-pink-500'],
      ),
    );
    const backgroundIdx = result.text.indexOf('background: (');
    const appIdx = result.text.indexOf('app: (');
    const profilIdx = result.text.indexOf('profil: (');
    expect(backgroundIdx).toBeGreaterThan(-1);
    expect(appIdx).toBeGreaterThan(backgroundIdx);
    expect(profilIdx).toBeGreaterThan(appIdx);
  });

  it('falls back to an "unplaced" comment block when even the root container is missing', () => {
    const result = patchThemeFile(
      BASE_THEME,
      entries(
        ['color.primary.pale', '$neo-orange-200'],
        ['color.primary.default', '$neo-orange-500'],
        ['color.profil.guest', '$neo-pink-500'],
        ['spacing.gutter.default', '$spacer-24'],
      ),
    );
    expect(result.unplaced).toHaveLength(1);
    expect(result.text).toContain(
      '// Nouveaux tokens Figma sans section correspondante -- a integrer manuellement :',
    );
    expect(result.text).toContain('//   spacing.gutter.default: $spacer-24');
  });
});
