#!/usr/bin/env node
// Synchronise les exports du plugin "Edifice Token Extractor" vers les 7 fichiers
// SCSS de packages/bootstrap/src/themes/configs/.
//
// Pipeline, dans cet ordre (aucune ecriture reelle avant l'etape 3) :
//   1. Patch des 7 fichiers en memoire (voir orchestrate.ts).
//   2. Verification d'equilibre des parentheses sur chaque texte patche.
//   3. Compilation Sass reelle (le vrai binaire `sass` du projet) dans une copie
//      temporaire de packages/bootstrap/src -- abandon sans rien ecrire si ca echoue.
//   4. Ecriture des 7 vrais fichiers.
//   5. prettier --write puis stylelint --fix (les vrais outils du projet) sur les
//      fichiers modifies.
//   6. Re-verification Sass finale, par securite, apres le formatage.
//   7. Ecriture du rapport (report.json), avec la liste des noms devines a relire.
//
// Usage :
//   tsx src/cli.ts --primitives <primitives.json> --semantic <semantic.json> \
//     [--repo-root <chemin, defaut: cwd>] [--report <chemin, defaut: report.json>] \
//     [--skip-compile-check] [--skip-format]
//
// --skip-compile-check et --skip-format existent uniquement pour experimenter en
// dehors du vrai repo (ex: sandbox sans `sass`/`prettier`/`stylelint` installes) --
// ne jamais les utiliser sur /Volumes/Work/edifice-frontend-framework.

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
 * Compile le SCSS patche dans une copie temporaire de packages/bootstrap/src
 * (node_modules symlinke, jamais copie) : c'est la seule verification qui
 * confirme que le patch produit du SCSS reellement valide, avant d'ecrire quoi
 * que ce soit dans le vrai repo.
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
    // Best-effort : un echec de nettoyage du dossier temporaire ne doit jamais
    // masquer le resultat (ok/echec) de la compilation qui vient de tourner.
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

  // 1. Equilibre des parentheses, en memoire, avant toute ecriture.
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

  // 2. Compilation Sass reelle, dans une copie temporaire.
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

  // 3. Ecriture des vrais fichiers, seulement maintenant que tout est valide.
  const writtenPaths: string[] = [];
  for (const fileName of ALL_CONFIG_FILE_NAMES) {
    const filePath = path.join(configsDir, fileName);
    writeFileSync(filePath, patchedText[fileName], 'utf8');
    writtenPaths.push(filePath);
  }

  // 4. Formatters/linters reels du projet sur les fichiers modifies.
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

  // 5. Re-verification Sass finale, par securite, apres le formatage.
  if (!opts.skipCompileCheck) {
    const outFile = path.join(bootstrapDir, '.figma-sync-check.css');
    const args = buildSassArgs(
      bootstrapNodeModules,
      path.join(bootstrapDir, 'src/index.scss'),
      outFile,
    );
    const finalCheck = runSassCheck(bootstrapNodeModules, args);
    // `sass` ecrit aussi un ".map" a cote du CSS (comportement par defaut, pas
    // desactive ici pour rester sur exactement les memes args que le vrai
    // build) : les deux doivent disparaitre, pas seulement le ".css".
    for (const f of [outFile, `${outFile}.map`]) {
      try {
        rmSync(f, { force: true });
      } catch (cleanupErr) {
        // Un fichier temporaire non supprime n'est pas une raison de perdre le
        // rapport (le vrai travail -- patch, validation, ecriture, formatage --
        // est deja fait a ce stade) : on signale et on continue.
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
