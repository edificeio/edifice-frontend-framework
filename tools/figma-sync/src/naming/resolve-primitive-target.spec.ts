import { describe, expect, it } from 'vitest';
import {
  kebabCase,
  needsLegacyPrefix,
  resolvePrimitiveTarget,
} from './resolve-primitive-target.js';

describe('kebabCase', () => {
  it('converts figma slash paths to kebab-case, lowercased', () => {
    expect(kebabCase('numbers/8')).toBe('numbers-8');
    expect(kebabCase('font/lineHeight/xl')).toBe('font-line-height-xl');
    expect(kebabCase('accessible/deepBlue')).toBe('accessible-deep-blue');
  });
});

describe('needsLegacyPrefix', () => {
  it('flags danger/success/warning/info and font families, not neo/one', () => {
    expect(needsLegacyPrefix('danger/300')).toBe(true);
    expect(needsLegacyPrefix('success/500')).toBe(true);
    expect(needsLegacyPrefix('font/family/comfortaa')).toBe(true);
    expect(needsLegacyPrefix('neo/orange/500')).toBe(false);
    expect(needsLegacyPrefix('one/pink/500')).toBe(false);
  });
});

describe('resolvePrimitiveTarget', () => {
  it('routes the "text" bucket to _primitives.scss via explicit overrides', () => {
    expect(resolvePrimitiveTarget('text', 'color/default')).toEqual({
      file: 'primitives',
      scssVar: 'text-color-default',
      confidence: 'certain',
    });
    expect(resolvePrimitiveTarget('text', 'color/subText')).toEqual({
      file: 'primitives',
      scssVar: 'text-color-subtext',
      confidence: 'certain',
    });
  });

  it('flags an unmapped "text" entry as guessed rather than silently inventing a name', () => {
    const result = resolvePrimitiveTarget('text', 'color/somethingNew');
    expect(result.confidence).toBe('guessed');
  });

  it('applies known overrides in the "primitives" bucket (certain)', () => {
    expect(resolvePrimitiveTarget('primitives', 'accessible/deepBlue')).toEqual(
      {
        file: 'primitives',
        scssVar: 'accessible-deepBlue',
        confidence: 'certain',
      },
    );
    expect(resolvePrimitiveTarget('primitives', 'font/lineHeight/xl')).toEqual({
      file: 'primitives',
      scssVar: 'font-lineheight-xl',
      confidence: 'certain',
    });
  });

  it('falls back to generic kebab-case in "primitives" for anything unmapped (guessed)', () => {
    expect(resolvePrimitiveTarget('primitives', 'grey/900')).toEqual({
      file: 'primitives',
      scssVar: 'grey-900',
      confidence: 'guessed',
    });
  });

  it('pins the kgJuneBug name AND value in "primitivesLegacy", ignoring the Figma value entirely', () => {
    const result = resolvePrimitiveTarget(
      'primitivesLegacy',
      'font/family/kgJuneBug',
    );
    expect(result).toEqual({
      file: 'primitives-legacy',
      scssVar: 'legacy-font-family-kgjunebug',
      pinnedValue: "'KGJune'",
      confidence: 'certain',
    });
  });

  it('adds the nabook override without any numeric suffix', () => {
    expect(resolvePrimitiveTarget('primitivesLegacy', 'nabook/700')).toEqual({
      file: 'primitives-legacy',
      scssVar: 'nabook',
      confidence: 'certain',
    });
  });

  it('prefixes danger/success/warning/info with legacy- in "primitivesLegacy" (certain)', () => {
    expect(resolvePrimitiveTarget('primitivesLegacy', 'danger/300')).toEqual({
      file: 'primitives-legacy',
      scssVar: 'legacy-danger-300',
      confidence: 'certain',
    });
  });

  it('never prefixes neo/* or one/* with legacy- (certain)', () => {
    expect(
      resolvePrimitiveTarget('primitivesLegacy', 'neo/orange/700'),
    ).toEqual({
      file: 'primitives-legacy',
      scssVar: 'neo-orange-700',
      confidence: 'certain',
    });
    expect(resolvePrimitiveTarget('primitivesLegacy', 'one/pink/500')).toEqual({
      file: 'primitives-legacy',
      scssVar: 'one-pink-500',
      confidence: 'certain',
    });
  });

  it('flags a genuinely new category in "primitivesLegacy" as guessed', () => {
    const result = resolvePrimitiveTarget('primitivesLegacy', 'brandNew/999');
    expect(result.confidence).toBe('guessed');
    expect(result.scssVar).toBe('brand-new-999');
  });
});
