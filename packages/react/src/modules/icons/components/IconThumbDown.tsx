import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconThumbDown = ({
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
      d="M8.069 15a1.67 1.67 0 0 0 1.16 1.588l3.007-6.765V1.667H3.66a.834.834 0 0 0-.834.708v.002l-1.15 7.498-.009.09a.835.835 0 0 0 .843.869h4.726c.46 0 .833.373.833.833zm8.333-12.5a.833.833 0 0 0-.833-.833h-1.667v7.5h1.667a.833.833 0 0 0 .833-.833zm-10 10H2.52a2.5 2.5 0 0 1-2.49-2.875l1.15-7.5A2.5 2.5 0 0 1 3.668 0h11.9a2.5 2.5 0 0 1 2.5 2.5v5.833a2.5 2.5 0 0 1-2.5 2.5H13.61l-3.114 7.005-.057.108a.83.83 0 0 1-.704.387 3.333 3.333 0 0 1-3.334-3.333z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconThumbDown;
