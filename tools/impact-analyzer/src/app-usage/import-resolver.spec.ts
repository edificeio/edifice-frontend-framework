import { Project, ts } from 'ts-morph';
import { describe, expect, it } from 'vitest';
import {
  normalizeEdificeModuleSpecifier,
  resolveEdificeImports,
} from './import-resolver.js';

describe('normalizeEdificeModuleSpecifier', () => {
  it('normalizes a root import to entry "."', () => {
    expect(normalizeEdificeModuleSpecifier('@edifice.io/react')).toEqual({
      package: '@edifice.io/react',
      entry: '.',
    });
  });

  it('normalizes a subpath import', () => {
    expect(
      normalizeEdificeModuleSpecifier('@edifice.io/react/icons/nav'),
    ).toEqual({
      package: '@edifice.io/react',
      entry: './icons/nav',
    });
  });

  it('returns null for non-@edifice.io specifiers', () => {
    expect(normalizeEdificeModuleSpecifier('react')).toBeNull();
    expect(
      normalizeEdificeModuleSpecifier('@edifice.io-not-really/react'),
    ).toBeNull();
  });
});

function parse(source: string) {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX },
  });
  return project.createSourceFile('/virtual/file.tsx', source);
}

describe('resolveEdificeImports', () => {
  it('resolves a plain named import', () => {
    const sf = parse(`import { Dropdown } from '@edifice.io/react';`);
    const bindings = resolveEdificeImports(sf);
    expect(bindings).toEqual([
      {
        type: 'named',
        package: '@edifice.io/react',
        entry: '.',
        importedName: 'Dropdown',
        localName: 'Dropdown',
        identifier: expect.anything(),
      },
    ]);
  });

  it('resolves an aliased named import', () => {
    const sf = parse(`import { Dropdown as D } from '@edifice.io/react';`);
    const [binding] = resolveEdificeImports(sf);
    expect(binding).toMatchObject({ importedName: 'Dropdown', localName: 'D' });
  });

  it('resolves a namespace import', () => {
    const sf = parse(`import * as EdificeUI from '@edifice.io/react';`);
    const [binding] = resolveEdificeImports(sf);
    expect(binding).toMatchObject({
      type: 'namespace',
      localName: 'EdificeUI',
      entry: '.',
    });
  });

  it('ignores non-@edifice.io imports', () => {
    const sf = parse(`import { useState } from 'react';`);
    expect(resolveEdificeImports(sf)).toEqual([]);
  });
});
