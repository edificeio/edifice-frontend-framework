import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconHomeBeta = ({
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
    <g clipPath="url(#icon-home-beta_svg__a)">
      <path
        fill="#383838"
        d="M15.183.28a1.334 1.334 0 0 1 1.636 0l12 9.335c.325.252.515.64.515 1.052v14.666a4 4 0 0 1-4 4H6.668a4 4 0 0 1-4-4V10.667c0-.411.19-.8.515-1.052zM5.334 11.32v14.014a1.335 1.335 0 0 0 1.334 1.334h4v-12c0-.736.597-1.334 1.333-1.334h8c.736 0 1.333.598 1.333 1.334v12h4a1.335 1.335 0 0 0 1.334-1.334V11.32L16.001 3.023zm8 15.348h5.334V16h-5.334z"
      />
    </g>
    <defs>
      <clipPath id="icon-home-beta_svg__a">
        <path fill="#fff" d="M0 0h32v32H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconHomeBeta;
