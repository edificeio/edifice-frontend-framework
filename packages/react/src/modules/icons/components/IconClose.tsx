import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconClose = ({
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
      d="M4.222 4.222a1.1 1.1 0 0 1 1.556 0l14 14a1.1 1.1 0 1 1-1.556 1.556l-14-14a1.1 1.1 0 0 1 0-1.556"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M19.778 4.222a1.1 1.1 0 0 1 0 1.556l-14 14a1.1 1.1 0 1 1-1.556-1.556l14-14a1.1 1.1 0 0 1 1.556 0"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconClose;
