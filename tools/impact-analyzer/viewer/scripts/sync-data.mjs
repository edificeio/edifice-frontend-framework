import {
  existsSync,
  mkdirSync,
  readdirSync,
  copyFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildManifest } from '../server/manifest.mjs';

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

const { branches, diffs, indexFiles, diffFiles } = buildManifest(
  readdirSync(sourceDataDir),
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
