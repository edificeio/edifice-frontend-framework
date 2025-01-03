import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconZoomIn = ({
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
      d="M3.6 10.95a7.35 7.35 0 1 1 12.644 5.1 1 1 0 0 0-.195.194A7.35 7.35 0 0 1 3.6 10.95m13.249 7.384A9.4 9.4 0 0 1 10.95 20.4a9.45 9.45 0 1 1 9.45-9.45 9.4 9.4 0 0 1-2.066 5.899l3.858 3.858a1.05 1.05 0 0 1-1.485 1.485zM10.95 6.75c.58 0 1.05.47 1.05 1.05v2.1h2.1a1.05 1.05 0 0 1 0 2.1H12v2.1a1.05 1.05 0 1 1-2.1 0V12H7.8a1.05 1.05 0 1 1 0-2.1h2.1V7.8c0-.58.47-1.05 1.05-1.05"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconZoomIn;
