#!/usr/bin/env node
// Syncs the exports of the "Edifice Token Extractor" plugin to the 7 SCSS
// files of packages/bootstrap/src/themes/configs/.
//
// Pipeline, in this order (no real write before step 3):
//   1. Patch the 7 files in memory (see orchestrate.ts).
//   2. Check parenthesis balance on each patched text.
//   3. Real Sass compilation (the project's actual `sass` binary) in a temporary
//      copy of packages/bootstrap/src -- abort without writing anything if it fails.
//   4. Write the 7 real files.
//   5. prettier --write then stylelint --fix (the project's actual tools) on the
//      modified files.
//   6. Final Sass re-check, as a safety net, after formatting.
//   7. Write the report (report.json), with the list of guessed names to review.
//
// Usage:
//   tsx src/cli.ts --primitives <primitives.json> --semantic <semantic.json> \
//     [--repo-root <path, default: cwd>] [--report <path, default: report.json>] \
//     [--skip-compile-check] [--skip-format]
//
// --skip-compile-check and --skip-format exist only for experimenting
// outside the real repo (e.g. sandbox without `sass`/`prettier`/`stylelint` installed) --
// never use them on /Volumes/Work/edifice-frontend-framework.

import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';

import { ALL_CONFIG_FILE_NAMES, buildPatchPlan } from './orchestrate.js';
import type { PrimitivesExport, SemanticExport } from './types.js';
import { buildSassArgs } from './validate/build-sass-args.js';
import { checkBalancedParens } from './validate/check-balanced-parens.js';
import { runFormatTools } from './validate/run-format-tools.js';
import { runSassCheck } from './validate/run-sass-check.js';

interface CliOptions {
  primitives: string;
  semantic: string;
  repoRoot: string;
  report: string;
  skipCompileCheck: boolean;
  skipFormat: boolean;
}

function parseCliArgs(argv: string[]): CliOptions {
  const { values } = parseArgs({
    args: argv,
    options: {
      'primitives': { type: 'string' },
      'semantic': { type: 'string' },
      'repo-root': { type: 'string', default: process.cwd() },
      'report': { type: 'string', default: 'report.json' },
      'skip-compile-check': { type: 'boolean', default: false },
      'skip-format': { type: 'boolean', default: false },
    },
  });

  if (!values.primitives || !values.semantic) {
    console.error(
      'Usage: tsx src/cli.ts --primitives <primitives.json> --semantic <semantic.json> ' +
        '[--repo-root <chemin>] [--report <chemin>] [--skip-compile-check] [--skip-format]',
    );
    process.exit(1);
  }

  return {
    primitives: values.primitives,
    semantic: values.semantic,
    repoRoot: path.resolve(values['repo-root']!),
    report: values.report!,
    skipCompileCheck: Boolean(values['skip-compile-check']),
    skipFormat: Boolean(values['skip-format']),
  };
}

function readConfigTexts(configsDir: string): Record<string, string> {
  const texts: Record<string, string> = {};
  for (const fileName of ALL_CONFIG_FILE_NAMES) {
    texts[fileName] = readFileSync(path.join(configsDir, fileName), 'utf8');
  }
  return texts;
}

/**
 * Compiles the patched SCSS in a temporary copy of packages/bootstrap/src
 * (node_modules symlinked, never copied): this is the only check that
 * confirms the patch produces truly valid SCSS, before writing anything
 * to the real repo.
 */
function runTempCompileCheck(
  bootstrapDir: string,
  patchedText: Record<string, string>,
): { ok: boolean; stderr: string } {
  const bootstrapNodeModules = path.join(bootstrapDir, 'node_modules');
  const tempDir = mkdtempSync(path.join(tmpdir(), 'figma-sync-'));
  try {
    cpSync(path.join(bootstrapDir, 'src'), path.join(tempDir, 'src'), {
      recursive: true,
    });
    symlinkSync(
      bootstrapNodeModules,
      path.join(tempDir, 'node_modules'),
      'dir',
    );
    for (const fileName of ALL_CONFIG_FILE_NAMES) {
      writeFileSync(
        path.join(tempDir, 'src/themes/configs', fileName),
        patchedText[fileName],
        'utf8',
      );
    }
    const tempNodeModules = path.join(tempDir, 'node_modules');
    const args = buildSassArgs(
      tempNodeModules,
      path.join(tempDir, 'src/index.scss'),
      path.join(tempDir, 'dist-check.css'),
    );
    return runSassCheck(tempNodeModules, args);
  } finally {
    // Best-effort: a failure to clean up the temporary folder must never
    // hide the result (ok/failure) of the compilation that just ran.
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch (cleanupErr) {
      console.warn(
        `Impossible de supprimer le dossier temporaire "${tempDir}" (sans consequence) :`,
        cleanupErr,
      );
    }
  }
}

