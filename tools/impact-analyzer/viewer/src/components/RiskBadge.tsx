import {
  SEVERITY_WEIGHT,
  type DiffSeverity,
} from '@edifice.io/impact-analyzer';

// Same hue family as SeverityBadge's own colors — the risk badge's base
// color always matches its severity, so a lone entry in a small report
// can't read as "maximally risky" just because it's the only row.
// needs-review is green, not yellow: a body-only change (signature
// unchanged) is genuinely the least risky level — yellow overstated it.
const SEVERITY_HUE: Record<DiffSeverity, number> = {
  'needs-review': 130,
  'likely-breaking': 30,
  'breaking': 0,
};

const SEVERITY_TEXT_COLOR: Record<DiffSeverity, string> = {
  'needs-review': '#1e6b2e',
  'likely-breaking': '#a05a10',
  'breaking': '#a02020',
};

// A fixed reference for the usage×apps multiplier, not the current report's
// max — otherwise a report with only one row always paints it as maximally
// intense, regardless of how small that row actually is. Roughly "heavy
// usage (~50 sites) across nearly this registry's whole app count (~11
// today)". First-pass and deliberately generous, like SEVERITY_WEIGHT —
// revisit as the app registry grows.
const REFERENCE_MULTIPLIER = 60;

/**
 * Color is two-dimensional on purpose: hue = severity (always the dominant,
 * calibrated signal), lightness = usage×apps multiplier within that
 * severity (a secondary, still-uncalibrated signal — plan §13). This keeps
 * a `needs-review` change green and a `breaking` one red regardless of
 * usage counts, instead of one CSS outlier painting an entire report red.
 */
export function RiskBadge({
  severity,
  score,
}: {
  severity: DiffSeverity;
  score: number;
}) {
  const multiplier = score / SEVERITY_WEIGHT[severity];
  const intensity = Math.min(multiplier / REFERENCE_MULTIPLIER, 1);
  const hue = SEVERITY_HUE[severity];
  const lightness = 92 - 14 * intensity;

  return (
    <span
      className="risk-badge"
      style={{
        background: `hsl(${hue}, 75%, ${lightness}%)`,
        color: SEVERITY_TEXT_COLOR[severity],
      }}
      title="Score de risque = poids de sévérité × log2(sites d'usage + 2) × (apps touchées + 1) — la teinte suit la sévérité, sa saturation le nombre de sites d'usage et d'apps touchées. Aide à trier, ne certifie jamais qu'un changement est sans danger."
    >
      {score}
    </span>
  );
}
