import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconSuitcase = ({
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
      d="M21.64 5.34q1.01 0 1.7.72t.7 1.69v13.22q0 1.01-.7 1.7t-1.7.7h-1.2V5.34zM0 7.74q0-.96.72-1.68t1.68-.72h1.2v18.04H2.4q-.96 0-1.68-.7T0 20.98zm16.11-4.9v2.5h2.65v18.04H5.29V5.34h2.65v-2.5q2.35-1.1 4.08-1.1t4.1 1.1zm-1.44 2.5V3.75q-1.25-.57-2.65-.57-1.3 0-2.64.57v1.6h5.29z"
    />
  </svg>
);
export default SvgIconSuitcase;
