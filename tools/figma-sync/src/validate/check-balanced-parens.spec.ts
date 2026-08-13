import { describe, expect, it } from 'vitest';
import { checkBalancedParens } from './check-balanced-parens.js';

describe('checkBalancedParens', () => {
  it('reports balanced for valid nested SCSS maps', () => {
    const text = '$one: (\n  color: (\n    primary: (pale: $x),\n  ),\n);\n';
    expect(checkBalancedParens(text)).toEqual({
      balanced: true,
      openCount: 3,
      closeCount: 3,
    });
  });

  it('reports unbalanced when a closing paren is missing', () => {
    const text = '$one: (\n  color: (\n    primary: (pale: $x),\n  ),\n';
    const result = checkBalancedParens(text);
    expect(result.balanced).toBe(false);
    expect(result.openCount).toBe(3);
    expect(result.closeCount).toBe(2);
  });
});
