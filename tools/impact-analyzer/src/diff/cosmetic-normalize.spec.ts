import { describe, expect, it } from 'vitest';
import { isCosmeticOnlyChange } from './cosmetic-normalize.js';

describe('isCosmeticOnlyChange', () => {
  it('treats pure reformatting (indentation/semicolons) as cosmetic-only', () => {
    // Quote style is intentionally NOT varied here: the TS printer preserves
    // a string literal's original quote character verbatim, so a genuine
    // quote-style-only diff would NOT be filtered — a non-issue in this repo
    // since Prettier's singleQuote:true keeps quoting consistent across commits.
    const a =
      "export function foo(x: number) {\n  return x + 1;\n}\nexport const s = 'hi';\n";
    const b =
      "export function foo(x: number) {\n    return x + 1\n}\nexport const s = 'hi'\n";
    expect(isCosmeticOnlyChange(a, b)).toBe(true);
  });

  it('treats added/removed comments as cosmetic-only', () => {
    const a =
      'export function foo(x: number) {\n  // a comment\n  return x + 1;\n}\n';
    const b =
      'export function foo(x: number) {\n\n\n  return x + 1; // trailing\n}\n';
    expect(isCosmeticOnlyChange(a, b)).toBe(true);
  });

  it('does not strip a comment-like string literal', () => {
    const a = 'export const s = "// pas un vrai commentaire";';
    const b =
      'export const s = "// pas un vrai commentaire";\n// real comment here';
    expect(isCosmeticOnlyChange(a, b)).toBe(true);
    // Sanity: the literal itself must still be intact after normalization.
    const a2 = 'export const s = "// pas un vrai commentaire";';
    const a3 = 'export const s = "different string";';
    expect(isCosmeticOnlyChange(a2, a3)).toBe(false);
  });

  it('detects a real body change', () => {
    const a = 'export function foo(x: number) { return x + 1; }';
    const b = 'export function foo(x: number) { return x + 2; }';
    expect(isCosmeticOnlyChange(a, b)).toBe(false);
  });

  it('detects a pure local-variable rename as a real (over-signaled) change', () => {
    const a = 'export function foo(x: number) { const y = x + 1; return y; }';
    const b = 'export function foo(x: number) { const z = x + 1; return z; }';
    expect(isCosmeticOnlyChange(a, b)).toBe(false);
  });

  it('handles JSX content', () => {
    const a =
      'export function Button() {\n  // comment\n  return <button>Click</button>;\n}\n';
    const b =
      'export function Button() {\n\n  return <button>Click</button>; // trailing\n}\n';
    const c = 'export function Button() { return <button>Click me</button>; }';
    expect(isCosmeticOnlyChange(a, b)).toBe(true);
    expect(isCosmeticOnlyChange(a, c)).toBe(false);
  });
});
