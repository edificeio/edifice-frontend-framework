import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconRestart = ({
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
      d="M17.919 3.15c1.33-.856 3.081.1 3.081 1.682v14.336c0 1.583-1.75 2.538-3.081 1.683L7 13.83V19a2 2 0 1 1-4 0V5a2 2 0 1 1 4 0v5.168z"
    />
  </svg>
);
export default SvgIconRestart;
