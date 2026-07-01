import type { ImpactIndex } from '@edifice.io/impact-analyzer';

export interface Manifest {
  branches: string[];
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