async function main(): Promise<void> {
  const opts = parseCliArgs(process.argv.slice(2));

  const configsDir = path.join(
    opts.repoRoot,
    'packages/bootstrap/src/themes/configs',
  );
  const bootstrapDir = path.join(opts.repoRoot, 'packages/bootstrap');
  const bootstrapNodeModules = path.join(bootstrapDir, 'node_modules');
  const repoRootNodeModules = path.join(opts.repoRoot, 'node_modules');

  const primitivesExport: PrimitivesExport = JSON.parse(
    readFileSync(opts.primitives, 'utf8'),
  );
  const semanticExport: SemanticExport = JSON.parse(
    readFileSync(opts.semantic, 'utf8'),
  );

  const existingTexts = readConfigTexts(configsDir);
  const { patchedText, report } = buildPatchPlan(
    primitivesExport.data,
    semanticExport.data,
    existingTexts,
  );

  if (report.skippedThemes.length > 0) {
    console.warn(
      `Theme(s) absent(s) de l'export semantique, ignore(s) : ${report.skippedThemes.join(', ')}`,
    );
  }

  // 1. Parenthesis balance, in memory, before any write.
  const balanceIssues: string[] = [];
  for (const fileName of ALL_CONFIG_FILE_NAMES) {
    const balance = checkBalancedParens(patchedText[fileName]);
    if (!balance.balanced) {
      balanceIssues.push(
        `${fileName} : ${balance.openCount} "(" vs ${balance.closeCount} ")"`,
      );
    }
  }
  if (balanceIssues.length > 0) {
    console.error(
      'Parentheses desequilibrees dans le SCSS genere -- aucun fichier ecrit :',
    );
    for (const issue of balanceIssues) console.error(`  - ${issue}`);
    process.exit(1);
  }

  // 2. Real Sass compilation, in a temporary copy.
  if (opts.skipCompileCheck) {
    console.warn(
      '--skip-compile-check : verification Sass ignoree (ne jamais utiliser sur le vrai repo).',
    );
  } else {
    const check = runTempCompileCheck(bootstrapDir, patchedText);
    if (!check.ok) {
      console.error(
        'La compilation Sass du SCSS patche a echoue -- aucun fichier ecrit :',
      );
      console.error(check.stderr);
      process.exit(1);
    }
  }

  // 3. Write the real files, only now that everything is valid.
  const writtenPaths: string[] = [];
  for (const fileName of ALL_CONFIG_FILE_NAMES) {
    const filePath = path.join(configsDir, fileName);
    writeFileSync(filePath, patchedText[fileName], 'utf8');
    writtenPaths.push(filePath);
  }

  // 4. The project's real formatters/linters on the modified files.
  if (opts.skipFormat) {
    console.warn(
      '--skip-format : prettier/stylelint non executes (ne jamais utiliser sur le vrai repo).',
    );
  } else {
    const formatResults = runFormatTools(
      repoRootNodeModules,
      bootstrapNodeModules,
      writtenPaths,
    );
    for (const r of formatResults) {
      if (!r.ok) {
        console.warn(
          `${r.tool} a signale un probleme (fichiers deja ecrits, a verifier manuellement) :`,
        );
        console.warn(r.stderr);
      }
    }
  }

  // 5. Final Sass re-check, as a safety net, after formatting.
  if (!opts.skipCompileCheck) {
    const outFile = path.join(bootstrapDir, '.figma-sync-check.css');
    const args = buildSassArgs(
      bootstrapNodeModules,
      path.join(bootstrapDir, 'src/index.scss'),
      outFile,
    );
    const finalCheck = runSassCheck(bootstrapNodeModules, args);
    // `sass` also writes a ".map" next to the CSS (default behavior, not
    // disabled here to stay on exactly the same args as the real
    // build): both must disappear, not only the ".css".
    for (const f of [outFile, `${outFile}.map`]) {
      try {
        rmSync(f, { force: true });
      } catch (cleanupErr) {
        // A temporary file that was not deleted is no reason to lose the
        // report (the real work -- patch, validation, write, formatting --
        // is already done at this point): we warn and carry on.
        console.warn(
          `Impossible de supprimer le fichier temporaire "${f}" (sans consequence) :`,
          cleanupErr,
        );
      }
    }
    if (!finalCheck.ok) {
      console.error(
        'ATTENTION : la compilation Sass finale (apres ecriture + formatage) echoue. Fichiers deja ecrits, a corriger manuellement :',
      );
      console.error(finalCheck.stderr);
      process.exitCode = 1;
    }
  }

  writeFileSync(opts.report, JSON.stringify(report, null, 2), 'utf8');
  console.log(`Rapport ecrit : ${opts.report}`);
  if (report.guessedNames.length > 0) {
    console.log(
      `${report.guessedNames.length} nom(s) de variable devine(s) (confidence: "guessed") -- a relire en priorite dans le rapport.`,
    );
  }
  if (report.warnings.length > 0) {
    console.log(
      `${report.warnings.length} avertissement(s) primitivesLegacy -- voir le rapport.`,
    );
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
