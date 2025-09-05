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
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 50 50"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M45.6 20.46v17.43a5.6 5.6 0 0 1-5.54 5.54H9.94A5.3 5.3 0 0 1 6 41.79a5.3 5.3 0 0 1-1.64-3.9V14.11A5.3 5.3 0 0 1 6 10.21a5.3 5.3 0 0 1 3.9-1.64h7.94a5.3 5.3 0 0 1 3.9 1.64 5.3 5.3 0 0 1 1.65 3.9v.8h16.67a5.6 5.6 0 0 1 5.54 5.55"
    />
  </svg>
);
export default SvgIconWorkspace;
