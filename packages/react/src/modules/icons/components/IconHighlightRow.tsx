import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconHighlightRow = ({
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
      d="M1 4.224A3.22 3.22 0 0 1 4.222 1h15.555A3.22 3.22 0 0 1 23 4.224v15.555a3.22 3.22 0 0 1-3.223 3.222H4.222A3.22 3.22 0 0 1 1 19.78zm20 2.353v13.202c0 .675-.548 1.222-1.223 1.222H4.222A1.22 1.22 0 0 1 3 19.78V6.577z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconHighlightRow;
