import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconWand = ({
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
      d="M10 0a1 1 0 0 1 1 1 1 1 0 0 0 1 1 1 1 0 1 1 0 2 1 1 0 0 0-1 1 1 1 0 1 1-2 0 1 1 0 0 0-1-1 1 1 0 0 1 0-2 1 1 0 0 0 1-1 1 1 0 0 1 1-1m9.914 2a2 2 0 0 0-2.828 0L1 18.086a2 2 0 0 0 0 2.828L3.086 23a2 2 0 0 0 2.828 0L22 6.914a2 2 0 0 0 0-2.828zm-3.75 3.75L18.5 3.414 20.586 5.5 18.25 7.836zM14.75 7.164 2.414 19.5 4.5 21.586 16.836 9.25zM21 13a1 1 0 1 0-2 0 1 1 0 0 1-1 1 1 1 0 1 0 0 2 1 1 0 0 1 1 1 1 1 0 1 0 2 0 1 1 0 0 1 1-1 1 1 0 1 0 0-2 1 1 0 0 1-1-1"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconWand;
