import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconSchoolbook = ({
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
      d="M18.02 8.41V6.4H6v2h12.02zm-4 6.01V12.4h-8v2.02h8.02zm-8-5.02v2.02h12V9.4zm14.03-7c1.07 0 1.97.9 1.97 1.98v12.01c0 1.08-.9 2.02-1.98 2.02H6.02L2 22.4V4.38c0-1.08.9-1.97 1.98-1.97h16.05z"
    />
  </svg>
);
export default SvgIconSchoolbook;
