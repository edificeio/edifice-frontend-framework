import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconSave = ({
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
      d="M5 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h1v-7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7h1a1 1 0 0 0 1-1V8.414L15.586 4H8v3h7a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1V4zm2-2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V8a1 1 0 0 0-.293-.707l-5-5A1 1 0 0 0 16 2zm1 12v6h8v-6z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconSave;
