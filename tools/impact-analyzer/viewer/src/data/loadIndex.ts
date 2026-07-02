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

export async function loadManifest(): Promise<Manifest> {
  const res = await fetch('/data/manifest.json');
  if (!res.ok) throw new Error(`Failed to load manifest.json (${res.status})`);
  return res.json();
}

export async function loadIndexForBranch(branch: string): Promise<ImpactIndex> {
  const res = await fetch(`/data/index.${branch}.json`);
  if (!res.ok)
    throw new Error(
      `Failed to load index for branch "${branch}" (${res.status})`,
    );
  return res.json();
}

export async function loadDiffReport(file: string): Promise<DiffReport> {
  const res = await fetch(`/data/${file}`);
  if (!res.ok)
    throw new Error(`Failed to load diff report "${file}" (${res.status})`);
  return res.json();
}
