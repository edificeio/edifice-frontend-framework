import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconSearchengine = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 22 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M.27 11.95Q-.3 9.86.27 7.8t2.09-3.6Q3.5 3 5 2.4t3.08-.6q1.56 0 3.05.6t2.65 1.78q1.25 1.25 1.85 2.86t.5 3.3-.86 3.17q.67.19 1.18.7l4.18 4.15q.84.84.84 2.05t-.84 2.04-2.04.84-2.05-.84l-4.16-4.18q-.52-.48-.72-1.18-1.68.84-3.58.84-1.59 0-3.08-.6t-2.64-1.76Q.82 14.04.26 11.95zM2.69 9.9q0 2.23 1.57 3.8 1.58 1.56 3.82 1.56 2.21 0 3.77-1.56t1.6-3.8-1.6-3.8q-1.57-1.6-3.76-1.6-2.21 0-3.82 1.59Q2.7 7.65 2.7 9.89z"
    />
  </svg>
);
export default SvgIconSearchengine;
