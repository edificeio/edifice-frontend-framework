import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconNextcloudFiles = ({
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
    <path
      fill="currentColor"
      d="M13.5 6.1H6.1c-1.4 0-2.5 1.1-2.5 2.5v14.9c0 1.4 1.1 2.5 2.5 2.5H26c1.4 0 2.5-1.1 2.5-2.5V11c0-1.4-1.1-2.5-2.5-2.5H16z"
    />
  </svg>
);
export default SvgIconNextcloudFiles;
