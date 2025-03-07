import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconTable = ({
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
      d="M4.5 3A1.5 1.5 0 0 0 3 4.5V7h4V3zM7 9H3v10.5A1.5 1.5 0 0 0 4.5 21H7zm2 0h12v10.5a1.5 1.5 0 0 1-1.5 1.5H9zm12-2H9V3h10.5A1.5 1.5 0 0 1 21 4.5zM1 4.5A3.5 3.5 0 0 1 4.5 1h15A3.5 3.5 0 0 1 23 4.5v15a3.5 3.5 0 0 1-3.5 3.5h-15A3.5 3.5 0 0 1 1 19.5z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconTable;
