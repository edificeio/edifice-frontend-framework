import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconPinOn = ({
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
      d="M15.207 3.293a1 1 0 0 0-1.59 1.176l-3.17 3.17-3.798 1.425a1 1 0 0 0-.356.229l-1.5 1.5a1 1 0 0 0 0 1.414L7.586 15l-3.793 3.793a1 1 0 1 0 1.414 1.414L9 16.414l2.793 2.793a1 1 0 0 0 1.414 0l1.5-1.5a1 1 0 0 0 .23-.356l1.423-3.797 3.17-3.17a1 1 0 0 0 1.177-1.591l-.5-.5-4.5-4.5zM15 5.914l-3.293 3.293a1 1 0 0 1-.356.23L7.554 10.86l-.64.64 2.793 2.793 2.793 2.793.64-.64 1.424-3.797a1 1 0 0 1 .229-.356L18.086 9z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconPinOn;
