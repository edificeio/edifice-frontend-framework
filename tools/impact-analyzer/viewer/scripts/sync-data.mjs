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
  writeFileSync(join(targetDataDir, 'manifest.json'), JSON.stringify({ branches: [] }, null, 2));
  process.exit(0);
}

const indexFiles = readdirSync(sourceDataDir).filter(
  (name) => name.startsWith('index.') && name.endsWith('.json'),
);

for (const fileName of indexFiles) {
  copyFileSync(join(sourceDataDir, fileName), join(targetDataDir, fileName));
}

const branches = indexFiles.map((name) => name.slice('index.'.length, -'.json'.length));
writeFileSync(join(targetDataDir, 'manifest.json'), JSON.stringify({ branches }, null, 2));

console.log(`Synced ${indexFiles.length} index file(s): ${branches.join(', ') || '(none)'}`);
