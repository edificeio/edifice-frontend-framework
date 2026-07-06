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

  it('detects an added type parameter on a function', () => {
    const base = declarationsFor(
      'export function foo<T>(a: T): T { return a; }',
      'foo',
    );
    const head = declarationsFor(
      'export function foo<T, U>(a: T): T { return a; }',
      'foo',
    );
    expect(computeSignatureShape(base)).not.toEqual(
      computeSignatureShape(head),
    );
  });

  it('detects a tightened type parameter constraint', () => {
    const base = declarationsFor(
      'export function foo<T extends object>(a: T): T { return a; }',
      'foo',
    );
    const head = declarationsFor(
      'export function foo<T extends HTMLElement>(a: T): T { return a; }',
      'foo',
    );
    expect(computeSignatureShape(base)).not.toEqual(
      computeSignatureShape(head),
    );
  });

  it('detects a changed extends clause on an interface', () => {
    const base = declarationsFor(
      `interface BaseProps { a: string; }
       interface OtherProps { b: number; }
       export interface Props extends BaseProps { size: string; }`,
      'Props',
    );
    const head = declarationsFor(
      `interface BaseProps { a: string; }
       interface OtherProps { b: number; }
       export interface Props extends OtherProps { size: string; }`,
      'Props',
    );
    expect(computeSignatureShape(base)).not.toEqual(
      computeSignatureShape(head),
    );
  });

  it('is insensitive to interface extends reordering', () => {
    const base = declarationsFor(
      `interface A { a: string; }
       interface B { b: number; }
       export interface Props extends A, B { size: string; }`,
      'Props',
    );
    const head = declarationsFor(
      `interface A { a: string; }
       interface B { b: number; }
       export interface Props extends B, A { size: string; }`,
      'Props',
    );
    expect(computeSignatureShape(base)).toEqual(computeSignatureShape(head));
  });

  it('detects a type parameter change on a type alias', () => {
    const base = declarationsFor('export type Box<T> = { value: T };', 'Box');
    const head = declarationsFor(
      'export type Box<T extends string> = { value: T };',
      'Box',
    );
    expect(computeSignatureShape(base)).not.toEqual(
      computeSignatureShape(head),
    );
  });

  it('detects a changed extends clause on a class', () => {
    const base = declarationsFor(
      `class A {}
       class B {}
       export class Client extends A {}`,
      'Client',
    );
    const head = declarationsFor(
      `class A {}
       class B {}
       export class Client extends B {}`,
      'Client',
    );
    expect(computeSignatureShape(base)).not.toEqual(
      computeSignatureShape(head),
    );
  });

  it('produces the same shape for a generic function with a body-only change', () => {
    const base = declarationsFor(
      'export function pick<T extends object>(a: T): T { return a; }',
      'pick',
    );
    const head = declarationsFor(
      'export function pick<T extends object>(a: T): T { return { ...a }; }',
      'pick',
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
