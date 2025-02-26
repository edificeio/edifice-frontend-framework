import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconAlignCenter = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M2 12a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1M6 4c0-.552.384-1 .857-1h10.286c.473 0 .857.448.857 1s-.384 1-.857 1H6.857C6.384 5 6 4.552 6 4M6 20c0-.552.298-1 .667-1h10.666c.369 0 .667.448.667 1s-.299 1-.667 1H6.667C6.298 21 6 20.552 6 20"
    />
  </svg>
);
export default SvgIconAlignCenter;
