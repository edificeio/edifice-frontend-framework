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
 * Excludes the binding's own import statement from its usage count — a
 * re-declaration under the same local name in another import (unlikely,
 * but not impossible with multiple import statements) would otherwise
 * count as a usage of itself.
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

/**
 * Whether `candidate` resolves to the exact same binding as `identifier`
 * (the import specifier) — comparing the checker's underlying `ts.Symbol`
 * rather than ts-morph's `Symbol` wrapper, which isn't guaranteed to be the
 * same instance across two `getSymbol()` calls for the same binding.
 */
function referencesSameBinding(candidate: Node, identifier: Node): boolean {
  if (candidate === identifier || !Node.isIdentifier(candidate)) return false;
  if (candidate.getText() !== identifier.getText()) return false;

  const candidateSymbol = candidate.getSymbol();
  const bindingSymbol = identifier.getSymbol();
  return (
    candidateSymbol !== undefined &&
    bindingSymbol !== undefined &&
    candidateSymbol.compilerSymbol === bindingSymbol.compilerSymbol
  );
}

function isRealUsageSite(node: Node): boolean {
  return !isPartOfImportDeclaration(node) && !isClosingJsxTagName(node);
}

/**
 * Finds every reference to `identifier` (an import specifier) within its
 * own `sourceFile` only — never `findReferencesAsNodes()`, which searches
 * the *entire* project for a result this function then discards down to a
 * single file anyway (REVIEW-impact-analyzer.md P4.2: measured ~15s for
 * `analyzeAppUsage` on a 230-file real app, dominated by this call). A
 * plain text-match walk over the file's own identifiers, narrowed by
 * comparing each candidate's resolved symbol to the binding's, is
 * file-scoped work the checker already has to do to answer "what does this
 * identifier bind to" — it never needs to search other files the way a
 * cross-file reference search does.
 */
function findReferencesInFile(
  identifier: Node,
  sourceFile: SourceFile,
): Node[] {
  const name = identifier.getText();
  const references: Node[] = [];
  sourceFile.forEachDescendant((node) => {
    if (node.getText() !== name) return;
    if (!referencesSameBinding(node, identifier)) return;
    references.push(node);
  });
  return references.filter(isRealUsageSite);
}

function countReferencesInFile(
  identifier: Node,
  sourceFile: SourceFile,
): number {
  return findReferencesInFile(identifier, sourceFile).length;
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
  const refs = findReferencesInFile(binding.identifier, sourceFile);

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
