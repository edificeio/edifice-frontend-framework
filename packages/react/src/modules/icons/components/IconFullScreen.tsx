import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconFullScreen = ({
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
      d="M16.667 1a1 1 0 1 0 0 2h2.919l-6.293 6.293a1 1 0 0 0 1.414 1.414L21 4.414v2.92a1 1 0 1 0 2 0V2a1 1 0 0 0-1-1zM7.333 23a1 1 0 1 0 0-2H4.414l6.293-6.293a1 1 0 0 0-1.414-1.414L3 19.586v-2.92a1 1 0 1 0-2 0V22a1 1 0 0 0 1 1z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconFullScreen;
