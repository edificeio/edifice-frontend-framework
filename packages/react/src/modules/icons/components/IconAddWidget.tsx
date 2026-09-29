import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconAddWidget = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 20 20"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M15.834 10.833c.46 0 .833.373.833.834v2.5h2.5a.833.833 0 0 1 0 1.666h-2.5v2.5a.833.833 0 0 1-1.667 0v-2.5h-2.5a.833.833 0 0 1 0-1.666H15v-2.5c0-.46.373-.834.834-.834M8.333 3.333A.833.833 0 0 0 7.5 2.5h-5a.833.833 0 0 0-.833.833v13.334c0 .46.373.833.833.833h5c.46 0 .833-.373.833-.833zM10 16.667a2.5 2.5 0 0 1-2.5 2.5h-5a2.5 2.5 0 0 1-2.5-2.5V3.333a2.5 2.5 0 0 1 2.5-2.5h5a2.5 2.5 0 0 1 2.5 2.5zM18.334 3.333A.833.833 0 0 0 17.5 2.5h-3.333a.833.833 0 0 0-.833.833v3.334c0 .46.373.833.833.833H17.5c.46 0 .834-.373.834-.833zM20 6.667a2.5 2.5 0 0 1-2.5 2.5h-3.333a2.5 2.5 0 0 1-2.5-2.5V3.333a2.5 2.5 0 0 1 2.5-2.5H17.5a2.5 2.5 0 0 1 2.5 2.5z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconAddWidget;
