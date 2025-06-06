import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconPearltrees = ({
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
      d="m12.01 15.23 3.53 1.46-.3-3.8 2.48-2.91-3.7-.9-2-3.25-2 3.25-3.72.9 2.48 2.9-.3 3.81zm-10.8-4a10.92 10.92 0 1 1 21.81.62v-.02a10.92 10.92 0 0 1-21.82-.3v-.32.02z"
    />
  </svg>
);
export default SvgIconPearltrees;
