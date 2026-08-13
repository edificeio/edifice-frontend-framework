import { describe, expect, it } from 'vitest';
import { buildPrimitiveDictionary } from '../primitives/build-primitive-dictionary.js';
import type {
  FigmaTokenMap,
  LegacyWarning,
  PrimitivesExportData,
} from '../types.js';
import {
  buildLegacyVarReference,
  figmaPathToDotPath,
  isIgnoredSemanticKey,
  resolveSemanticToken,
} from './resolve-semantic-token.js';

const primitivesData: PrimitivesExportData = {
  primitives: { 'danger/200': { value: '#ffebeb' } },
  primitivesLegacy: { 'danger/200': { value: '#ffe9e9' } },
  text: {},
};

function makeCtx(mode: string, topLevelName: string) {
  const warnings: LegacyWarning[] = [];
  return { mode, topLevelName, warnings };
}

describe('figmaPathToDotPath', () => {
  it('lowercases every segment (fixes the lineHeight -> lineheight mismatch)', () => {
    expect(figmaPathToDotPath('font/button/lineHeight')).toBe(
      'font.button.lineheight',
    );
  });
});

describe('isIgnoredSemanticKey', () => {
  it('ignores theme, device and designVariables/* noise', () => {
    expect(isIgnoredSemanticKey('theme')).toBe(true);
    expect(isIgnoredSemanticKey('device')).toBe(true);
    expect(
      isIgnoredSemanticKey('designVariables/defaultPage/mainContainer/desktop'),
    ).toBe(true);
    expect(isIgnoredSemanticKey('color/support/danger/200')).toBe(false);
  });
});

