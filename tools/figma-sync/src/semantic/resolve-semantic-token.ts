import { primitiveKey } from '../primitives/build-primitive-dictionary.js';
import { formatScssLiteral } from '../format-scss-literal.js';
import type {
  FigmaTokenMap,
  LegacyWarning,
  PrimitiveDictionary,
} from '../types.js';

export const THEME_MODE_TO_FILE: Record<string, string> = {
  one: '_one.scss',
  neo: '_neo.scss',
  CRNA: '_crna.scss',
  edifice1d: '_edifice1d.scss',
  edifice2d: '_edifice2d.scss',
};

// Themes where using the "primitivesLegacy" collection is legitimate for ALL
// tokens (not only danger/success/warning/info): one and neo are
// literally built on this collection. They are also the only themes
// that import primitives-legacy globally (`@use 'primitives-legacy' as *;`) --
// all the others import it namespaced (`@use 'primitives-legacy' as legacy;`),
// so they must prefix every reference with "legacy." (see buildLegacyVarReference).
export const THEMES_ALLOWED_LEGACY = new Set(['one', 'neo']);

/** Namespace used by `@use 'primitives-legacy' as legacy;` in the themes
 *  that do not import primitives-legacy globally (all except one/neo). */
export const LEGACY_NAMESPACE = 'legacy';

/**
 * Builds the SCSS reference to a primitive of the
 * "primitivesLegacy" collection, depending on whether the target theme imports it globally (one/neo,
 * `as *` -> bare `$var` reference) or namespaced (the others, `as legacy` ->
 * `legacy.$var`).
 */
export function buildLegacyVarReference(mode: string, scssVar: string): string {
  return THEMES_ALLOWED_LEGACY.has(mode)
    ? `$${scssVar}`
    : `${LEGACY_NAMESPACE}.$${scssVar}`;
}

// Tokens that use primitivesLegacy by design for ALL themes
// (application colors, deliberately reuse the one/neo palette).
// Confirmed by the data: color/app/* is in primitivesLegacy for all 5 themes.
export const LEGACY_ALLOWED_PREFIXES = ['color/app/'];

/** Segments not relevant to the 7 config files (export noise). */
export function isIgnoredSemanticKey(figmaName: string): boolean {
  return (
    figmaName === 'theme' ||
    figmaName === 'device' ||
    figmaName.startsWith('designVariables/')
  );
}

export function figmaPathToDotPath(figmaName: string): string {
  // The repo never uses camelCase in map keys (e.g. "lineheight",
  // not "lineHeight"): we systematically align to lowercase.
  return figmaName
    .split('/')
    .map((seg) => seg.toLowerCase())
    .join('.');
}

interface ResolveContext {
  mode: string;
  topLevelName: string;
  warnings: LegacyWarning[];
}

/**
 * Follows the alias chain of a semantic token down to a primitive, or down to
 * a literal value declared directly in the theme. Can traverse:
 * - aliasCollection "theme": the target is another token of the same mode;
 * - aliasCollection "primitives" / "primitivesLegacy" / "text": the target is
 *   a primitive, looked up in the dictionary namespaced by collection.
 *
 * ctx accumulates non-blocking warnings (use of primitivesLegacy outside
 * one/neo, apart from known exceptions) in ctx.warnings.
 */
export function resolveSemanticToken(
  figmaName: string,
  modeTokens: FigmaTokenMap,
  primitiveDictionary: PrimitiveDictionary,
  ctx: ResolveContext,
  depth: number,
): string {
  if (depth > 10) {
    throw new Error(
      `Chaine d'alias trop longue pour le token semantique "${figmaName}"`,
    );
  }
  const entry = modeTokens[figmaName];
  if (!entry) {
    throw new Error(
      `Token semantique "${figmaName}" reference mais absent de l'export`,
    );
  }
  if (entry.value !== undefined) {
    return formatScssLiteral(figmaName, entry.value);
  }

  const aliasTarget = entry.alias;
  const aliasCollection = entry.aliasCollection;
  if (!aliasTarget) {
    throw new Error(
      `Token semantique "${figmaName}" n'a ni valeur ni alias exploitable`,
    );
  }

  if (aliasCollection === 'theme') {
    if (!modeTokens[aliasTarget]) {
      throw new Error(
        `Alias interne au theme "${aliasTarget}" (depuis "${figmaName}") introuvable`,
      );
    }
    return resolveSemanticToken(
      aliasTarget,
      modeTokens,
      primitiveDictionary,
      ctx,
      depth + 1,
    );
  }

  const key = primitiveKey(aliasCollection ?? '', aliasTarget);
  if (!primitiveDictionary.has(key)) {
    throw new Error(
      `Alias "${aliasTarget}" (collection "${aliasCollection}", depuis "${figmaName}") introuvable dans les primitives`,
    );
  }

  if (
    aliasCollection === 'primitivesLegacy' &&
    !THEMES_ALLOWED_LEGACY.has(ctx.mode) &&
    !LEGACY_ALLOWED_PREFIXES.some((p) => ctx.topLevelName.startsWith(p))
  ) {
    ctx.warnings.push({
      theme: ctx.mode,
      token: ctx.topLevelName,
      via: figmaName,
      primitive: aliasTarget,
      message: `Theme "${ctx.mode}" resout "${ctx.topLevelName}" via la collection primitivesLegacy (probable erreur design, attendu seulement pour one/neo)`,
    });
  }

  const scssVar = primitiveDictionary.get(key)!.scssVar;
  if (aliasCollection === 'primitivesLegacy') {
    return buildLegacyVarReference(ctx.mode, scssVar);
  }
  return `$${scssVar}`;
}
