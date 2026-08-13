import { describe, expect, it } from 'vitest';
import { buildPatchPlan } from './orchestrate.js';
import type { PrimitivesExportData, SemanticExportData } from './types.js';

const primitivesData: PrimitivesExportData = {
  primitives: {
    'danger/200': { value: '#ffebeb' },
    // Pas d'override -> nom devine (confidence "guessed").
    'weird/newThing': { value: '#123456' },
  },
  primitivesLegacy: {
    'danger/200': { value: '#ffe9e9' },
  },
  text: {},
};

const semanticData: SemanticExportData = {
  edifice2d: {
    'color/support/danger': {
      alias: 'danger/200',
      aliasCollection: 'primitives',
    },
    // Hors one/neo et hors color/app/* -> doit generer un warning.
    'color/support/legacy200': {
      alias: 'danger/200',
      aliasCollection: 'primitivesLegacy',
    },
  },
  neo: {
    'color/support/danger': {
      alias: 'danger/200',
      aliasCollection: 'primitivesLegacy',
    },
  },
  // "one", "CRNA", "edifice1d" volontairement absents -> doivent finir dans skippedThemes.
};

const BASE_FLAT = '$danger-200: #ffebeb;\n';
const BASE_LEGACY = '$danger-200: #ffe9e9;\n';
const BASE_THEME = [
  '$m: (',
  '  color: (',
  '    support: (',
  '      old: $x,',
  '    ),',
  '  ),',
  ');',
  '',
].join('\n');

function baseTexts(): Record<string, string> {
  return {
    '_primitives.scss': BASE_FLAT,
    '_primitives-legacy.scss': BASE_LEGACY,
    '_one.scss': BASE_THEME,
    '_neo.scss': BASE_THEME,
    '_crna.scss': BASE_THEME,
    '_edifice1d.scss': BASE_THEME,
    '_edifice2d.scss': BASE_THEME,
  };
}

describe('buildPatchPlan', () => {
  it('flags names resolved via generic kebab-case fallback as "guessed", and known overrides/rules as "certain"', () => {
    const { report } = buildPatchPlan(
      primitivesData,
      semanticData,
      baseTexts(),
    );
    // "primitives/danger/200" n'a pas d'override -> devine. "primitivesLegacy/danger/200"
    // matche la regle verifiee "danger/*" -> prefixe legacy, donc "certain" (absent d'ici).
    expect(report.guessedNames).toEqual([
      {
        bucket: 'primitives',
        figmaName: 'danger/200',
        file: 'primitives',
        scssVar: 'danger-200',
      },
      {
        bucket: 'primitives',
        figmaName: 'weird/newThing',
        file: 'primitives',
        scssVar: 'weird-new-thing',
      },
    ]);
  });

  it('adds the new guessed primitive to _primitives.scss', () => {
    const { patchedText } = buildPatchPlan(
      primitivesData,
      semanticData,
      baseTexts(),
    );
    expect(patchedText['_primitives.scss']).toContain(
      '$weird-new-thing: #123456;',
    );
  });

  it('resolves each theme through the collection-specific primitive dictionary', () => {
    const { patchedText } = buildPatchPlan(
      primitivesData,
      semanticData,
      baseTexts(),
    );
    expect(patchedText['_edifice2d.scss']).toContain('danger: $danger-200,');
  });

  it('warns only when a non one/neo theme resolves through primitivesLegacy', () => {
    const { report } = buildPatchPlan(
      primitivesData,
      semanticData,
      baseTexts(),
    );
    expect(report.warnings).toHaveLength(1);
    expect(report.warnings[0]).toMatchObject({
      theme: 'edifice2d',
      token: 'color/support/legacy200',
    });
  });

  it('lists themes absent from the semantic export instead of throwing', () => {
    const { report } = buildPatchPlan(
      primitivesData,
      semanticData,
      baseTexts(),
    );
    expect(report.skippedThemes.sort()).toEqual(['CRNA', 'edifice1d', 'one']);
  });

  it('throws if a required config file text is missing', () => {
    const texts = baseTexts();
    delete texts['_neo.scss'];
    expect(() => buildPatchPlan(primitivesData, semanticData, texts)).toThrow(
      /_neo\.scss/,
    );
  });
});
