import { Node, SyntaxKind } from 'ts-morph';

export type SignatureShapeResult =
  | { comparable: true; shape: string }
  | { comparable: false; reason: string };

function functionLikeShape(fn: Node): string | null {
  const fnNode =
    Node.isFunctionDeclaration(fn) || Node.isMethodDeclaration(fn) ? fn : null;
  if (fnNode) return shapeOfCallable(fnNode);

  if (Node.isVariableDeclaration(fn)) {
    const initializer = fn.getInitializer();
    if (
      initializer &&
      (Node.isArrowFunction(initializer) ||
        Node.isFunctionExpression(initializer))
    ) {
      return shapeOfCallable(initializer);
    }
  }
  return null;
}

/**
 * `getText()` on a type parameter includes its constraint and default
 * (`T extends Foo = Bar`), so tightening a constraint or adding/removing a
 * type parameter changes the shape.
 */
function typeParametersShape(
  node: Node & { getTypeParameters: () => Node[] },
): string {
  const typeParams = node.getTypeParameters().map((tp) => tp.getText().trim());
  return typeParams.length > 0 ? `<${typeParams.join(', ')}>` : '';
}

function shapeOfCallable(
  fn: Node & {
    getTypeParameters: () => Node[];
    getParameters: () => Node[];
    getReturnTypeNode: () => Node | undefined;
  },
): string {
  const params = fn
    .getParameters()
    .map((p) => p.getText())
    .join(', ');
  const returnType = fn.getReturnTypeNode()?.getText() ?? '<inferred>';
  return `${typeParametersShape(fn)}(${params}) => ${returnType}`;
}

function interfaceOrTypeShape(decl: Node): string | null {
  if (Node.isInterfaceDeclaration(decl)) {
    // Sorted so a pure reorder (of extends or of members) isn't reported as
    // a shape change. Heritage matters: swapping `extends BaseProps` for
    // another interface changes the public surface without touching members.
    const heritage = decl
      .getExtends()
      .map((e) => e.getText().trim())
      .sort()
      .join(', ');
    const members = decl
      .getMembers()
      .map((m) => m.getText().trim())
      .sort()
      .join('; ');
    return `${typeParametersShape(decl)}${heritage ? `extends ${heritage} :: ` : ''}${members}`;
  }
  if (Node.isTypeAliasDeclaration(decl)) {
    // No independent "members" to sort — a reordered union/tuple is treated
    // as a legitimate shape change for an alias, unlike an interface's props.
    const aliased = decl.getTypeNode()?.getText() ?? decl.getText();
    return `${typeParametersShape(decl)}${aliased}`;
  }
  return null;
}

function isPublicMember(member: Node): boolean {
  if (!Node.isModifierable(member)) return true;
  return (
    !member.hasModifier(SyntaxKind.PrivateKeyword) &&
    !member.hasModifier(SyntaxKind.ProtectedKeyword)
  );
}

function classShape(decl: Node): string | null {
  if (!Node.isClassDeclaration(decl)) return null;

  // Extends is single and ordered by nature; implements are sorted so a
  // pure reorder isn't reported as a shape change.
  const heritage = [
    decl.getExtends()?.getText().trim() ?? '',
    decl
      .getImplements()
      .map((i) => i.getText().trim())
      .sort()
      .join(', '),
  ]
    .filter(Boolean)
    .join(' :: ');

  const ctor = decl.getConstructors()[0];
  const ctorParams = ctor
    ? ctor
        .getParameters()
        .map((p) => p.getText())
        .join(', ')
    : '';

  const methods = decl
    .getMethods()
    .filter(isPublicMember)
    .map(
      (m) =>
        `${m.getName()}${typeParametersShape(m)}(${m
          .getParameters()
          .map((p) => p.getText())
          .join(', ')}): ${m.getReturnTypeNode()?.getText() ?? '<inferred>'}`,
    )
    .sort();

  const properties = decl
    .getProperties()
    .filter(isPublicMember)
    .map((p) => `${p.getName()}: ${p.getTypeNode()?.getText() ?? '<inferred>'}`)
    .sort();

  return `${typeParametersShape(decl)}${heritage} | ctor(${ctorParams}) | ${methods.join(', ')} | ${properties.join(', ')}`;
}

/**
 * Produces a comparable "shape" string for an exported symbol from its
 * declaration text as written. The shape covers type parameters (including
 * constraints and defaults) and heritage clauses (interface `extends`,
 * class `extends`/`implements`) in addition to parameters, return types and
 * members — never through the type checker, whose
 * `type.getText()` embeds an absolute file path (`import("/path").Foo`)
 * that would differ between a temporary base worktree and the real head
 * repo, causing false positives on every symbol referencing a local type.
 *
 * Falls back to `comparable: false` for anything that isn't a recognized
 * function/interface/type-alias/class shape — most notably compound
 * components built via `Object.assign(Root, { Trigger, ... })` (kind
 * 'const' in the FF map heuristic, e.g. Dropdown). Callers must never
 * report `signature-changed` for a non-comparable symbol — only
 * `body-changed`, since we genuinely can't tell whether its shape changed.
 */
export function computeSignatureShape(
  declarations: Node[],
): SignatureShapeResult {
  if (declarations.length === 0) {
    return { comparable: false, reason: 'no declarations' };
  }

  const shapes: string[] = [];
  for (const decl of declarations) {
    const fnShape = functionLikeShape(decl);
    if (fnShape !== null) {
      shapes.push(fnShape);
      continue;
    }

    const typeShape = interfaceOrTypeShape(decl);
    if (typeShape !== null) {
      shapes.push(typeShape);
      continue;
    }

    const clsShape = classShape(decl);
    if (clsShape !== null) {
      shapes.push(clsShape);
      continue;
    }

    return {
      comparable: false,
      reason: `unrecognized declaration kind: ${decl.getKindName()}`,
    };
  }

  // Sorted so overload reordering isn't reported as a shape change.
  return { comparable: true, shape: [...shapes].sort().join(' || ') };
}
