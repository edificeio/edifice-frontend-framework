import { Project } from 'ts-morph';
import {
  buildKnownEntrySet,
  isEntryInContract,
  toImportPath,
  type KnownFfEntry,
} from './contract-checker.js';
import { resolveEdificeImports } from './import-resolver.js';
import { listAppSourceFiles } from './source-files.js';
import { resolveUsagesForFile } from './usage-counter.js';

export interface AppUsageAggregate {
  package: string;
  entry: string;
  importedName: string;
  usageSites: number;
  files: string[];
  viaNamespace: boolean;
}

export interface OutOfContractUsage {
  package: string;
  importPath: string;
  files: string[];
}

export interface AnalyzeAppResult {
  usages: AppUsageAggregate[];
  outOfContractImports: OutOfContractUsage[];
}

/**
 * Analyzes one app's source tree for @edifice.io/* usage: resolves every
 * import (named/aliased/namespace), counts real usage sites (not just
 * import lines), and separately flags imports that fall outside the FF's
 * declared `exports` contract.
 */
export function analyzeAppUsage(
  srcRoot: string,
  tsconfigPath: string,
  ffEntries: KnownFfEntry[],
): AnalyzeAppResult {
  const knownEntries = buildKnownEntrySet(ffEntries);
  const trackedPackages = new Set(ffEntries.map((e) => e.package));
  const project = new Project({
    tsConfigFilePath: tsconfigPath,
    skipAddingFilesFromTsConfig: true,
  });

  const files = listAppSourceFiles(srcRoot);
  for (const file of files) project.addSourceFileAtPath(file);

  const usageByKey = new Map<string, AppUsageAggregate>();
  const outOfContractByKey = new Map<string, OutOfContractUsage>();

  for (const file of files) {
    const sourceFile = project.getSourceFileOrThrow(file);
    // Only imports from the FF packages we actually track (react, client,
    // utilities, tiptap-extensions, rest-client-base — plan §10 Jalon 1)
    // are evaluated at all. An @edifice.io/* import from an untracked
    // package (e.g. another app's published library, like
    // @edifice.io/wiki-frontend) is out of scope for this analyzer — it's
    // neither a usage we count nor a contract violation to flag.
    const trackedBindings = resolveEdificeImports(sourceFile).filter((b) =>
      trackedPackages.has(b.package),
    );

    const inContractBindings = trackedBindings.filter((b) => {
      if (isEntryInContract(knownEntries, b.package, b.entry)) return true;

      const key = `${b.package}|${b.entry}`;
      const existing = outOfContractByKey.get(key);
      if (existing) {
        if (!existing.files.includes(file)) existing.files.push(file);
      } else {
        outOfContractByKey.set(key, {
          package: b.package,
          importPath: toImportPath(b.package, b.entry),
          files: [file],
        });
      }
      return false;
    });

    for (const usage of resolveUsagesForFile(sourceFile, inContractBindings)) {
      if (usage.usageSites === 0) continue;

      // viaNamespace is kept out of the merge so a plain `import { Button }`
      // and a `NS.Button` access never get silently combined under one flag.
      const key = `${usage.package}|${usage.entry}|${usage.importedName}|${usage.viaNamespace}`;
      const existing = usageByKey.get(key);
      if (existing) {
        existing.usageSites += usage.usageSites;
        if (!existing.files.includes(usage.file))
          existing.files.push(usage.file);
      } else {
        usageByKey.set(key, {
          package: usage.package,
          entry: usage.entry,
          importedName: usage.importedName,
          usageSites: usage.usageSites,
          files: [usage.file],
          viaNamespace: usage.viaNamespace,
        });
      }
    }
  }

  return {
    usages: [...usageByKey.values()],
    outOfContractImports: [...outOfContractByKey.values()],
  };
}
