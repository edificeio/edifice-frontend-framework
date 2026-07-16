import { describe, expect, it } from 'vitest';
import { parseScssSelectors } from './scss-parser.js';

describe('parseScssSelectors', () => {
  it('resolves BEM-style suffix nesting (&-item)', () => {
    const resolved = parseScssSelectors(`
      .dropdown {
        &-item { color: red; }
      }
    `);
    expect(resolved).toContain('.dropdown');
    expect(resolved).toContain('.dropdown-item');
  });

  it('resolves pseudo-class and compound-class nesting (&:hover, &.active)', () => {
    const resolved = parseScssSelectors(`
      .dropdown-item {
        &:hover { color: blue; }
        &.active { color: green; }
      }
    `);
    expect(resolved).toContain('.dropdown-item:hover');
    expect(resolved).toContain('.dropdown-item.active');
  });

  it('resolves comma-separated nested selector groups independently', () => {
    const resolved = parseScssSelectors(`
      .dropdown-item {
        &.active,
        &:active {
          color: red;
        }
      }
    `);
    expect(resolved).toContain('.dropdown-item.active');
    expect(resolved).toContain('.dropdown-item:active');
  });

  it('resolves attribute selector nesting without splitting on commas inside brackets', () => {
    const resolved = parseScssSelectors(`
      .dropdown-item {
        &[role='menuitemradio'] { cursor: pointer; }
      }
    `);
    expect(resolved).toContain(`.dropdown-item[role='menuitemradio']`);
  });

  it('descendant-combines a nested selector with no &', () => {
    const resolved = parseScssSelectors(`
      .dropdown-item {
        svg { width: 2rem; }
      }
    `);
    expect(resolved).toContain('.dropdown-item svg');
  });
});
