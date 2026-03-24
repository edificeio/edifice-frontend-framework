import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconLsuMath = ({
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
    <g fill="currentColor" clipPath="url(#icon-lsu-math_svg__a)">
      <path d="M15.574 10.53V.234H4.15C1.88.234.026 2.051.026 4.288v11.224h10.527v8.206h9.708c2.048 0 3.713-1.636 3.713-3.648v-9.54zM2.276 13.3V4.289c0-1.017.84-1.843 1.875-1.843h9.173v8.085h-2.768v2.77zm19.448 6.77c0 .792-.657 1.437-1.463 1.437h-7.458V12.74h8.92z" />
      <path d="M11.003 6.989H8.7V4.723H6.45v2.266H4.147v2.21H6.45v2.263H8.7V9.2h2.303zM20.392 15.795h-5.76v2.211h5.76z" />
    </g>
    <defs>
      <clipPath id="icon-lsu-math_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconLsuMath;
