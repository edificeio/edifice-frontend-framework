import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconTrendingUp = ({
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
      clipPath="url(#icon-trending-up_svg__a)"
      clipRule="evenodd"
    >
      <path d="M23.707 5.293a1 1 0 0 1 0 1.414l-9.5 9.5a1 1 0 0 1-1.414 0L8.5 11.914l-6.793 6.793a1 1 0 0 1-1.414-1.414l7.5-7.5a1 1 0 0 1 1.414 0l4.293 4.293 8.793-8.793a1 1 0 0 1 1.414 0" />
      <path d="M16 6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V7h-5a1 1 0 0 1-1-1" />
    </g>
    <defs>
      <clipPath id="icon-trending-up_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconTrendingUp;
