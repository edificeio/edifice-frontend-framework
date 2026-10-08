import { describe, expect, it } from 'vitest';
import type { PrimitivesExportData } from '../types.js';
import {
  buildPrimitiveDictionary,
  primitiveKey,
} from './build-primitive-dictionary.js';

describe('buildPrimitiveDictionary', () => {
  it('resolves literal values with unit conversion applied', () => {
    const data: PrimitivesExportData = {
      primitives: { 'numbers/8': { value: 8 } },
      primitivesLegacy: {},
      text: {},
    };
    const dict = buildPrimitiveDictionary(data);
    expect(
      dict.get(primitiveKey('primitives', 'numbers/8'))?.resolvedValue,
    ).toBe('0.8rem');
  });

  it('resolves an alias within the same collection to a $variable reference', () => {
    const data: PrimitivesExportData = {
      primitives: {
        'blue/200': { value: '#e6ebfe' },
        'info/200': { alias: 'blue/200', aliasCollection: 'primitives' },
      },
      primitivesLegacy: {},
      text: {},
    };
    const dict = buildPrimitiveDictionary(data);
    expect(
      dict.get(primitiveKey('primitives', 'info/200'))?.resolvedValue,
    ).toBe('$blue-200');
  });

  it('resolves the same bare name in two different collections to different values (the collision bug)', () => {
    const data: PrimitivesExportData = {
      primitives: { 'danger/300': { value: '#ffbdbd' } },
      primitivesLegacy: { 'danger/300': { value: '#f3a6a6' } },
      text: {},
    };
    const dict = buildPrimitiveDictionary(data);
    expect(
      dict.get(primitiveKey('primitives', 'danger/300'))?.resolvedValue,
    ).toBe('#ffbdbd');
    expect(
      dict.get(primitiveKey('primitivesLegacy', 'danger/300'))?.resolvedValue,
    ).toBe('#f3a6a6');
    expect(dict.get(primitiveKey('primitives', 'danger/300'))?.scssVar).toBe(
      'danger-300',
    );
    expect(
      dict.get(primitiveKey('primitivesLegacy', 'danger/300'))?.scssVar,
    ).toBe('legacy-danger-300');
  });

  it('resolves a "text" bucket alias that points into the "primitives" collection', () => {
    const data: PrimitivesExportData = {
      primitives: { 'grey/900': { value: '#383838' } },
      primitivesLegacy: {},
      text: {
        'color/default': { alias: 'grey/900', aliasCollection: 'primitives' },
      },
    };
    const dict = buildPrimitiveDictionary(data);
    expect(dict.get(primitiveKey('text', 'color/default'))?.resolvedValue).toBe(
      '$grey-900',
    );
  });

  it('pins the kgJuneBug value regardless of what Figma actually exports for it', () => {
    const data: PrimitivesExportData = {
      primitives: {},
      primitivesLegacy: { 'font/family/kgJuneBug': { value: 'KG June Bug' } },
      text: {},
    };
    const dict = buildPrimitiveDictionary(data);
    expect(
      dict.get(primitiveKey('primitivesLegacy', 'font/family/kgJuneBug'))
        ?.resolvedValue,
    ).toBe("'KGJune'");
  });

  it('throws when an alias points at a collection that is not in the export', () => {
    const data: PrimitivesExportData = {
      primitives: {
        'info/200': { alias: 'blue/200', aliasCollection: 'primitives' },
      },
      primitivesLegacy: {},
      text: {},
    };
    expect(() => buildPrimitiveDictionary(data)).toThrow(/introuvable/);
  });
});
