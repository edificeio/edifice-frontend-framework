import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconDeleteColumnHighlight = ({
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
      d="M3 4.222C3 3.547 3.547 3 4.222 3H6v18H4.222A1.22 1.22 0 0 1 3 19.778zM8 21h11.778c.675 0 1.222-.547 1.222-1.222V4.222C21 3.547 20.453 3 19.778 3H8zM4.222 1A3.22 3.22 0 0 0 1 4.222v15.556A3.22 3.22 0 0 0 4.222 23h15.556A3.22 3.22 0 0 0 23 19.778V4.222A3.22 3.22 0 0 0 19.778 1z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconDeleteColumnHighlight;
