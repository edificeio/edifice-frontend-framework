import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconNotes = ({
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
      d="M1 4a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v13a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h13a1 1 0 1 1 0 2H4a3 3 0 0 1-3-3z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M18 18v1.586L19.586 18zm-2-1a1 1 0 0 1 1-1h5a1 1 0 0 1 .707 1.707l-5 5A1 1 0 0 1 16 22zM6 9a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1M6 14a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconNotes;
