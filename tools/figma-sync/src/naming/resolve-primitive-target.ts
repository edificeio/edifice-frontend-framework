import type {
  NamingConfidence,
  PrimitiveBucket,
  PrimitiveTarget,
} from '../types.js';

/** Bucket "text" (collection Figma "text") -> toujours _primitives.scss. */
export const TEXT_OVERRIDES = new Map<string, string>([
  ['color/default', 'text-color-default'],
  ['color/subText', 'text-color-subtext'],
]);

/** Bucket "primitives" -> toujours _primitives.scss. Exceptions au kebab-case generique. */
export const PRIMITIVES_OVERRIDES = new Map<string, string>([
  ['font/family/playpenSans', 'font-family-playpensans'],
  // Le repo garde le "B" majuscule ici (pas de regle generale, juste cette variable).
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
 * Bucket "primitivesLegacy" -> toujours _primitives-legacy.scss.
 * Deux sous-cas :
 * - overrides explicites (nom ou valeur ne suivent aucune regle generique) ;
 * - le prefixe "legacy-" pour danger/success/warning/info/* et les familles de police,
 *   car _primitives-legacy.scss porte deja ces variables ainsi (verifie dans le repo) ;
 *   neo/*, one/* et nabook restent nus (pas de prefixe), egalement verifie dans le repo.
 */
export const LEGACY_OVERRIDES = new Map<string, LegacyOverride>([
  ['nabook/700', { scssVar: 'nabook' }],
  // "KG June Bug" est le libelle d'affichage Figma, pas le nom CSS reel : le
  // @font-face (tokens/_type.scss) declare `font-family: KGJune`, charge depuis
  // KGJuneBug.ttf. On fige le nom ET la valeur, Figma ne doit jamais ecraser ca.
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
 * Resout une entree de primitive vers son fichier et son nom de variable SCSS cibles.
 * `confidence: 'certain'` = trouve via une table d'exceptions explicite (verifiee
 * contre le repo) ; `'guessed'` = kebab-case generique, jamais confronte a une
 * convention existante -- a signaler pour relecture dans le rapport.
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
      // Regle explicite verifiee contre le repo (danger/success/warning/info/*,
      // familles de police) : "certain", pas un pari.
      return {
        file: 'primitives-legacy',
        scssVar: `legacy-${kebabCase(figmaName)}`,
        confidence: 'certain',
      };
    }
    if (figmaName.startsWith('neo/') || figmaName.startsWith('one/')) {
      // Egalement verifie : ces namespaces sont toujours en kebab-case nu, sans prefixe.
      return {
        file: 'primitives-legacy',
        scssVar: kebabCase(figmaName),
        confidence: 'certain',
      };
    }
    // Categorie jamais rencontree dans ce bucket : aucune regle verifiee ne
    // s'applique, le kebab-case generique est un pari a relire.
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
