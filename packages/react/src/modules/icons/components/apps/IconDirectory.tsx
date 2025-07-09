import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconDirectory = ({
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
      d="M6 44.5v-39h39v6.94h-4.25v3.71H45v6.94h-4.25v3.82H45v6.91h-4.25v3.74H45v6.94zm7.5-11.11h19.68v-6.05L25.89 23a5.5 5.5 0 0 0 2.26-2.11 6 6 0 0 0 .86-3A5.47 5.47 0 0 0 27.37 14a5.4 5.4 0 0 0-4-1.68 5.25 5.25 0 0 0-4 1.68 5.63 5.63 0 0 0-1.64 3.94 5.3 5.3 0 0 0 .86 3A6.2 6.2 0 0 0 20.86 23l-7.36 4.34z"
    />
  </svg>
);
export default SvgIconDirectory;
