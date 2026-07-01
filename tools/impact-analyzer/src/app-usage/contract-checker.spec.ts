import { describe, expect, it } from 'vitest';
import {
  buildKnownEntrySet,
  isEntryInContract,
  toImportPath,
} from './contract-checker.js';

describe('contract-checker', () => {
  const knownEntries = buildKnownEntrySet([
    { package: '@edifice.io/react', entry: '.' },
    { package: '@edifice.io/react', entry: './icons' },
  ]);

  it('accepts a declared entry', () => {
    expect(isEntryInContract(knownEntries, '@edifice.io/react', '.')).toBe(
      true,
    );
    expect(
      isEntryInContract(knownEntries, '@edifice.io/react', './icons'),
    ).toBe(true);
  });

  it('rejects an undeclared subpath', () => {
    expect(
      isEntryInContract(
        knownEntries,
        '@edifice.io/react',
        './dist/internal/Foo',
      ),
    ).toBe(false);
  });

  it('rejects a declared entry name for the wrong package', () => {
    expect(isEntryInContract(knownEntries, '@edifice.io/bootstrap', '.')).toBe(
      false,
    );
  });

  it('reconstructs a readable import path', () => {
    expect(toImportPath('@edifice.io/react', '.')).toBe('@edifice.io/react');
    expect(toImportPath('@edifice.io/react', './icons/nav')).toBe(
      '@edifice.io/react/icons/nav',
    );
  });
});
