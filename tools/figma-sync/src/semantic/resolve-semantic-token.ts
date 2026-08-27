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

// Themes ou l'usage de la collection "primitivesLegacy" est legitime pour TOUS
// les tokens (pas seulement danger/success/warning/info) : one et neo sont
// litteralement construits sur cette collection. Ce sont aussi les seuls themes
// qui importent primitives-legacy en global (`@use 'primitives-legacy' as *;`) --
// tous les autres l'importent namespace (`@use 'primitives-legacy' as legacy;`),
// donc doivent prefixer chaque reference avec "legacy." (cf. buildLegacyVarReference).
export const THEMES_ALLOWED_LEGACY = new Set(['one', 'neo']);

/** Namespace utilise par `@use 'primitives-legacy' as legacy;` dans les themes
 *  qui n'importent pas primitives-legacy en global (tous sauf one/neo). */
export const LEGACY_NAMESPACE = 'legacy';

/**
 * Construit la reference SCSS vers une primitive de la collection
 * "primitivesLegacy", selon que le theme cible l'importe en global (one/neo,
 * `as *` -> reference nue `$var`) ou namespace (les autres, `as legacy` ->
 * `legacy.$var`).
 */
export function buildLegacyVarReference(mode: string, scssVar: string): string {
  return THEMES_ALLOWED_LEGACY.has(mode)
    ? `$${scssVar}`
    : `${LEGACY_NAMESPACE}.$${scssVar}`;
}

// Tokens qui utilisent primitivesLegacy par conception pour TOUS les themes
// (couleurs d'applications, reutilisent volontairement la palette one/neo).
// Confirme par la donnee : color/app/* est en primitivesLegacy pour les 5 themes.
export const LEGACY_ALLOWED_PREFIXES = ['color/app/'];

/** Segments non pertinents pour les 7 fichiers de config (bruit de l'export). */
export function isIgnoredSemanticKey(figmaName: string): boolean {
  return (
    figmaName === 'theme' ||
    figmaName === 'device' ||
    figmaName.startsWith('designVariables/')
  );
}

export function figmaPathToDotPath(figmaName: string): string {
  // Le repo n'utilise jamais de camelCase dans les cles de map (ex: "lineheight",
  // pas "lineHeight") : on aligne systematiquement en minuscules.
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
 * Suit la chaine d'alias d'un token semantique jusqu'a une primitive, ou jusqu'a
 * une valeur litterale declaree directement dans le theme. Peut traverser :
 * - aliasCollection "theme" : la cible est un autre token du meme mode ;
 * - aliasCollection "primitives" / "primitivesLegacy" / "text" : la cible est
 *   une primitive, cherchee dans le dictionnaire namespace par collection.
 *
 * ctx accumule les warnings non bloquants (usage de primitivesLegacy en dehors
 * de one/neo, hors exceptions connues) dans ctx.warnings.
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
