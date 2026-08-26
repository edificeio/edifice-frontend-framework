const DATA_REPO = 'edificeio/impact-analyzer-data';

/**
 * A pointer, not a payload: the `verify-impact-finding` skill fetches and
 * reasons over the full report itself. Embedding symbols/consumers here
 * would make the prompt balloon with the report's size for no benefit —
 * the skill already knows how to read `edificeio/impact-analyzer-data`.
 */
export function buildVerifyPrompt(reportFile: string): string {
  return `Vérifie l'impact de ce rapport Impact Analyzer : ${DATA_REPO}, fichier ${reportFile} (branche main).`;
}
