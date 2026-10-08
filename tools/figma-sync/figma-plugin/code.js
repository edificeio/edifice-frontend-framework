// Edifice Token Extractor
// Runs in the Figma plugin sandbox. Does one thing only: read the local
// variables of the open file and serialize them into minimal JSON,
// preserving aliases (references to another variable) rather than
// duplicating a resolved value.

figma.showUI(__html__, { width: 480, height: 640 });

/**
 * Resolves a variable's value for a given mode.
 * - If it is an alias to another variable (even in a library
 *   imported from another file), returns { alias, aliasCollection }.
 *   aliasCollection is essential: two variables from different
 *   collections (e.g. "primitives" and "primitivesLegacy") can have
 *   the exact same name ("danger/300") with different values.
 * - Otherwise returns the raw value (color converted to hex, or value as is).
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
 * Extracts all local collections/variables of the currently open file.
 *
 * Root-level namespace:
 * - Single-mode collection (e.g. "primitives", "primitivesLegacy") -> the name
 *   of the COLLECTION, not of the mode (the mode is often just called "Value" and
 *   distinguishes nothing).
 * - Multi-mode collection (e.g. the themes) -> the name of the MODE, which carries
 *   the useful information (one/neo/edifice2d...).
 * Without this, two variables with the same name in two single-mode collections
 * silently overwrite each other (this is the bug fixed here).
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
