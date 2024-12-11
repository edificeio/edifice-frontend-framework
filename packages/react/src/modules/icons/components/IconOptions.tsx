import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconOptions = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <circle cx={12} cy={4} r={2.5} fill="currentColor" />
    <circle cx={12} cy={12} r={2.5} fill="currentColor" />
    <circle cx={12} cy={20} r={2.5} fill="currentColor" />
  </svg>
);
export default SvgIconOptions;
