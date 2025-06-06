import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconDeleteColumn = ({
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
      d="M3 4.222C3 3.547 3.547 3 4.222 3H6v3a1 1 0 0 0 2 0V3h11.778C20.453 3 21 3.547 21 4.222v15.556c0 .675-.547 1.222-1.222 1.222H8v-3a1 1 0 1 0-2 0v3H4.222A1.22 1.22 0 0 1 3 19.778zM6.978 23H4.222A3.22 3.22 0 0 1 1 19.778V4.222A3.22 3.22 0 0 1 4.222 1h15.556A3.22 3.22 0 0 1 23 4.222v15.556A3.22 3.22 0 0 1 19.778 23h-12.8M7 9a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1m4.318-.182a1 1 0 0 1 1.414 0l1.768 1.768 1.767-1.768a1 1 0 1 1 1.415 1.414L15.914 12l1.768 1.768a1 1 0 1 1-1.414 1.414L14.5 13.414l-1.768 1.768a1 1 0 0 1-1.414-1.414L13.086 12l-1.768-1.768a1 1 0 0 1 0-1.414"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconDeleteColumn;
