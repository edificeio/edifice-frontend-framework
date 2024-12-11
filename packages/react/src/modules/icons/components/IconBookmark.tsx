import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconBookmark = ({
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
      d="M7 4a1 1 0 0 0-1 1v14.06l5.42-3.87a1 1 0 0 1 1.16 0L18 19.06V5a1 1 0 0 0-1-1zM4.88 2.88A3 3 0 0 1 7 2h10a3 3 0 0 1 3 3v16a1 1 0 0 1-1.58.81L12 17.23 5.58 21.8A1 1 0 0 1 4 21V5a3 3 0 0 1 .88-2.12"
    />
  </svg>
);
export default SvgIconBookmark;
