import { ExportedDeclarations, Node, Project, SyntaxKind } from 'ts-morph';
import type { SymbolKind } from '../types/index-schema.js';

export function createFfProject(tsconfigPath: string): Project {
  return new Project({
    tsConfigFilePath: tsconfigPath,
    skipAddingFilesFromTsConfig: true,
  });
}

function isReactComponentClass(decl: Node): boolean {
  if (!Node.isClassDeclaration(decl)) return false;
  const heritage = decl
    .getHeritageClauses()
    .map((h) => h.getText())
    .join(' ');
  return /Component/.test(heritage);
}

function looksLikeComponentReturnType(decl: Node): boolean {
  if (
    Node.isFunctionDeclaration(decl) ||
    Node.isArrowFunction(decl) ||
    Node.isFunctionExpression(decl)
  ) {
    const body = decl.getBody();
    if (body && Node.isBlock(body)) {
      return (
        body.getDescendantsOfKind(SyntaxKind.JsxElement).length > 0 ||
        body.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length >
          0 ||
        body.getDescendantsOfKind(SyntaxKind.JsxFragment).length > 0
      );
    }
    if (body && !Node.isBlock(body)) {
      // Concise arrow body, e.g. `() => <div />`
      return (
        Node.isJsxElement(body) ||
        Node.isJsxSelfClosingElement(body) ||
        Node.isJsxFragment(body)
      );
    }
  }
  return false;
}

/**
 * Best-effort classification: exact kind isn't derivable from the AST alone
 * for every case, so this is a documented heuristic, not a guarantee
 * (plan §12 accepts imperfect classification here).
 */
export function inferSymbolKind(
  name: string,
  declarations: Node[],
): SymbolKind {
  if (/^use[A-Z0-9]/.test(name)) return 'hook';

  const declaresType = declarations.some(
    (d) => Node.isInterfaceDeclaration(d) || Node.isTypeAliasDeclaration(d),
  );
  if (declaresType) return 'type';

  const isPascalCase = /^[A-Z]/.test(name);
  if (isPascalCase) {
    const isComponent = declarations.some((d) => {
      if (Node.isClassDeclaration(d)) return isReactComponentClass(d);
      if (Node.isFunctionDeclaration(d) || Node.isVariableDeclaration(d)) {
        const initializer = Node.isVariableDeclaration(d)
          ? d.getInitializer()
          : d;
        return initializer
          ? looksLikeComponentReturnType(initializer)
          : looksLikeComponentReturnType(d);
      }
      return false;
    });
    if (isComponent) return 'component';
  }

  const isConst =
    declarations.length > 0 &&
    declarations.every(
      (d) =>
        Node.isVariableDeclaration(d) &&
        !looksLikeComponentReturnType(d.getInitializer() ?? d),
    );
  if (isConst) return 'const';

  return 'util';
}

export interface ExtractedSymbol {
  name: string;
  kind: SymbolKind;
  sourceFiles: string[]; // absolute paths
}

export interface ExtractedSymbolWithDeclarations extends ExtractedSymbol {
  /** Live ts-morph declaration nodes — not part of the serialized index, used by the diff module. */
  declarations: ExportedDeclarations[];
}

/**
 * Extracts the fully resolved public symbol table for one entry file, using
 * ts-morph's own `getExportedDeclarations()` rather than hand-rolling a
 * traversal of `export * from` / `export { X as Y } from` — the TS
 * compiler already resolves barrels, cycles and name collisions correctly.
 */
export function extractSymbolsWithDeclarations(
  project: Project,
  entrySourceFile: string,
): ExtractedSymbolWithDeclarations[] {
  const sourceFile =
    project.getSourceFile(entrySourceFile) ??
    project.addSourceFileAtPath(entrySourceFile);

  const exported: Map<string, ExportedDeclarations[]> =
    sourceFile.getExportedDeclarations();

  const symbols: ExtractedSymbolWithDeclarations[] = [];
  for (const [name, declarations] of exported) {
    const sourceFiles = [
      ...new Set(
        declarations.map((d) => d.getSourceFile().getFilePath().toString()),
      ),
    ];
    symbols.push({
      name,
      kind: inferSymbolKind(name, declarations),
      sourceFiles,
      declarations,
    });
  }
  return symbols;
}

export function extractSymbolsFromEntry(
  project: Project,
  entrySourceFile: string,
): ExtractedSymbol[] {
  return extractSymbolsWithDeclarations(project, entrySourceFile).map(
    ({ name, kind, sourceFiles }) => ({ name, kind, sourceFiles }),
  );
}
