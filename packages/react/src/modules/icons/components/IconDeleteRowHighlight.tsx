import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconDeleteRowHighlight = ({
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
      fillRule="evenodd"
      d="M3 4.222C3 3.547 3.547 3 4.222 3h15.556C20.453 3 21 3.547 21 4.222v1.444H3zM1 6.666V4.222A3.22 3.22 0 0 1 4.222 1h15.556A3.22 3.22 0 0 1 23 4.222v15.556A3.22 3.22 0 0 1 19.778 23H4.222A3.22 3.22 0 0 1 1 19.778zm20 1v12.112c0 .675-.547 1.222-1.222 1.222H4.222A1.22 1.22 0 0 1 3 19.778V7.666z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconDeleteRowHighlight;
