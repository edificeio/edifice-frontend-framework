import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconSetBackground = ({
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
      clipPath="url(#icon-set-background_svg__a)"
      clipRule="evenodd"
    >
      <path d="M21 6H7V4h14a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H4v-2h17a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1" />
      <path d="M17.703 11.502a1 1 0 0 1 .74.269l5.241 4.921a1 1 0 1 1-1.369 1.458l-4.477-4.203-6.578 7.702a1 1 0 0 1-1.52-1.298l7.258-8.5a1 1 0 0 1 .705-.35M12.5 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0M4 16a2 2 0 1 0 0 4v2a4 4 0 1 1 3.772-5.333 1 1 0 1 1-1.886.666A2 2 0 0 0 4 16M4 2a2 2 0 0 0-2 2H0a4 4 0 1 1 8 0H6a2 2 0 0 0-2-2" />
      <path d="M8 4v13a1 1 0 1 1-2 0V4zM0 18V4h2v14z" />
    </g>
    <defs>
      <clipPath id="icon-set-background_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconSetBackground;
