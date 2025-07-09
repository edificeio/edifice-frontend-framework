import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconNabook = ({
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
      d="M40.619 4.796 43 40.075l-13.057 2.903-9.303-17.877 1.181 19.267-11.34 1.428L7 9.03l12.526-2.207 10.948 17.512-1.7-17.627z"
    />
  </svg>
);
export default SvgIconNabook;
