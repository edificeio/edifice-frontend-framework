import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  DEFAULT_DATA_DIR,
  sanitizeBranchForFilename,
} from '../index-builder/write-index.js';
import type { DiffReport } from '../types/diff-schema.js';

/** Git ref names can never contain ".." (forbidden by git itself), so it's an unambiguous separator here. */
export function diffReportFilePath(
  baseRef: string,
  headRef: string,
  dataDir: string = DEFAULT_DATA_DIR,
): string {
  return join(
    dataDir,
    `diff.${sanitizeBranchForFilename(baseRef)}..${sanitizeBranchForFilename(headRef)}.json`,
  );
}

/** Writes the diff report so the viewer (Jalon 3+) can render it — same data dir as index.<branch>.json. */
export function writeDiffReport(
  report: DiffReport,
  dataDir: string = DEFAULT_DATA_DIR,
): string {
  mkdirSync(dataDir, { recursive: true });
  const filePath = diffReportFilePath(
    report.base.ref,
    report.head.ref,
    dataDir,
  );
  writeFileSync(filePath, JSON.stringify(report, null, 2));
  return filePath;
}
