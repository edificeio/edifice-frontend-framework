import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconWorkspace = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 23 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M22.34 8.68v9.45q0 1.23-.89 2.12t-2.12.89H3.01q-1.23 0-2.12-.89T0 18.13V5.25q0-1.23.9-2.12t2.12-.9h4.3q1.23 0 2.12.9t.89 2.12v.43h9.01q1.23 0 2.12.89t.89 2.11z"
    />
  </svg>
);
export default SvgIconWorkspace;
