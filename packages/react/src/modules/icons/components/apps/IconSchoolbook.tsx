import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconSchoolbook = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 50 50"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M36.87 19.39v-3.85H13.94v3.85zm-7.61 11.46V27H13.94v3.85zm-15.32-9.58v3.85h22.93v-3.85zM40.72 7.92a3.78 3.78 0 0 1 3.76 3.76v22.93a3.85 3.85 0 0 1-3.76 3.85H13.94l-7.61 7.62v-34.4a3.79 3.79 0 0 1 3.76-3.76z"
    />
  </svg>
);
export default SvgIconSchoolbook;
