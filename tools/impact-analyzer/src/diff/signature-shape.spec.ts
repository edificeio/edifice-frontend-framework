import { Project } from 'ts-morph';
import { describe, expect, it } from 'vitest';
import { computeSignatureShape } from './signature-shape.js';

function declarationsFor(source: string, exportName: string) {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: { jsx: 4, strict: false },
  });
  const sourceFile = project.createSourceFile('/a.tsx', source);
  return sourceFile.getExportedDeclarations().get(exportName) ?? [];
}

describe('computeSignatureShape', () => {
  it('produces the same shape for a body-only change (comment added)', () => {
    const base = declarationsFor(
      'export function foo(x: number): number { return x + 1; }',
      'foo',
    );
    const head = declarationsFor(
      'export function foo(x: number): number { /* comment */ return 99; }',
      'foo',
    );
    const baseShape = computeSignatureShape(base);
    const headShape = computeSignatureShape(head);
    expect(baseShape).toEqual({ comparable: true, shape: expect.any(String) });
    expect(baseShape).toEqual(headShape);
  });

  it('produces a different shape when a parameter is added', () => {
    const base = declarationsFor(
      'export function foo(a: string): number { return 1; }',
      'foo',
    );
    const head = declarationsFor(
      'export function foo(a: string, b: number): number { return 2; }',
      'foo',
    );
    expect(computeSignatureShape(base)).not.toEqual(
      computeSignatureShape(head),
    );
  });

  it('is insensitive to interface member reordering', () => {
    const base = declarationsFor(
      'export interface Props { a: string; b: number; }',
      'Props',
    );
    const head = declarationsFor(
      'export interface Props { b: number; a: string; }',
      'Props',
    );
    expect(computeSignatureShape(base)).toEqual(computeSignatureShape(head));
  });

  it('detects an interface member type change', () => {
    const base = declarationsFor(
      'export interface Props { size: string; }',
      'Props',
    );
    const head = declarationsFor(
      'export interface Props { size: number; }',
      'Props',
    );
    expect(computeSignatureShape(base)).not.toEqual(
      computeSignatureShape(head),
    );
  });

  it('is insensitive to function overload reordering', () => {
    const base = declarationsFor(
      `export function foo(a: string): void;
       export function foo(a: number): void;
       export function foo(a: unknown): void {}`,
      'foo',
    );
    const head = declarationsFor(
      `export function foo(a: number): void;
       export function foo(a: string): void;
       export function foo(a: unknown): void {}`,
      'foo',
    );
    expect(computeSignatureShape(base)).toEqual(computeSignatureShape(head));
  });

  it('falls back to non-comparable for a compound component (Object.assign pattern)', () => {
    const decls = declarationsFor(
      `function Root() { return null; }
       function Trigger() { return null; }
       export const Dropdown = Object.assign(Root, { Trigger });`,
      'Dropdown',
    );
    const result = computeSignatureShape(decls);
    expect(result.comparable).toBe(false);
  });

  it('is not comparable when there are no declarations', () => {
    expect(computeSignatureShape([]).comparable).toBe(false);
  });
});
