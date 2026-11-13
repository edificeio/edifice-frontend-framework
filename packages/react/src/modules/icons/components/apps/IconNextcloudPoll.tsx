import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconNextcloudPoll = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <g fill="currentColor">
      <rect width={7} height={26} x={3} y={2} rx={2.5} ry={2.5} />
      <rect width={7} height={16} x={12} y={12} rx={2.3} ry={2.3} />
      <rect width={7} height={20} x={21} y={8} rx={2.1} ry={2.1} />
    </g>
  </svg>
);
export default SvgIconNextcloudPoll;
