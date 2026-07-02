import { existsSync, mkdirSync, readdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

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

const indexFiles = readdirSync(sourceDataDir).filter(
  (name) => name.startsWith('index.') && name.endsWith('.json'),
);
// Git ref names can never contain ".." (forbidden by git itself), so
// splitting on the first occurrence below is unambiguous.
const diffFiles = readdirSync(sourceDataDir).filter(
  (name) => name.startsWith('diff.') && name.endsWith('.json'),
);

for (const fileName of [...indexFiles, ...diffFiles]) {
  copyFileSync(join(sourceDataDir, fileName), join(targetDataDir, fileName));
}

const branches = indexFiles.map((name) => name.slice('index.'.length, -'.json'.length));
const diffs = diffFiles.map((name) => {
  const label = name.slice('diff.'.length, -'.json'.length);
  const separatorIndex = label.indexOf('..');
  return {
    base: label.slice(0, separatorIndex),
    head: label.slice(separatorIndex + 2),
    file: name,
  };
});
writeFileSync(
  join(targetDataDir, 'manifest.json'),
  JSON.stringify({ branches, diffs }, null, 2),
);

console.log(
  `Synced ${indexFiles.length} index file(s): ${branches.join(', ') || '(none)'} — ${diffFiles.length} diff file(s): ${diffs.map((d) => `${d.base}..${d.head}`).join(', ') || '(none)'}`,
);
