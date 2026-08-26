import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  copyFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildManifest, classifyDataFileNames } from '../server/manifest.mjs';

const viewerDir = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceDataDir = join(viewerDir, '..', 'data');
const targetDataDir = join(viewerDir, 'public', 'data');

mkdirSync(targetDataDir, { recursive: true });

if (!existsSync(sourceDataDir)) {
  console.warn(
    `No ${sourceDataDir} found — run "pnpm --filter @edifice.io/impact-analyzer generate:local" first.`,
  );
  writeFileSync(
    join(targetDataDir, 'manifest.json'),
    JSON.stringify({ branches: [], diffs: [] }, null, 2),
  );
  process.exit(0);
}

const allFileNames = readdirSync(sourceDataDir);
const { diffFiles: diffFileNames } = classifyDataFileNames(allFileNames);

// Same content already gets copied below — reading it here too avoids a
// second file format for "when was this diff generated" (see manifest.mjs).
const diffGeneratedAt = new Map();
for (const fileName of diffFileNames) {
  try {
    const parsed = JSON.parse(
      readFileSync(join(sourceDataDir, fileName), 'utf-8'),
    );
    if (typeof parsed.generatedAt === 'string') {
      diffGeneratedAt.set(fileName, parsed.generatedAt);
    }
  } catch {
    // Malformed/partial file — sorts last in the picker, not fatal to the sync.
  }
}

const { branches, diffs, indexFiles, diffFiles } = buildManifest(
  allFileNames,
  diffGeneratedAt,
);

for (const fileName of [...indexFiles, ...diffFiles]) {
  copyFileSync(join(sourceDataDir, fileName), join(targetDataDir, fileName));
}

writeFileSync(
  join(targetDataDir, 'manifest.json'),
  JSON.stringify({ branches, diffs }, null, 2),
);

console.log(
  `Synced ${indexFiles.length} index file(s): ${branches.join(', ') || '(none)'} — ${diffFiles.length} diff file(s): ${diffs.map((d) => `${d.base}..${d.head}`).join(', ') || '(none)'}`,
);
