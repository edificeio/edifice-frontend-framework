import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconCloseFullScreen = ({
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
      d="M19.333 11a1 1 0 1 0 0-2h-2.919l6.293-6.293a1 1 0 0 0-1.414-1.414L15 7.586v-2.92a1 1 0 1 0-2 0V10a1 1 0 0 0 1 1zM4.667 13a1 1 0 1 0 0 2h2.919l-6.293 6.293a1 1 0 1 0 1.414 1.414L9 16.414v2.92a1 1 0 0 0 2 0V14a1 1 0 0 0-1-1z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconCloseFullScreen;
