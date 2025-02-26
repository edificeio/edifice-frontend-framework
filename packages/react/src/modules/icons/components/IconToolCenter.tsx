import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconToolCenter = ({
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
      d="M3 4.222C3 3.547 3.547 3 4.222 3h3.89a1 1 0 1 0 0-2h-3.89A3.22 3.22 0 0 0 1 4.222v2.89a1 1 0 1 0 2 0zM15.89 1a1 1 0 1 0 0 2h3.888C20.453 3 21 3.547 21 4.222v2.89a1 1 0 1 0 2 0v-2.89A3.22 3.22 0 0 0 19.778 1zM3 16.89a1 1 0 1 0-2 0v2.888A3.22 3.22 0 0 0 4.222 23h3.89a1 1 0 0 0 0-2h-3.89A1.22 1.22 0 0 1 3 19.778zm20 0a1 1 0 0 0-2 0v2.888c0 .675-.547 1.222-1.222 1.222h-3.889a1 1 0 1 0 0 2h3.889A3.22 3.22 0 0 0 23 19.778zM6 11a1 1 0 1 0 0 2h2q.063 0 .124-.008a4.01 4.01 0 0 0 2.884 2.884Q11 15.936 11 16v2a1 1 0 1 0 2 0v-2q0-.063-.008-.124a4.01 4.01 0 0 0 2.884-2.884q.06.008.124.008h2a1 1 0 1 0 0-2h-2q-.063 0-.124.008a4.01 4.01 0 0 0-2.884-2.884Q13 8.064 13 8V6a1 1 0 1 0-2 0v2q0 .063.008.124a4.01 4.01 0 0 0-2.884 2.884A1 1 0 0 0 8 11zm8 1a2 2 0 1 1-4 0 2 2 0 0 1 4 0"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconToolCenter;
