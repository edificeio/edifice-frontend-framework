import { buildDiffReport } from '../diff/build-diff-report.js';
import { writeDiffReport } from '../diff/write-diff-report.js';
import type { DiffReport, DiffSeverity } from '../types/diff-schema.js';
import { renderTable } from './format-table.js';

export interface DiffCommandOptions {
  base: string;
  mode?: string;
}

const SEVERITY_EMOJI: Record<DiffSeverity, string> = {
  'breaking': '🔴',
  'likely-breaking': '🟠',
  'needs-review': '🟡',
};

const MAX_INLINE_APPS = 5;

function formatAppNames(apps: string[]): string {
  const unique = [...new Set(apps)];
  if (unique.length <= MAX_INLINE_APPS) return unique.join(', ');
  return `${unique.slice(0, MAX_INLINE_APPS).join(', ')} +${unique.length - MAX_INLINE_APPS} more`;
}

function countBySeverity(report: DiffReport): Record<DiffSeverity, number> {
  const counts: Record<DiffSeverity, number> = {
    'breaking': 0,
    'likely-breaking': 0,
    'needs-review': 0,
  };
  for (const d of report.symbolDiffs) counts[d.severity]++;
  for (const d of report.cssDiffs) counts[d.severity]++;
  return counts;
}

function printSymbolDiffs(report: DiffReport): void {
  if (report.symbolDiffs.length === 0) return;
  console.log(`\nSymbols (${report.base.ref}..${report.head.ref}):`);
  const rows = report.symbolDiffs.map((d) => {
    const apps = [...new Set(d.consumers.map((c) => c.app))];
    return [
      SEVERITY_EMOJI[d.severity],
      `${d.package}${d.entry === '.' ? '' : d.entry.slice(1)} :: ${d.name}`,
      d.changeKind,
      String(d.riskScore),
      String(apps.length),
      formatAppNames(apps),
    ];
  });
  console.log(
    renderTable(['', 'Symbol', 'Change', 'Risk', 'Apps', 'App names'], rows),
  );
}

function printCssDiffs(report: DiffReport): void {
  if (report.cssDiffs.length === 0) return;
  console.log('\nCSS:');
  const rows = report.cssDiffs.map((d) => [
    SEVERITY_EMOJI[d.severity],
    d.file,
    d.scope,
    String(d.riskScore),
    String(d.affectedApps.length),
    formatAppNames(d.affectedApps),
  ]);
  console.log(
    renderTable(['', 'File', 'Scope', 'Risk', 'Apps', 'App names'], rows),
  );
}

/**
 * `impact diff [--base=<ref>] [--mode=local|ci]`. `reportOverride` exists
 * purely for tests — mirrors the injectability pattern already used for
 * `runSymbol`.
 */
export async function runDiff(
  options: DiffCommandOptions,
  reportOverride?: DiffReport,
): Promise<void> {
  const mode = options.mode ?? 'local';
  if (mode !== 'local' && mode !== 'ci') {
    console.error(`Unknown mode "${mode}". Supported: local, ci.`);
    process.exitCode = 1;
    return;
  }

  let report: DiffReport;

  if (reportOverride) {
    report = reportOverride;
  } else {
    try {
      report = await buildDiffReport(options.base, undefined, { mode });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (
        /unknown revision|bad revision|ambiguous argument|invalid reference/i.test(
          message,
        )
      ) {
        console.error(
          `Base ref "${options.base}" not found locally — fetch it first (this tool never fetches automatically).`,
        );
      } else {
        console.error(message);
      }
      process.exitCode = 1;
      return;
    }
  }

  // Always persisted, even when nothing changed — the viewer (Jalon 3+)
  // reads this to show a diff, and a "nothing changed" report is still a
  // valid, useful result to display there.
  const filePath = writeDiffReport(report);
  console.log(`Wrote ${filePath}`);

  if (report.symbolDiffs.length === 0 && report.cssDiffs.length === 0) {
    console.log(
      `No breaking or risky changes detected between ${report.base.ref} and HEAD.`,
    );
    return;
  }

  printSymbolDiffs(report);
  printCssDiffs(report);

  const counts = countBySeverity(report);
  console.log(
    `\n${counts.breaking} breaking, ${counts['likely-breaking']} likely-breaking, ${counts['needs-review']} needs-review`,
  );

  for (const error of report.scanErrors) {
    console.warn(
      `scanError: ${error.app} (${error.branch ?? 'unknown branch'}): ${error.error}`,
    );
  }
}
