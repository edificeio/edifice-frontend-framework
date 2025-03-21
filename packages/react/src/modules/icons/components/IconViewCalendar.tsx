import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconViewCalendar = ({
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
      d="M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3H4zm9 5h7v4h-7zm-2 4v-4H4v4zm-7 2h7v4H5a1 1 0 0 1-1-1zm-2-1V5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3zm18 1v3a1 1 0 0 1-1 1h-6v-4z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconViewCalendar;
