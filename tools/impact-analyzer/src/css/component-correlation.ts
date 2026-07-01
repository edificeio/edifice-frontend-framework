function normalize(name: string): string {
  return name
    .replace(/^_+/, '')
    .replace(/\.scss$/, '')
    .replace(/[-_]+/g, '')
    .toLowerCase();
}

/**
 * Correlates a `_<name>.scss` file with its homonymous React component
 * (plan §5.2: `_dropdown.scss` ↔ `<Dropdown>`) — a simple normalized
 * string match, deliberately not NLP/fuzzy: ambiguity should surface as
 * lower confidence upstream, not be silently guessed away.
 */
export function correlateComponent(
  scssFileBaseName: string,
  componentNames: string[],
): string | undefined {
  const normalizedFileName = normalize(scssFileBaseName);
  return componentNames.find((name) => normalize(name) === normalizedFileName);
}
