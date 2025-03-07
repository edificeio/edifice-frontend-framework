import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconZoomOut = ({
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
      d="M10.95 3.6a7.35 7.35 0 1 0 5.1 12.644 1 1 0 0 1 .194-.195A7.35 7.35 0 0 0 10.95 3.6m0 16.8a9.4 9.4 0 0 0 5.899-2.066l3.858 3.858a1.05 1.05 0 1 0 1.485-1.485l-3.858-3.858A9.4 9.4 0 0 0 20.4 10.95a9.45 9.45 0 1 0-9.45 9.45M7.8 9.9a1.05 1.05 0 0 0 0 2.1h6.3a1.05 1.05 0 1 0 0-2.1z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconZoomOut;
