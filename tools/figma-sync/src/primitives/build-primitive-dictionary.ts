import { formatScssLiteral } from '../format-scss-literal.js';
import { resolvePrimitiveTarget } from '../naming/resolve-primitive-target.js';
import type {
  DictionaryEntry,
  PrimitiveBucket,
  PrimitiveDictionary,
  PrimitivesExportData,
} from '../types.js';

export const primitiveKey = (bucket: string, figmaName: string): string =>
  `${bucket}|${figmaName}`;

const BUCKETS: PrimitiveBucket[] = ['primitives', 'primitivesLegacy', 'text'];

/**
 * Construit le dictionnaire complet des primitives a partir des 3 collections
 * namespacees de l'export ({ primitives, primitivesLegacy, text }). Cle =
 * primitiveKey(bucket, figmaName) -- indispensable car un meme nom peut exister
 * dans deux collections differentes avec des valeurs differentes (ex: "danger/300").
 */
export function buildPrimitiveDictionary(
  data: PrimitivesExportData,
): PrimitiveDictionary {
  const targets = new Map<string, ReturnType<typeof resolvePrimitiveTarget>>();

  for (const bucket of BUCKETS) {
    for (const figmaName of Object.keys(data[bucket] ?? {})) {
      targets.set(
        primitiveKey(bucket, figmaName),
        resolvePrimitiveTarget(bucket, figmaName),
      );
    }
  }

  function resolve(
    bucket: PrimitiveBucket,
    figmaName: string,
    depth: number,
  ): string {
    if (depth > 10) {
      throw new Error(
        `Chaine d'alias trop longue pour la primitive "${bucket}/${figmaName}"`,
      );
    }
    const target = targets.get(primitiveKey(bucket, figmaName));
    if (target?.pinnedValue !== undefined) {
      return target.pinnedValue;
    }
    const entry = data[bucket]?.[figmaName];
    if (!entry) {
      throw new Error(
        `Primitive "${figmaName}" referencee mais absente de la collection "${bucket}"`,
      );
    }
    if (entry.value !== undefined) {
      return formatScssLiteral(figmaName, entry.value);
    }
    // Alias : aliasCollection indique dans quelle collection chercher la cible
    // (peut differer de "bucket", ex: bucket "text" -> aliasCollection "primitives").
    const aliasBucket = entry.aliasCollection as PrimitiveBucket | undefined;
    if (
      !aliasBucket ||
      !entry.alias ||
      !targets.has(primitiveKey(aliasBucket, entry.alias))
    ) {
      throw new Error(
        `Alias "${entry.alias}" (collection "${aliasBucket}") introuvable, reference depuis "${bucket}/${figmaName}"`,
      );
    }
    return `$${targets.get(primitiveKey(aliasBucket, entry.alias))!.scssVar}`;
  }

  const dictionary: PrimitiveDictionary = new Map();
  for (const bucket of BUCKETS) {
    for (const figmaName of Object.keys(data[bucket] ?? {})) {
      const target = targets.get(primitiveKey(bucket, figmaName))!;
      const resolvedValue = resolve(bucket, figmaName, 0);
      const entry: DictionaryEntry = { ...target, resolvedValue };
      dictionary.set(primitiveKey(bucket, figmaName), entry);
    }
  }

  return dictionary;
}
