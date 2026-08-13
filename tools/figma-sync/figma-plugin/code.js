// Edifice Token Extractor
// Tourne dans le sandbox du plugin Figma. Ne fait qu'une chose : lire les
// variables locales du fichier ouvert et les sérialiser en JSON minimal,
// en préservant les alias (référence vers une autre variable) plutôt que
// de dupliquer une valeur résolue.

figma.showUI(__html__, { width: 480, height: 640 });

/**
 * Résout la valeur d'une variable pour un mode donné.
 * - Si c'est un alias vers une autre variable (même dans une bibliothèque
 *   importée depuis un autre fichier), on renvoie { alias, aliasCollection }.
 *   aliasCollection est indispensable : deux variables de collections
 *   différentes (ex: "primitives" et "primitivesLegacy") peuvent porter
 *   exactement le même nom ("danger/300") avec des valeurs différentes.
 * - Sinon on renvoie la valeur brute (couleur convertie en hex, ou valeur telle quelle).
 */
async function resolveValue(rawValue, depth) {
  if (depth > 10) {
    return { value: null, error: "alias trop profond" };
  }

  if (rawValue && typeof rawValue === "object" && rawValue.type === "VARIABLE_ALIAS") {
    const target = await figma.variables.getVariableByIdAsync(rawValue.id);
    if (!target) {
      return { value: null, error: "variable référencée introuvable" };
    }
    const targetCollection = await figma.variables.getVariableCollectionByIdAsync(
      target.variableCollectionId
    );
    return {
      alias: target.name,
      aliasCollection: targetCollection ? targetCollection.name : null,
    };
  }

  if (rawValue && typeof rawValue === "object" && "r" in rawValue && "g" in rawValue && "b" in rawValue) {
    return { value: rgbaToHex(rawValue) };
  }

  return { value: rawValue };
}

function rgbaToHex(color) {
  const toHex = (n) => Math.round(Math.max(0, Math.min(1, n)) * 255).toString(16).padStart(2, "0");
  const hex = `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
  const alpha = color.a === undefined ? 1 : color.a;
  return alpha < 1 ? `${hex}${toHex(alpha)}` : hex;
}

/**
 * Extrait toutes les collections/variables locales du fichier actuellement ouvert.
 *
 * Espace de noms du niveau racine :
 * - Collection à un seul mode (ex: "primitives", "primitivesLegacy") -> le nom
 *   de la COLLECTION, pas du mode (le mode s'appelle souvent juste "Value" et
 *   ne distingue rien).
 * - Collection à plusieurs modes (ex: les thèmes) -> le nom du MODE, qui porte
 *   l'information utile (one/neo/edifice2d...).
 * Sans ça, deux variables de même nom dans deux collections à un seul mode
 * s'écrasent silencieusement (c'est le bug corrigé ici).
 */
async function extractAll() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const variables = await figma.variables.getLocalVariablesAsync();

  const data = {};

  for (const collection of collections) {
    const isSingleMode = collection.modes.length === 1;
    const collectionVariables = variables.filter(
      (v) => v.variableCollectionId === collection.id
    );

    for (const variable of collectionVariables) {
      for (const mode of collection.modes) {
        const rawValue = variable.valuesByMode[mode.modeId];
        if (rawValue === undefined) continue;

        const resolved = await resolveValue(rawValue, 0);
        const bucketKey = isSingleMode ? collection.name : mode.name;

        if (!data[bucketKey]) data[bucketKey] = {};
        data[bucketKey][variable.name] = resolved;
      }
    }
  }

  return {
    fileName: figma.root.name,
    exportedAt: new Date().toISOString(),
    data,
  };
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === "export") {
    try {
      const output = await extractAll();
      figma.ui.postMessage({ type: "export-result", payload: output });
    } catch (err) {
      figma.ui.postMessage({
        type: "export-error",
        message: String((err && err.message) || err),
      });
    }
  }
};
