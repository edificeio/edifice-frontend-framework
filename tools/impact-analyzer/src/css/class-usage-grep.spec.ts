import { describe, expect, it } from 'vitest';
import { classConfidence, findClassUsageInApp } from './class-usage-grep.js';

describe('classConfidence', () => {
  it('flags short and generic class names as low confidence', () => {
    expect(classConfidence('active')).toBe('low');
    expect(classConfidence('icon')).toBe('low');
  });

  it('treats specific, longer class names as high confidence', () => {
    expect(classConfidence('dropdown-item')).toBe('high');
  });
});

describe('findClassUsageInApp', () => {
  it('matches a className literal as a whole token, not a substring', () => {
    const usage = findClassUsageInApp(
      ['dropdown-item'],
      [
        {
          path: '/a/Foo.tsx',
          content: `<div className="dropdown-item mt-8" />`,
        },
        {
          path: '/a/Bar.tsx',
          content: `<div className="dropdown-item-large" />`,
        },
      ],
    );
    expect(usage?.files).toEqual(['/a/Foo.tsx']);
    expect(usage?.matchCount).toBe(1);
  });

  it('matches a class used as a clsx object key', () => {
    const usage = findClassUsageInApp(
      ['dropdown-item'],
      [{ path: '/a/Foo.tsx', content: `clsx({ 'dropdown-item': isOpen })` }],
    );
    expect(usage?.files).toEqual(['/a/Foo.tsx']);
  });

  it('returns null when no file matches any class', () => {
    const usage = findClassUsageInApp(
      ['dropdown-item'],
      [{ path: '/a/Foo.tsx', content: `<div className="unrelated" />` }],
    );
    expect(usage).toBeNull();
  });
});
