import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconNetvibes = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M4.33 1.69a2.69 2.69 0 0 0-2.74 2.64v16.3a2.69 2.69 0 0 0 2.74 2.65H20.6a2.7 2.7 0 0 0 2.76-2.65V4.33a2.7 2.7 0 0 0-2.76-2.64zm5.99 3.6h4.18v4.84h4.76v4.18H14.5v4.8h-4.18v-4.8H5.4v-4.18h4.9V5.29z"
    />
  </svg>
);
export default SvgIconNetvibes;
