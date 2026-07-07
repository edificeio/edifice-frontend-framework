import type { DiffReport, ImpactIndex } from '@edifice.io/impact-analyzer';

export interface DiffManifestEntry {
  base: string;
  head: string;
  file: string;
}

export interface Manifest {
  branches: string[];
  diffs: DiffManifestEntry[];
}

/** "The data doesn't exist (yet)" — a normal state, not a failure (see fetchDataJson). */
export class DataUnavailableError extends Error {
  constructor(url: string) {
    super(`No data available at ${url}`);
    this.name = 'DataUnavailableError';
  }
}

/**
 * Fetches one of the /data JSON files, telling "not there yet" apart from a
 * real failure: a 404 (prod server), an HTML body served with a 200 (Vite's
 * SPA fallback for a missing public file, in dev) or an unparsable body
 * (file mid-sync) all mean the data simply doesn't exist yet — e.g. right
 * after a deploy on an empty data repo. Callers surface that as a calm
 * "nothing to show yet" hint instead of a raw JSON.parse SyntaxError.
 */
async function fetchDataJson(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (res.status === 404) throw new DataUnavailableError(url);
  if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('json')) throw new DataUnavailableError(url);
  try {
    return (await res.json()) as unknown;
  } catch {
    throw new DataUnavailableError(url);
  }
}

/** A missing manifest is the empty state (fresh deploy), never an error. */
export async function loadManifest(): Promise<Manifest> {
  try {
    return (await fetchDataJson('/data/manifest.json')) as Manifest;
  } catch (error) {
    if (error instanceof DataUnavailableError)
      return { branches: [], diffs: [] };
    throw error;
  }
}

export async function loadIndexForBranch(branch: string): Promise<ImpactIndex> {
  return (await fetchDataJson(`/data/index.${branch}.json`)) as ImpactIndex;
}

export async function loadDiffReport(file: string): Promise<DiffReport> {
  return (await fetchDataJson(`/data/${file}`)) as DiffReport;
}
