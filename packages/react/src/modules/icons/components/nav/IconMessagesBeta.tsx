import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconMessagesBeta = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 32 32"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <g clipPath="url(#icon-messages-beta_svg__a)">
      <path
        stroke="#E5A800"
        strokeMiterlimit={10}
        strokeWidth={2.667}
        d="m5.93 10.246-4.8 3.088v12.267a5.335 5.335 0 0 0 5.334 5.333h24.534v-17.6l-4.689-3.013"
      />
      <path fill="#FCF3CF" d="M26.196 15.468v-14.4H5.93v14.4" />
      <path
        stroke="#FFC403"
        strokeMiterlimit={10}
        strokeWidth={2.667}
        d="M26.196 15.468v-14.4H5.93v14.4"
      />
      <path
        stroke="#E5A800"
        strokeMiterlimit={10}
        strokeWidth={2.667}
        d="M9.13 5.334h13.867M10.197 9.6h11.734M1.13 13.334l14.934 8.533 14.933-8.533"
      />
    </g>
    <defs>
      <clipPath id="icon-messages-beta_svg__a">
        <path fill="#fff" d="M0 0h32v32H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconMessagesBeta;
