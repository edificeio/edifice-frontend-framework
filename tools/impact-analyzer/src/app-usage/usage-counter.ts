import { Node, SourceFile, SyntaxKind } from 'ts-morph';
import type {
  ImportBinding,
  NamedImportBinding,
  NamespaceImportBinding,
} from './import-resolver.js';

export interface ResolvedUsage {
  package: string;
  entry: string;
  importedName: string;
  localName: string;
  file: string;
  usageSites: number;
  viaNamespace: boolean;
}

/**
 * `findReferencesAsNodes()` includes the declaration site itself (the
 * import specifier), and re-wraps AST nodes lazily — so `!==` identity
 * checks against the original identifier are unreliable. Filtering by
 * "is this reference part of an import declaration" excludes both the
 * binding's own import statement and, incidentally, any other file's
 * import of the same exported name (which findReferencesAsNodes also
 * surfaces, since it resolves through the original declaration) — neither
 * should ever count as a usage site.
 */
function isPartOfImportDeclaration(node: Node): boolean {
  return (
    node.getFirstAncestorByKind(SyntaxKind.ImportDeclaration) !== undefined
  );
}

/**
 * A non-self-closing JSX element (`<Foo>...</Foo>`) carries its tag name
 * identifier TWICE in the AST — once for the opening tag, once for the
 * closing tag — and both are real references to the same binding. Counting
 * both would silently double every non-self-closing usage, so only the
 * opening/self-closing occurrence is treated as a usage site.
 */
function isClosingJsxTagName(node: Node): boolean {
  const parent = node.getParent();
  if (!parent) return false;
  if (Node.isJsxClosingElement(parent)) return true;
  if (
    Node.isPropertyAccessExpression(parent) &&
    parent.getExpression() === node
  ) {
    const grandParent = parent.getParent();
    return !!grandParent && Node.isJsxClosingElement(grandParent);
  }
  return false;
}

function countReferencesInFile(
  identifier: Node,
  sourceFile: SourceFile,
): number {
  return identifier
    .findReferencesAsNodes()
    .filter(
      (node) =>
        node.getSourceFile() === sourceFile &&
        !isPartOfImportDeclaration(node) &&
        !isClosingJsxTagName(node),
    ).length;
}

function countNamedUsage(
  binding: NamedImportBinding,
  sourceFile: SourceFile,
): ResolvedUsage {
  return {
    package: binding.package,
    entry: binding.entry,
    importedName: binding.importedName,
    localName: binding.localName,
    file: sourceFile.getFilePath().toString(),
    usageSites: countReferencesInFile(binding.identifier, sourceFile),
    viaNamespace: false,
  };
}

/**
 * `import * as EdificeUI` usage is counted per accessed property
 * (`EdificeUI.Dropdown`) rather than per import statement — each distinct
 * property accessed is a distinct FF symbol actually consumed.
 */
function countNamespaceUsage(
  binding: NamespaceImportBinding,
  sourceFile: SourceFile,
): ResolvedUsage[] {
  const propertyCounts = new Map<string, number>();

  const refs = binding.identifier
    .findReferencesAsNodes()
    .filter(
      (node) =>
        node.getSourceFile() === sourceFile &&
        !isPartOfImportDeclaration(node) &&
        !isClosingJsxTagName(node),
    );

  for (const ref of refs) {
    const parent = ref.getParent();
    if (
      parent &&
      Node.isPropertyAccessExpression(parent) &&
      parent.getExpression() === ref
    ) {
      const propertyName = parent.getName();
      propertyCounts.set(
        propertyName,
        (propertyCounts.get(propertyName) ?? 0) + 1,
      );
    }
  }

  return [...propertyCounts.entries()].map(([importedName, usageSites]) => ({
    package: binding.package,
    entry: binding.entry,
    importedName,
    localName: binding.localName,
    file: sourceFile.getFilePath().toString(),
    usageSites,
    viaNamespace: true,
  }));
}

/** Resolves real usage-site counts (not just import lines) for every @edifice.io/* binding in a file. */
export function resolveUsagesForFile(
  sourceFile: SourceFile,
  bindings: ImportBinding[],
): ResolvedUsage[] {
  const usages: ResolvedUsage[] = [];
  for (const binding of bindings) {
    if (binding.type === 'named') {
      usages.push(countNamedUsage(binding, sourceFile));
    } else {
      usages.push(...countNamespaceUsage(binding, sourceFile));
    }
  }
  return usages;
}
