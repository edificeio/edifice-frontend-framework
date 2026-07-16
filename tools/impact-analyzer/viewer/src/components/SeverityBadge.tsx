import type { DiffSeverity } from '@edifice.io/impact-analyzer';

const SEVERITY_LABEL: Record<DiffSeverity, string> = {
  'breaking': '🔴 breaking',
  'likely-breaking': '🟠 likely-breaking',
  // Green, not yellow/orange: a body-only change (signature unchanged) is
  // genuinely the least risky of the 3 levels — yellow read as "caution",
  // overstating changes that are actually low-impact most of the time.
  'needs-review': '🟢 needs-review',
};

export function SeverityBadge({ severity }: { severity: DiffSeverity }) {
  return (
    <span className={`badge badge-severity-${severity}`}>
      {SEVERITY_LABEL[severity]}
    </span>
  );
}
