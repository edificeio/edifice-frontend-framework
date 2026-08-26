// Shared between the local dev sync (scripts/sync-data.mjs) and the
// container's runtime refresh loop (server/refresh-data.mjs) — same
// filename convention, same manifest shape, whether the file names come
// from a local directory listing or a GitHub Contents API listing.

/** Git ref names can never contain ".." (forbidden by git itself), so splitting on the first occurrence below is unambiguous. */
export function classifyDataFileNames(fileNames) {
  const indexFiles = fileNames.filter(
    (name) => name.startsWith('index.') && name.endsWith('.json'),
  );
  const diffFiles = fileNames.filter(
    (name) => name.startsWith('diff.') && name.endsWith('.json'),
  );
  return { indexFiles, diffFiles };
}

/**
 * `diffGeneratedAt`: filename -> the report's own `generatedAt` (ISO
 * string), when the caller could read it — callers already download/read
 * every diff file's content, so this costs no extra I/O. Missing entries
 * (malformed file, or no map passed at all) get `null` and sort last in the
 * viewer rather than blocking the whole manifest.
 */
export function buildManifest(fileNames, diffGeneratedAt = new Map()) {
  const { indexFiles, diffFiles } = classifyDataFileNames(fileNames);

  const branches = indexFiles.map((name) =>
    name.slice('index.'.length, -'.json'.length),
  );
  const diffs = diffFiles.map((name) => {
    const label = name.slice('diff.'.length, -'.json'.length);
    const separatorIndex = label.indexOf('..');
    return {
      base: label.slice(0, separatorIndex),
      head: label.slice(separatorIndex + 2),
      file: name,
      generatedAt: diffGeneratedAt.get(name) ?? null,
    };
  });

  return { branches, diffs, indexFiles, diffFiles };
}
