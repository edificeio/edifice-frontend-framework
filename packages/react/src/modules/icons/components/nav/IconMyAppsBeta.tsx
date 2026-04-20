import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconMyAppsBeta = ({
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
    <g
      stroke="#1C1C73"
      strokeMiterlimit={10}
      strokeWidth={2.667}
      clipPath="url(#icon-my-apps-beta_svg__a)"
    >
      <path d="M31.117 1H19v12.117h12.117zM13.207 18.884H1.09V31h12.117zM1 1.084c6.688 0 12.117 5.43 12.117 12.117H1zM30.934 18.884H18.816V31h12.118z" />
    </g>
    <defs>
      <clipPath id="icon-my-apps-beta_svg__a">
        <path fill="#fff" d="M0 0h32v32H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconMyAppsBeta;
