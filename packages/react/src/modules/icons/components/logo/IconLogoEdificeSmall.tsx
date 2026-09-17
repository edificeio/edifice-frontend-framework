import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconLogoEdificeSmall = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 18 18"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <g clipPath="url(#icon-logo-edifice-small_svg__a)">
      <path fill="#fff" d="M12.36 0H5.637v1.987h6.725z" />
      <path
        fill="#C8D3FE"
        d="M9 1.949C4.576 1.949.99 5.55.99 9.994h16.02C17.01 5.55 13.424 1.95 9 1.95"
      />
      <path
        fill="#fff"
        d="M12.679 12.176a4.3 4.3 0 0 1-.659.84A4.25 4.25 0 0 1 9 14.266a4.26 4.26 0 0 1-3.02-1.25 4.3 4.3 0 0 1-1.27-3.02v-.003H.99v.039C1.03 14.439 4.6 18 8.999 18c3.656 0 6.74-2.461 7.7-5.825h-4.022z"
      />
    </g>
    <defs>
      <clipPath id="icon-logo-edifice-small_svg__a">
        <path fill="#fff" d="M0 0h18v18H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconLogoEdificeSmall;
