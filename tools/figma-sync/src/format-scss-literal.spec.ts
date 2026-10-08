import { describe, expect, it } from 'vitest';
import { formatScssLiteral } from './format-scss-literal.js';

describe('formatScssLiteral', () => {
  it('converts numbers/, font/size/ and font/lineHeight/ from px to rem (/10)', () => {
    expect(formatScssLiteral('numbers/8', 8)).toBe('0.8rem');
    expect(formatScssLiteral('font/size/xl', 32)).toBe('3.2rem');
    expect(formatScssLiteral('font/lineHeight/xl', 36)).toBe('3.6rem');
  });

  it('never adds a unit to the literal value 0', () => {
    expect(formatScssLiteral('numbers/0', 0)).toBe('0');
  });

  it('leaves font/weight and other raw numbers unconverted', () => {
    expect(formatScssLiteral('font/weight/bold', 700)).toBe('700');
    expect(formatScssLiteral('columns', 12)).toBe('12');
  });

  it('passes hex colors through unchanged', () => {
    expect(formatScssLiteral('grey/900', '#383838')).toBe('#383838');
  });

  it('quotes non-hex strings', () => {
    expect(formatScssLiteral('font/family/arimo', 'Arimo')).toBe("'Arimo'");
  });
});