describe('resolveSemanticToken', () => {
  const dictionary = buildPrimitiveDictionary(primitivesData);

  it('resolves a direct alias into the correct collection-specific primitive', () => {
    const modeTokens: FigmaTokenMap = {
      'color/support/danger/200': {
        alias: 'danger/200',
        aliasCollection: 'primitives',
      },
    };
    const ctx = makeCtx('edifice2d', 'color/support/danger/200');
    const value = resolveSemanticToken(
      'color/support/danger/200',
      modeTokens,
      dictionary,
      ctx,
      0,
    );
    expect(value).toBe('$danger-200');
    expect(ctx.warnings).toHaveLength(0);
  });

  it('follows a "theme" alias to another token within the same mode', () => {
    const modeTokens: FigmaTokenMap = {
      'font/family/title': {
        alias: 'danger/200',
        aliasCollection: 'primitives',
      },
      'font/button/family': {
        alias: 'font/family/title',
        aliasCollection: 'theme',
      },
    };
    const ctx = makeCtx('edifice2d', 'font/button/family');
    const value = resolveSemanticToken(
      'font/button/family',
      modeTokens,
      dictionary,
      ctx,
      0,
    );
    expect(value).toBe('$danger-200');
  });

  it('warns when a theme other than one/neo resolves through primitivesLegacy', () => {
    const modeTokens: FigmaTokenMap = {
      'color/support/danger/200': {
        alias: 'danger/200',
        aliasCollection: 'primitivesLegacy',
      },
    };
    const ctx = makeCtx('edifice2d', 'color/support/danger/200');
    resolveSemanticToken(
      'color/support/danger/200',
      modeTokens,
      dictionary,
      ctx,
      0,
    );
    expect(ctx.warnings).toHaveLength(1);
    expect(ctx.warnings[0]).toMatchObject({
      theme: 'edifice2d',
      token: 'color/support/danger/200',
    });
  });

  it('does not warn for one/neo resolving through primitivesLegacy (expected by design)', () => {
    for (const mode of ['one', 'neo']) {
      const modeTokens: FigmaTokenMap = {
        'color/support/danger/200': {
          alias: 'danger/200',
          aliasCollection: 'primitivesLegacy',
        },
      };
      const ctx = makeCtx(mode, 'color/support/danger/200');
      resolveSemanticToken(
        'color/support/danger/200',
        modeTokens,
        dictionary,
        ctx,
        0,
      );
      expect(ctx.warnings).toHaveLength(0);
    }
  });

  it('does not warn for color/app/* resolving through primitivesLegacy even outside one/neo', () => {
    const modeTokens: FigmaTokenMap = {
      'color/app/communicate': {
        alias: 'danger/200',
        aliasCollection: 'primitivesLegacy',
      },
    };
    const ctx = makeCtx('edifice2d', 'color/app/communicate');
    resolveSemanticToken(
      'color/app/communicate',
      modeTokens,
      dictionary,
      ctx,
      0,
    );
    expect(ctx.warnings).toHaveLength(0);
  });

  it('throws on a broken alias chain rather than silently resolving to the wrong value', () => {
    const modeTokens: FigmaTokenMap = {
      'color/x': { alias: 'does/not/exist', aliasCollection: 'primitives' },
    };
    const ctx = makeCtx('edifice2d', 'color/x');
    expect(() =>
      resolveSemanticToken('color/x', modeTokens, dictionary, ctx, 0),
    ).toThrow(/introuvable/);
  });

  it('namespaces primitivesLegacy references with "legacy." for themes that import it non-global', () => {
    const modeTokens: FigmaTokenMap = {
      'color/app/communicate': {
        alias: 'danger/200',
        aliasCollection: 'primitivesLegacy',
      },
    };
    for (const mode of ['CRNA', 'edifice1d', 'edifice2d']) {
      const ctx = makeCtx(mode, 'color/app/communicate');
      const value = resolveSemanticToken(
        'color/app/communicate',
        modeTokens,
        dictionary,
        ctx,
        0,
      );
      // "danger/200" en primitivesLegacy matche needsLegacyPrefix -> "legacy-danger-200".
      expect(value).toBe('legacy.$legacy-danger-200');
    }
  });

  it('keeps a bare "$var" reference for one/neo, which import primitives-legacy globally', () => {
    const modeTokens: FigmaTokenMap = {
      'color/support/danger/200': {
        alias: 'danger/200',
        aliasCollection: 'primitivesLegacy',
      },
    };
    for (const mode of ['one', 'neo']) {
      const ctx = makeCtx(mode, 'color/support/danger/200');
      const value = resolveSemanticToken(
        'color/support/danger/200',
        modeTokens,
        dictionary,
        ctx,
        0,
      );
      expect(value).toBe('$legacy-danger-200');
    }
  });

  it('never namespaces references into the "primitives" (non-legacy) collection', () => {
    const modeTokens: FigmaTokenMap = {
      'color/support/danger/200': {
        alias: 'danger/200',
        aliasCollection: 'primitives',
      },
    };
    const ctx = makeCtx('edifice2d', 'color/support/danger/200');
    const value = resolveSemanticToken(
      'color/support/danger/200',
      modeTokens,
      dictionary,
      ctx,
      0,
    );
    expect(value).toBe('$danger-200');
  });
});

describe('buildLegacyVarReference', () => {
  it('namespaces with "legacy." for every theme except one/neo', () => {
    expect(buildLegacyVarReference('edifice2d', 'neo-orange-500')).toBe(
      'legacy.$neo-orange-500',
    );
    expect(buildLegacyVarReference('CRNA', 'neo-orange-500')).toBe(
      'legacy.$neo-orange-500',
    );
    expect(buildLegacyVarReference('edifice1d', 'neo-orange-500')).toBe(
      'legacy.$neo-orange-500',
    );
  });

  it('returns a bare "$var" for one and neo', () => {
    expect(buildLegacyVarReference('one', 'neo-orange-500')).toBe(
      '$neo-orange-500',
    );
    expect(buildLegacyVarReference('neo', 'neo-orange-500')).toBe(
      '$neo-orange-500',
    );
  });
});
