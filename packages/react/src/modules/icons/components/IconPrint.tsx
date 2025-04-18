import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconPrint = ({
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
      d="M5 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5h1a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-1v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2H4a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3h1zm2 15v3h10v-6H7zm12-1v-3a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1zM17 3v5H7V3z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconPrint;
