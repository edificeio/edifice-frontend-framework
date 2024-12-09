import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconPages = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M0 23.83V1.28h24.05v22.55zm2.96-2.95h18.13V4.23H2.96v16.63zM4.93 19v-4h4v4zm0-5.27V6.35h14.14v7.38zM10 19v-4h4v4zm5.08 0v-4h3.99v4h-4z"
    />
  </svg>
);
export default SvgIconPages;
