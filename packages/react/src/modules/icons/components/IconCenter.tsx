import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconCenter = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 21 20"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M4.018 2.5C3.456 2.5 3 2.958 3 3.52v2.407a.833.833 0 1 1-1.667 0V3.519A2.685 2.685 0 0 1 4.018.834H7.26a.833.833 0 1 1 0 1.667zm8.89-.833c0-.46.372-.833.833-.833h3.24a2.685 2.685 0 0 1 2.686 2.685v2.408a.833.833 0 0 1-1.667 0V3.519c0-.562-.456-1.018-1.019-1.018h-3.24a.833.833 0 0 1-.834-.834M2.165 13.242c.46 0 .834.373.834.833v2.407c0 .563.456 1.019 1.018 1.019H7.26a.833.833 0 1 1 0 1.666h-3.24a2.685 2.685 0 0 1-2.686-2.685v-2.407c0-.46.373-.833.833-.833m16.667 0c.46 0 .834.373.834.833v2.407a2.685 2.685 0 0 1-2.686 2.686h-3.24a.833.833 0 1 1 0-1.667h3.24c.563 0 1.019-.456 1.019-1.019v-2.407c0-.46.373-.833.833-.833M6.333 10c0-.46.373-.834.833-.834h2.5v-2.5a.833.833 0 1 1 1.667 0v2.5h2.5a.833.833 0 0 1 0 1.667h-2.5v2.5a.833.833 0 0 1-1.667 0v-2.5h-2.5a.833.833 0 0 1-.833-.833"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconCenter;
