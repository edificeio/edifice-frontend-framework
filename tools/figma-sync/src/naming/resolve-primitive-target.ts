import type {
  NamingConfidence,
  PrimitiveBucket,
  PrimitiveTarget,
} from '../types.js';

/** Bucket "text" (Figma collection "text") -> always _primitives.scss. */
export const TEXT_OVERRIDES = new Map<string, string>([
  ['color/default', 'text-color-default'],
  ['color/subText', 'text-color-subtext'],
]);

/** "primitives" bucket -> always _primitives.scss. Exceptions to the generic kebab-case. */
export const PRIMITIVES_OVERRIDES = new Map<string, string>([
  ['font/family/playpenSans', 'font-family-playpensans'],
  // The repo keeps the uppercase "B" here (no general rule, just this variable).
  ['accessible/deepBlue', 'accessible-deepBlue'],
  ...(['xl', 'l', 'm', 's', 'xs', '2xs', '3xs'] as const).map(
    (size) => [`font/lineHeight/${size}`, `font-lineheight-${size}`] as const,
  ),
]);

interface LegacyOverride {
  scssVar: string;
  pinnedValue?: string;
}

/**
 * Bucket "primitivesLegacy" -> always _primitives-legacy.scss.
 * Deux sous-cas :
 * - explicit overrides (name or value follow no generic rule);
 * - the "legacy-" prefix for danger/success/warning/info/* and the font families,
 *   because _primitives-legacy.scss already carries these variables that way (verified in the repo);
 *   neo/*, one/* and nabook stay bare (no prefix), also verified in the repo.
 */
export const LEGACY_OVERRIDES = new Map<string, LegacyOverride>([
  ['nabook/700', { scssVar: 'nabook' }],
  // "KG June Bug" is the Figma display label, not the real CSS name: the
  // @font-face (tokens/_type.scss) declares `font-family: KGJune`, loaded from
  // KGJuneBug.ttf. We pin both the name AND the value; Figma must never overwrite this.
  [
    'font/family/kgJuneBug',
    { scssVar: 'legacy-font-family-kgjunebug', pinnedValue: "'KGJune'" },
  ],
]);

export function needsLegacyPrefix(figmaName: string): boolean {
  return (
    /^(danger|success|warning|info)\//.test(figmaName) ||
    figmaName.startsWith('font/family/')
  );
}

export function kebabCase(figmaName: string): string {
  return figmaName
    .split('/')
    .map((seg) => seg.replace(/([a-z0-9])([A-Z])/g, '$1-$2'))
    .join('-')
    .toLowerCase();
}

/**
 * Resolves a primitive entry to its target file and SCSS variable name.
 * `confidence: 'certain'` = found via an explicit exceptions table (verified
 * against the repo); `'guessed'` = generic kebab-case, never checked against an
 * existing convention -- to be flagged for review in the report.
 */
export function resolvePrimitiveTarget(
  bucket: PrimitiveBucket,
  figmaName: string,
): PrimitiveTarget {
  if (bucket === 'text') {
    const override = TEXT_OVERRIDES.get(figmaName);
    const confidence: NamingConfidence = override ? 'certain' : 'guessed';
    return {
      file: 'primitives',
      scssVar: override ?? `text-${kebabCase(figmaName)}`,
      confidence,
    };
  }

  if (bucket === 'primitives') {
    const override = PRIMITIVES_OVERRIDES.get(figmaName);
    const confidence: NamingConfidence = override ? 'certain' : 'guessed';
    return {
      file: 'primitives',
      scssVar: override ?? kebabCase(figmaName),
      confidence,
    };
  }

  if (bucket === 'primitivesLegacy') {
    const override = LEGACY_OVERRIDES.get(figmaName);
    if (override) {
      return { file: 'primitives-legacy', confidence: 'certain', ...override };
    }
    if (needsLegacyPrefix(figmaName)) {
      // Explicit rule verified against the repo (danger/success/warning/info/*,
      // font families): "certain", not a guess.
      return {
        file: 'primitives-legacy',
        scssVar: `legacy-${kebabCase(figmaName)}`,
        confidence: 'certain',
      };
    }
    if (figmaName.startsWith('neo/') || figmaName.startsWith('one/')) {
      // Also verified: these namespaces are always bare kebab-case, without prefix.
      return {
        file: 'primitives-legacy',
        scssVar: kebabCase(figmaName),
        confidence: 'certain',
      };
    }
    // Category never seen in this bucket: no verified rule
    // applies, generic kebab-case is a guess to review.
    return {
      file: 'primitives-legacy',
      scssVar: kebabCase(figmaName),
      confidence: 'guessed',
    };
  }

  throw new Error(
    `Collection de primitive inconnue "${String(bucket)}" pour "${figmaName}"`,
  );
}
