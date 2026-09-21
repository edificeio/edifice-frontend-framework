import { describe, expect, it } from 'vitest';
import type { DictionaryEntry } from '../types.js';
import { patchFlatFile } from './patch-flat-file.js';

function entry(scssVar: string, resolvedValue: string): DictionaryEntry {
  return { file: 'primitives', scssVar, resolvedValue, confidence: 'certain' };
}

describe('patchFlatFile', () => {
  it('updates a changed value in place, preserving surrounding lines', () => {
    const existing = [
      '$black: #000;',
      '$white: #fff;',
      '$grey-900: #383838;',
      '',
    ].join('\n');
    const result = patchFlatFile(existing, [entry('grey-900', '#949494')]);
    expect(result.text).toContain('$grey-900: #949494;');
    expect(result.text).toContain('$black: #000;');
    expect(result.changes).toEqual([
      { scssVar: 'grey-900', from: '#383838', to: '#949494' },
    ]);
  });

  it('does not report a change for a 3-digit vs 6-digit hex that is the same color', () => {
    const existing = '$black: #000;\n$white: #fff;\n';
    const result = patchFlatFile(existing, [
      entry('black', '#000000'),
      entry('white', '#ffffff'),
    ]);
    expect(result.changes).toHaveLength(0);
    expect(result.text).toBe(existing);
  });

  it('appends new variables under a timestamped comment, without touching existing lines', () => {
    const existing = '$black: #000;\n';
    const result = patchFlatFile(existing, [
      entry('black', '#000'),
      entry('spacer-128', '12.8rem'),
    ]);
    expect(result.added).toEqual([entry('spacer-128', '12.8rem')]);
    expect(result.text).toContain('// Ajoute automatiquement depuis Figma le');
    expect(result.text).toContain('$spacer-128: 12.8rem;');
  });

  it('flags a variable present in the file but absent from Figma as removed, without deleting it', () => {
    const existing = '$black: #000;\n$obsolete-var: 1px;\n';
    const result = patchFlatFile(existing, [entry('black', '#000')]);
    expect(result.removed).toEqual(['obsolete-var']);
    expect(result.text).toContain('$obsolete-var: 1px;');
  });
});
