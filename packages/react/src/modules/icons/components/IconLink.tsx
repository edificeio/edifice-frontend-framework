import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconLink = ({
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
      clipPath="url(#icon-link_svg__a)"
      clipRule="evenodd"
    >
      <path d="M5.333 13.334a3.771 3.771 0 1 0 5.333 5.333l2-2A.943.943 0 0 1 14 18l-2 2a5.657 5.657 0 1 1-8-8l2-2a.943.943 0 1 1 1.333 1.333zm4.667-6A.943.943 0 0 1 10 6l2-2a5.658 5.658 0 0 1 8 8l-2 2a.943.943 0 0 1-1.334-1.333l2-2a3.77 3.77 0 1 0-5.333-5.334l-2 2a.943.943 0 0 1-1.333 0" />
      <path d="M8.464 15.536a1 1 0 0 1 0-1.415l5.657-5.657a1 1 0 1 1 1.414 1.415l-5.657 5.657a1 1 0 0 1-1.414 0" />
    </g>
    <defs>
      <clipPath id="icon-link_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconLink;
