import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconUserbook = ({
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
      d="M0 24.58V.53h24.05v4.28h-2.62V7.1h2.62v4.28h-2.62v2.35h2.62V18h-2.62v2.3h2.62v4.29H0zm4.64-6.85h12.12V14l-4.5-2.67q.9-.46 1.4-1.3t.53-1.85q0-1.4-1.01-2.43T10.7 4.72 8.25 5.75 7.24 8.18q0 1.03.53 1.85t1.4 1.3L4.63 14v3.73z"
    />
  </svg>
);
export default SvgIconUserbook;
