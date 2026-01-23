import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconCalendarEdit = ({
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
      d="M16 1a1 1 0 0 1 1 1v1h1.5a1 1 0 1 1 0 2H17v1a1 1 0 1 1-2 0V5H9v1a1 1 0 0 1-2 0V5H5a1 1 0 0 0-1 1v3h7a1 1 0 1 1 0 2H4v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 1 1 2 0v4a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h2V2a1 1 0 0 1 2 0v1h6V2a1 1 0 0 1 1-1m3.584 5.92a2.685 2.685 0 0 1 3.142 4.353l-11.38 8.21c-.147.106-.32.17-.501.185l-3.261.277a1 1 0 0 1-1.003-1.391l1.29-3.007.063-.121q.106-.176.272-.296zm1.68 1.503a.69.69 0 0 0-.51.12L9.599 16.591l-.523 1.22 1.325-.113 11.154-8.046a.686.686 0 0 0-.041-1.136.7.7 0 0 0-.25-.093"
    />
  </svg>
);
export default SvgIconCalendarEdit;
