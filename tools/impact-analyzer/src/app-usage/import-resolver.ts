import { Node, SourceFile } from 'ts-morph';

export interface NormalizedEdificeModule {
  package: string;
  entry: string;
}

/**
 * Splits a module specifier like "@edifice.io/react/icons/nav" into the FF
 * package name and the `exports` subpath it corresponds to. Returns null
 * for anything that isn't an @edifice.io/* import.
 */
export function normalizeEdificeModuleSpecifier(
  moduleSpecifier: string,
): NormalizedEdificeModule | null {
  const scope = '@edifice.io/';
  if (!moduleSpecifier.startsWith(scope)) return null;

  const withoutScope = moduleSpecifier.slice(scope.length); // "react/icons/nav"
  const slashIndex = withoutScope.indexOf('/');
  if (slashIndex === -1) {
    return { package: `${scope}${withoutScope}`, entry: '.' };
  }

  const packageName = withoutScope.slice(0, slashIndex);
  const rest = withoutScope.slice(slashIndex + 1);
  return { package: `${scope}${packageName}`, entry: `./${rest}` };
}

export interface NamedImportBinding {
  type: 'named';
  package: string;
  entry: string;
  importedName: string;
  localName: string;
  identifier: Node;
}

export interface NamespaceImportBinding {
  type: 'namespace';
  package: string;
  entry: string;
  localName: string;
  identifier: Node;
}

export type ImportBinding = NamedImportBinding | NamespaceImportBinding;

/**
 * Resolves every @edifice.io/* import in a source file into normalized
 * bindings — named (with `as` alias support) or namespace (`import * as`).
 */
export function resolveEdificeImports(sourceFile: SourceFile): ImportBinding[] {
  const bindings: ImportBinding[] = [];

  for (const importDecl of sourceFile.getImportDeclarations()) {
    const normalized = normalizeEdificeModuleSpecifier(
      importDecl.getModuleSpecifierValue(),
    );
    if (!normalized) continue;

    const namespaceImport = importDecl.getNamespaceImport();
    if (namespaceImport) {
      bindings.push({
        type: 'namespace',
        package: normalized.package,
        entry: normalized.entry,
        localName: namespaceImport.getText(),
        identifier: namespaceImport,
      });
      continue;
    }

    const defaultImport = importDecl.getDefaultImport();
    if (defaultImport) {
      bindings.push({
        type: 'named',
        package: normalized.package,
        entry: normalized.entry,
        importedName: 'default',
        localName: defaultImport.getText(),
        identifier: defaultImport,
      });
    }

    for (const named of importDecl.getNamedImports()) {
      const importedName = named.getNameNode().getText();
      const aliasNode = named.getAliasNode();
      bindings.push({
        type: 'named',
        package: normalized.package,
        entry: normalized.entry,
        importedName,
        localName: aliasNode ? aliasNode.getText() : importedName,
        identifier: aliasNode ?? named.getNameNode(),
      });
    }
  }

  return bindings;
}
