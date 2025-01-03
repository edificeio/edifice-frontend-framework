import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconSortTime = ({
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
      d="M13.509 6.027a6.138 6.138 0 1 1-.28 12.099 1 1 0 1 0-.383 1.963A8.138 8.138 0 1 0 9.653 5.488a1 1 0 1 0 1.168 1.624 6.1 6.1 0 0 1 2.688-1.085"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M14.38 8.252a1 1 0 0 0-1 1v3.8a1 1 0 0 0 .456.838l2.052 1.332a1 1 0 0 0 1.089-1.678l-1.597-1.036V9.252a1 1 0 0 0-1-1M1.793 16.293a1 1 0 0 1 1.414 0L5.5 18.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M5.5 4a1 1 0 0 0-1 1v15a1 1 0 1 0 2 0V5a1 1 0 0 0-1-1"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconSortTime;
