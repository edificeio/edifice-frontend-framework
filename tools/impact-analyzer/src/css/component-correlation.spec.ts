import { describe, expect, it } from 'vitest';
import { correlateComponent } from './component-correlation.js';

describe('correlateComponent', () => {
  const componentNames = ['Dropdown', 'Button', 'SearchBar'];

  it('matches a kebab-case scss filename to its homonymous PascalCase component', () => {
    expect(correlateComponent('_dropdown.scss', componentNames)).toBe(
      'Dropdown',
    );
    expect(correlateComponent('_search-bar.scss', componentNames)).toBe(
      'SearchBar',
    );
  });

  it('returns undefined when no component matches', () => {
    expect(
      correlateComponent('_theme-tokens.scss', componentNames),
    ).toBeUndefined();
  });
});
