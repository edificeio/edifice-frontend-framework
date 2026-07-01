import { describe, expect, it } from 'vitest';
import { detectGlobalScope } from './global-scope-detector.js';

describe('detectGlobalScope', () => {
  const root = '/repo/packages/bootstrap/src';

  it('flags files under themes/tokens/abstracts/base', () => {
    expect(detectGlobalScope(root, `${root}/themes/crna/_theme.scss`)).toBe(
      'theme',
    );
    expect(detectGlobalScope(root, `${root}/tokens/_colors.scss`)).toBe(
      'token',
    );
    expect(detectGlobalScope(root, `${root}/abstracts/_mixins.scss`)).toBe(
      'abstract',
    );
    expect(detectGlobalScope(root, `${root}/base/_reset.scss`)).toBe('base');
  });

  it('returns null for component files', () => {
    expect(
      detectGlobalScope(root, `${root}/components/_dropdown.scss`),
    ).toBeNull();
  });
});
