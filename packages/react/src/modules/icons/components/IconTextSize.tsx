import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconTextSize = ({
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
      d="M2 4a1 1 0 0 0 0 2h6v13a1 1 0 1 0 2 0V6h6a1 1 0 1 0 0-2zm15 8h-3a1 1 0 1 1 0-2h8a1 1 0 1 1 0 2h-3v7a1 1 0 1 1-2 0z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconTextSize;
