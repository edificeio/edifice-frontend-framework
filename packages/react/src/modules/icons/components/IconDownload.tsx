import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconDownload = ({
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
    <g
      fill="currentColor"
      fillRule="evenodd"
      clipPath="url(#icon-download_svg__a)"
      clipRule="evenodd"
    >
      <path d="M7.293 16.293a1 1 0 0 1 1.414 0L12 19.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414" />
      <path d="M12 11a1 1 0 0 1 1 1v9a1 1 0 1 1-2 0v-9a1 1 0 0 1 1-1" />
      <path d="M8.668 1.994A9 9 0 0 1 17.48 8H18a6.002 6.002 0 0 1 5.689 7.919 6 6 0 0 1-2.234 2.989 1 1 0 1 1-1.15-1.636A4 4 0 0 0 18 10H16.74a1 1 0 0 1-.969-.751A7 7 0 1 0 3.75 15.627a1 1 0 1 1-1.498 1.326A9 9 0 0 1 8.668 1.994" />
    </g>
    <defs>
      <clipPath id="icon-download_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconDownload;
