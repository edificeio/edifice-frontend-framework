import type {
  AppBranchState,
  CssComponentEntry,
  ImpactIndex,
  OutOfContractImport,
  SymbolEntry,
} from '../types/index-schema.js';

export function findAppState(
  previousIndex: ImpactIndex | undefined,
  app: string,
  branch: string,
): AppBranchState | undefined {
  return previousIndex?.appStates.find(
    (s) => s.app === app && s.branch === branch,
  );
}

/**
 * Re-attaches this (app, branch)'s consumers from a previous run's symbols
 * onto the current symbols, matched by `package|entry|name` — mutates
 * `symbols` in place. A symbol removed/renamed since the previous run
 * simply has no current match and its carried-forward consumer is dropped,
 * which is correct: it no longer exists to report on.
 */
export function carryForwardSymbolConsumers(
  symbols: SymbolEntry[],
  previousSymbols: SymbolEntry[],
  app: string,
  branch: string,
): void {
  const byKey = new Map<string, SymbolEntry>();
  for (const s of symbols) byKey.set(`${s.package}|${s.entry}|${s.name}`, s);

  for (const prevSymbol of previousSymbols) {
    const current = byKey.get(
      `${prevSymbol.package}|${prevSymbol.entry}|${prevSymbol.name}`,
    );
    if (!current) continue;

    for (const consumer of prevSymbol.consumers) {
      if (consumer.app === app && consumer.appBranch === branch) {
        current.consumers.push({ ...consumer, files: [...consumer.files] });
      }
    }
  }
}

export function carryForwardOutOfContract(
  previousImports: OutOfContractImport[],
  app: string,
  branch: string,
): OutOfContractImport[] {
  return previousImports
    .filter((entry) => entry.app === app && entry.appBranch === branch)
    .map((entry) => ({ ...entry, files: [...entry.files] }));
}

/**
 * Same principle as carryForwardSymbolConsumers, matched by the CSS
 * component's `file` instead of a symbol key — mutates `cssComponents` in
 * place.
 */
export function carryForwardCssConsumers(
  cssComponents: CssComponentEntry[],
  previousCssComponents: CssComponentEntry[],
  app: string,
  branch: string,
): void {
  const byFile = new Map<string, CssComponentEntry>();
  for (const c of cssComponents) byFile.set(c.file, c);

  for (const prevComponent of previousCssComponents) {
    const current = byFile.get(prevComponent.file);
    if (!current) continue;

    for (const consumer of prevComponent.consumers) {
      if (consumer.app === app && consumer.appBranch === branch) {
        current.consumers.push({
          ...consumer,
          matchedSelectors: [...consumer.matchedSelectors],
          files: [...consumer.files],
        });
      }
    }
  }
}
