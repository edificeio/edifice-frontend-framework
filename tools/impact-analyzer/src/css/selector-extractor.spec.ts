import { describe, expect, it } from 'vitest';
import { extractClassNames } from './selector-extractor.js';

describe('extractClassNames', () => {
  it('extracts only class tokens, discarding pseudo-classes/attributes/tags', () => {
    const classes = extractClassNames([
      '.dropdown',
      '.dropdown-item:hover',
      '.dropdown-item.active',
      `.dropdown-item[role='menuitemradio']`,
      '.dropdown-item svg',
    ]);
    expect(classes).toEqual(['active', 'dropdown', 'dropdown-item']);
  });

  it('does not throw on an invalid standalone selector, and skips it', () => {
    expect(() => extractClassNames(['.valid', '&invalid&&'])).not.toThrow();
  });

  it('discards Sass interpolation artifacts like .#{$variant}', () => {
    const classes = extractClassNames(['.badge.#{$variant}']);
    expect(classes).toEqual(['badge']);
  });
});
