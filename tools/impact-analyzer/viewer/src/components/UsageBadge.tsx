export function UsageBadge({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'warn' | 'info';
}) {
  return <span className={`badge badge-${tone}`}>{label}</span>;
}
