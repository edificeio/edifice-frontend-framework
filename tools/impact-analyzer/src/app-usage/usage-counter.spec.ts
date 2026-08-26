import { Project } from 'ts-morph';
import { describe, expect, it } from 'vitest';
import { resolveEdificeImports } from './import-resolver.js';
import { resolveUsagesForFile } from './usage-counter.js';

function makeSourceFile(source: string) {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: { jsx: 4, strict: false }, // 4 = react-jsx
  });
  return project.createSourceFile('/a.tsx', source);
}

function usagesFor(source: string) {
  const sourceFile = makeSourceFile(source);
  return resolveUsagesForFile(sourceFile, resolveEdificeImports(sourceFile));
}

describe('resolveUsagesForFile', () => {
  it('counts a self-closing JSX usage once', () => {
    const usages = usagesFor(
      `import { Button } from '@edifice.io/react';\nexport function Widget() { return <Button />; }\n`,
    );
    expect(usages.find((u) => u.importedName === 'Button')?.usageSites).toBe(1);
  });

  it('does not double-count a non-self-closing JSX element (opening + closing tag)', () => {
    const usages = usagesFor(
      `import { Button } from '@edifice.io/react';\nexport function Widget() { return <Button>Click</Button>; }\n`,
    );
    expect(usages.find((u) => u.importedName === 'Button')?.usageSites).toBe(1);
  });

  it('does not double-count a non-self-closing namespace JSX element either', () => {
    const usages = usagesFor(
      `import * as FF from '@edifice.io/react';\nexport function Widget() { return <FF.Button>Click</FF.Button>; }\n`,
    );
    const buttonUsage = usages.find(
      (u) => u.importedName === 'Button' && u.viaNamespace,
    );
    expect(buttonUsage?.usageSites).toBe(1);
  });

  it('never counts the import declaration itself as a usage site', () => {
    const usages = usagesFor(`import { Button } from '@edifice.io/react';\n`);
    expect(usages.find((u) => u.importedName === 'Button')?.usageSites).toBe(0);
  });

  it('ignores a local declaration that shadows the imported name in a nested scope', () => {
    // The inner `Button` is a plain local variable, unrelated to the FF
    // import despite sharing its name — must not inflate the FF usage count.
    const usages = usagesFor(
      `import { Button } from '@edifice.io/react';
       export function Widget() {
         function helper() {
           const Button = 'not the FF one';
           return Button.length;
         }
         return <Button />;
       }`,
    );
    expect(usages.find((u) => u.importedName === 'Button')?.usageSites).toBe(1);
  });

  it('does not count a type-only mention inside a JSDoc comment as a usage site', () => {
    // Real case found while benchmarking usage-counter.ts against a real app
    // (wiki): `@returns {Promise<ViewsCounters>}` in a JSDoc comment was
    // counted as a reference by `findReferencesAsNodes()` (the TypeScript
    // language service resolves JSDoc type mentions), on top of the actual
    // type annotation below it — inflating the count to 2 for a symbol used
    // exactly once in real, type-checked code. A JSDoc mention documents
    // intent, it isn't a code dependency the FF could break by renaming the
    // export without a JSDoc going stale (no compile error) — excluding it
    // is intentional, not a gap.
    const usages = usagesFor(
      `import { ViewsCounters } from '@edifice.io/client';
       /**
        * @returns {Promise<ViewsCounters>} resolves to the views counters.
        */
       export async function getCounters(): Promise<ViewsCounters> {
         return {} as any;
       }`,
    );
    expect(
      usages.find((u) => u.importedName === 'ViewsCounters')?.usageSites,
    ).toBe(1);
  });

  it('counts an aliased named import against its real exported name', () => {
    const usages = usagesFor(
      `import { Button as MyButton } from '@edifice.io/react';\nexport function Widget() { return <MyButton />; }\n`,
    );
    const buttonUsage = usages.find((u) => u.importedName === 'Button');
    expect(buttonUsage?.usageSites).toBe(1);
    expect(buttonUsage?.localName).toBe('MyButton');
  });

  it('counts a namespace import per distinct property accessed', () => {
    const usages = usagesFor(
      `import * as FF from '@edifice.io/react';
       export function Widget() {
         return <FF.Button><FF.Badge /></FF.Button>;
       }`,
    );
    expect(usages.find((u) => u.importedName === 'Button')?.usageSites).toBe(1);
    expect(usages.find((u) => u.importedName === 'Badge')?.usageSites).toBe(1);
  });
});
