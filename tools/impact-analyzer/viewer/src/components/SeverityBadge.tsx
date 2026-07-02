import type { DiffSeverity } from '@edifice.io/impact-analyzer';

const SEVERITY_LABEL: Record<DiffSeverity, string> = {
  'breaking': '🔴 breaking',
  'likely-breaking': '🟠 likely-breaking',
  'needs-review': '🟡 needs-review',
};

export function SeverityBadge({ severity }: { severity: DiffSeverity }) {
  return (
    <span className={`badge badge-severity-${severity}`}>
      {SEVERITY_LABEL[severity]}
    </span>
  );
}
