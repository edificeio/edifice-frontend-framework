/**
 * Risk score has no natural ceiling (severity weight × usage sites × app
 * count), so absolute numbers don't mean anything on their own — the
 * gradient is normalized against the highest score in the current report,
 * consistently with the list already being sorted by risk descending.
 */
export function RiskBadge({
  score,
  maxScore,
}: {
  score: number;
  maxScore: number;
}) {
  const ratio = maxScore > 0 ? Math.min(Math.max(score / maxScore, 0), 1) : 0;
  const hue = 130 - 130 * ratio; // 130 = green (low risk) -> 0 = red (high risk)

  return (
    <span
      className="risk-badge"
      style={{
        background: `hsl(${hue}, 68%, 90%)`,
        color: `hsl(${hue}, 60%, 28%)`,
      }}
      title="Score de risque = poids de sévérité × (sites d'usage + 1) × (apps touchées + 1), la couleur est relative au plus haut score de ce rapport. Aide à trier — ne certifie jamais qu'un changement est sans danger."
    >
      {score}
    </span>
  );
}
