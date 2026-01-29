import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconLabel = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 18 12"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M2.25 1.5a.75.75 0 0 0-.75.75v7.5c0 .414.336.75.75.75h9.512a.75.75 0 0 0 .552-.242l3.45-3.75a.75.75 0 0 0 0-1.016l-3.45-3.75a.75.75 0 0 0-.552-.242zM0 2.25A2.25 2.25 0 0 1 2.25 0h9.512c.63 0 1.23.264 1.656.727l3.45 3.75a2.25 2.25 0 0 1 0 3.046l-3.45 3.75a2.25 2.25 0 0 1-1.656.727H2.25A2.25 2.25 0 0 1 0 9.75z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconLabel;
