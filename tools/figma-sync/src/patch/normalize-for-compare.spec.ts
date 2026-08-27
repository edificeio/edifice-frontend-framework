import { describe, expect, it } from 'vitest';
import { normalizeForCompare } from './normalize-for-compare.js';

describe('normalizeForCompare', () => {
  it('treats 3-digit and 6-digit hex as equal', () => {
    expect(normalizeForCompare('#fff')).toBe(normalizeForCompare('#ffffff'));
    expect(normalizeForCompare('#000')).toBe(normalizeForCompare('#000000'));
  });

  it('is case-insensitive on hex values', () => {
    expect(normalizeForCompare('#ABC')).toBe(normalizeForCompare('#aabbcc'));
  });

  it('leaves non-hex values untouched', () => {
    expect(normalizeForCompare('$grey-900')).toBe('$grey-900');
    expect(normalizeForCompare('1.6rem')).toBe('1.6rem');
  });
});
